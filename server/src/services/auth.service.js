import userRepository from '../repositories/user.repository.js';
import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import jwtUtils from '../utils/jwt.js';
import emailService from '../utils/emailService.js';
import smsProvider from '../utils/smsProvider.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import envConfig from '../config/env.js';
import { DEMO_CITIZENS, isDemoMobile, getDemoCitizen, DEMO_OTP } from '../constants/demoAccounts.js';

class AuthService {
  /**
   * Helper to ensure a demo citizen account exists in the database
   */
  async ensureDemoCitizen(mobile) {
    const demoData = getDemoCitizen(mobile);
    if (!demoData) return null;

    let user = await User.findOne({ mobileNumber: demoData.mobileNumber });
    if (!user) {
      user = await User.create({
        firstName: demoData.firstName,
        lastName: demoData.lastName,
        mobileNumber: demoData.mobileNumber,
        aadhaar: demoData.aadhaar,
        epicNumber: demoData.epicNumber,
        state: demoData.state,
        district: demoData.district,
        mandal: demoData.mandal,
        village: demoData.village,
        constituency: demoData.constituency,
        address: demoData.address,
        email: demoData.email,
        password: crypto.randomBytes(16).toString('hex') + 'A1!',
        role: 'voter',
        isMobileVerified: true,
        isKycVerified: false,
        kycStatus: 'pending',
        isDemoAccount: true,
      });
    } else {
      user.firstName = demoData.firstName;
      user.lastName = demoData.lastName;
      user.isDemoAccount = true;
      user.isMobileVerified = true;
      user.epicNumber = demoData.epicNumber;
      user.state = demoData.state;
      user.district = demoData.district;
      user.mandal = demoData.mandal;
      user.village = demoData.village;
      user.constituency = demoData.constituency;
      if (!user.address) user.address = demoData.address;
      user.email = demoData.email;
      // Preserve isKycVerified if already verified
      if (user.isKycVerified) {
        user.kycStatus = 'verified';
      }
      await user.save();
    }
    return user;
  }

  /**
   * Register a new voter or citizen
   */
  async register(userData) {
    const cleanMobile = userData.mobileNumber ? String(userData.mobileNumber).trim().replace(/\D/g, '') : undefined;
    const cleanAadhaar = userData.aadhaar ? String(userData.aadhaar).trim().replace(/\D/g, '') : undefined;
    const cleanWhatsApp = userData.whatsappNumber ? String(userData.whatsappNumber).trim().replace(/\D/g, '') : undefined;

    // Detect Academic Demo numbers first before duplicate account check
    if (cleanMobile && isDemoMobile(cleanMobile)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        'This is an academic demo account. Please use Citizen Login to access it.'
      );
    }

    if (cleanMobile) {
      const mobileExists = await userRepository.findByMobileNumber(cleanMobile);
      if (mobileExists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'A voter account with this mobile number already exists. Please log in with OTP.');
      }
    }

    if (userData.email) {
      const userExists = await userRepository.findByEmail(userData.email);
      if (userExists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
      }
    }

    if (cleanAadhaar) {
      const aadhaarExists = await User.findOne({ aadhaar: cleanAadhaar });
      if (aadhaarExists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'A voter account with this Aadhaar number already exists. Please log in with OTP.');
      }
    }

    const securePassword = userData.password || crypto.randomBytes(16).toString('hex') + 'A1!';
    
    const citizenEmail = userData.email 
      ? userData.email.toLowerCase() 
      : (cleanMobile ? `voter_${cleanMobile}@evote.telangana.gov.in` : `voter_${Date.now()}@evote.telangana.gov.in`);

    const user = await userRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: citizenEmail,
      mobileNumber: cleanMobile,
      aadhaar: cleanAadhaar,
      whatsappNumber: cleanWhatsApp,
      password: securePassword,
      role: 'voter',
      isMobileVerified: false,
      isDemoAccount: false,
    });

    let targetMobileDisplay = '';
    if (cleanMobile) {
      await Otp.deleteMany({ identifier: cleanMobile, purpose: 'LOGIN_OTP' });

      if (smsProvider.isSmartOtpConfigured()) {
        await smsProvider.sendSmartOtp(cleanMobile);
        await Otp.create({
          identifier: cleanMobile,
          otp: 'FAST2SMS_SMART_OTP',
          purpose: 'LOGIN_OTP',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });
      } else {
        const otpCode = this.generateNumericOtp();
        await Otp.create({
          identifier: cleanMobile,
          otp: otpCode,
          purpose: 'LOGIN_OTP',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });
        await smsProvider.sendSms(cleanMobile, `Your eVote registration verification OTP is ${otpCode}. Valid for 5 minutes.`, {
          otpCode,
          purpose: 'LOGIN_OTP'
        });
      }

      targetMobileDisplay = `●●●●●●${cleanMobile.slice(-4)}`;
    }

    const token = jwtUtils.generateToken(user._id);
    return { 
      user, 
      token, 
      targetMobile: targetMobileDisplay,
      mobileNumber: cleanMobile,
      message: cleanMobile ? 'Voter registered! Verification OTP dispatched to your mobile.' : 'Voter registered successfully.'
    };
  }

  /**
   * Login a user with email/mobile and password
   */
  async login({ emailOrMobile, password }) {
    const cleanId = String(emailOrMobile).trim();
    const user = await User.findOne({
      $or: [
        { email: cleanId.toLowerCase() },
        { mobileNumber: cleanId.replace(/\D/g, '') },
        { aadhaar: cleanId.replace(/\D/g, '') }
      ]
    }).select('+password');

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid credentials');
    }

    const userObject = user.toObject();
    delete userObject.password;

    const token = jwtUtils.generateToken(user._id);
    return { user: userObject, token };
  }

  /**
   * Helper to generate 6 digit OTP
   */
  generateNumericOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send login OTP to mobile or Aadhaar-linked mobile
   */
  async sendLoginOtp(identifier) {
    const cleanId = String(identifier).trim().replace(/\D/g, '');

    // 1. Handle Academic Demo Accounts (Do NOT call Fast2SMS, No 60s blockage)
    if (isDemoMobile(cleanId)) {
      const demoUser = await this.ensureDemoCitizen(cleanId);
      const targetMobile = demoUser.mobileNumber;

      // Invalidate old OTPs & create fresh demo OTP session
      await Otp.deleteMany({ identifier: targetMobile, purpose: 'LOGIN_OTP' });
      await Otp.create({
        identifier: targetMobile,
        otp: DEMO_OTP,
        purpose: 'LOGIN_OTP',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      });

      return {
        message: 'Demo OTP generated successfully',
        targetMobile: `●●●●●●${targetMobile.slice(-4)}`,
        isDemo: true
      };
    }
    
    // 2. Standard Registered Voter Lookup
    const user = await User.findOne({
      $or: [
        { mobileNumber: cleanId },
        { aadhaar: cleanId }
      ]
    });

    if (!user || !user.mobileNumber) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Mobile number or Aadhaar is not registered in the system');
    }

    const targetMobile = user.mobileNumber;

    // Rate limit check (60s cooldown) for real non-demo users
    const recentOtp = await Otp.findOne({ identifier: targetMobile, purpose: 'LOGIN_OTP' });
    if (recentOtp && (Date.now() - recentOtp.updatedAt.getTime() < 60000)) {
      throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, 'Please wait 60 seconds before requesting another OTP');
    }

    // Invalidate old OTPs
    await Otp.deleteMany({ identifier: targetMobile, purpose: 'LOGIN_OTP' });

    if (smsProvider.isSmartOtpConfigured()) {
      await smsProvider.sendSmartOtp(targetMobile);
      await Otp.create({
        identifier: targetMobile,
        otp: 'FAST2SMS_SMART_OTP',
        purpose: 'LOGIN_OTP',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });
    } else {
      const otpCode = this.generateNumericOtp();
      await Otp.create({
        identifier: targetMobile,
        otp: otpCode,
        purpose: 'LOGIN_OTP',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000)
      });

      await smsProvider.sendSms(targetMobile, `Your eVote login OTP is ${otpCode}. Valid for 5 minutes.`, {
        otpCode,
        purpose: 'LOGIN_OTP'
      });
    }

    return { 
      message: 'OTP sent successfully',
      targetMobile: `●●●●●●${targetMobile.slice(-4)}`
    };
  }

  /**
   * Verify login OTP
   */
  async verifyLoginOtp(identifier, otpCode) {
    const cleanId = String(identifier).trim().replace(/\D/g, '');

    // 1. Handle Academic Demo Accounts
    if (isDemoMobile(cleanId)) {
      if (String(otpCode).trim() !== DEMO_OTP) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid Demo OTP. Please enter 123456 for academic demo accounts.');
      }

      const demoUser = await this.ensureDemoCitizen(cleanId);
      await Otp.deleteMany({ identifier: cleanId, purpose: 'LOGIN_OTP' });

      const userObject = demoUser.toObject();
      delete userObject.password;
      userObject.isDemoAccount = true;

      const token = jwtUtils.generateToken(demoUser._id);
      return { user: userObject, token };
    }

    // 2. Standard Registered Voter Verification
    const user = await User.findOne({
      $or: [
        { mobileNumber: cleanId },
        { aadhaar: cleanId }
      ]
    });

    if (!user || !user.mobileNumber) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User record not found');
    }

    const targetMobile = user.mobileNumber;
    const otpRecord = await Otp.findOne({ identifier: targetMobile, purpose: 'LOGIN_OTP' });
    
    if (!otpRecord) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'OTP expired or invalid. Please request a new OTP.');
    }

    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Too many failed attempts. Please request a new OTP.');
    }

    // If Smart OTP is configured and this wasn't an internal OTP
    if (smsProvider.isSmartOtpConfigured() && otpRecord.otp === 'FAST2SMS_SMART_OTP') {
      const verifyRes = await smsProvider.verifySmartOtp(targetMobile, otpCode);
      if (!verifyRes.success) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, verifyRes.message || 'Invalid or expired OTP');
      }
    } else {
      // Local verification
      if (otpRecord.otp !== String(otpCode).trim()) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid OTP');
      }
    }

    // Success -> delete OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    if (!user.isMobileVerified) {
      user.isMobileVerified = true;
      await user.save();
    }

    const userObject = user.toObject();
    delete userObject.password;

    const token = jwtUtils.generateToken(user._id);
    return { user: userObject, token };
  }

  /**
   * Forgot password: Send OTP
   */
  async forgotPassword(identifier) {
    const cleanId = String(identifier).trim();
    const user = await User.findOne({
      $or: [
        { email: cleanId.toLowerCase() },
        { mobileNumber: cleanId.replace(/\D/g, '') },
        { aadhaar: cleanId.replace(/\D/g, '') }
      ]
    });

    if (!user) {
      return { message: 'If an account exists, a reset OTP has been dispatched.' };
    }

    const targetIdentifier = user.mobileNumber || user.email;

    const recentOtp = await Otp.findOne({ identifier: targetIdentifier, purpose: 'RESET_PASSWORD' });
    if (recentOtp && (Date.now() - recentOtp.updatedAt.getTime() < 60000)) {
      throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, 'Please wait 60 seconds before requesting another OTP');
    }

    const otpCode = this.generateNumericOtp();
    await Otp.deleteMany({ identifier: targetIdentifier, purpose: 'RESET_PASSWORD' });

    await Otp.create({
      identifier: targetIdentifier,
      otp: otpCode,
      purpose: 'RESET_PASSWORD',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
    });

    if (user.mobileNumber) {
      if (smsProvider.isSmartOtpConfigured()) {
        await smsProvider.sendSmartOtp(user.mobileNumber);
      } else {
        await smsProvider.sendSms(user.mobileNumber, `Your eVote password reset OTP is ${otpCode}. Valid for 5 minutes.`, {
          otpCode,
          purpose: 'RESET_PASSWORD'
        });
      }
    } else if (user.email) {
      await emailService.sendMail({
        to: user.email,
        subject: 'eVote Telangana - Password Reset OTP',
        html: emailService.getResetPasswordTemplate(user.firstName, otpCode)
      });
    }

    return { message: 'If an account exists, a reset OTP has been dispatched.' };
  }

  /**
   * Verify Reset OTP
   */
  async verifyResetOtp(identifier, otpCode) {
    const cleanId = String(identifier).trim();
    const user = await User.findOne({
      $or: [
        { email: cleanId.toLowerCase() },
        { mobileNumber: cleanId.replace(/\D/g, '') },
        { aadhaar: cleanId.replace(/\D/g, '') }
      ]
    });

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    const targetIdentifier = user.mobileNumber || user.email;
    const otpRecord = await Otp.findOne({ identifier: targetIdentifier, purpose: 'RESET_PASSWORD' });
    
    if (!otpRecord) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'OTP expired or invalid');
    }

    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Too many failed attempts. Please request a new OTP.');
    }

    if (user.mobileNumber && smsProvider.isSmartOtpConfigured()) {
      const verifyRes = await smsProvider.verifySmartOtp(user.mobileNumber, otpCode);
      if (!verifyRes.success) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, verifyRes.message || 'Invalid or expired OTP');
      }
    } else {
      if (otpRecord.otp !== String(otpCode).trim()) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid OTP');
      }
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    // Issue a 15-minute temporary reset token
    const resetToken = jwt.sign(
      { id: user._id, purpose: 'password_reset' }, 
      envConfig.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    return { resetToken, message: 'OTP verified successfully' };
  }

  /**
   * Reset Password
   */
  async resetPassword(resetToken, newPassword) {
    let decoded;
    try {
      decoded = jwt.verify(resetToken, envConfig.JWT_SECRET);
    } catch (err) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid or expired reset token');
    }

    if (decoded.purpose !== 'password_reset') {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid token purpose');
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  /**
   * Get all users
   */
  async getAllUsers(query = {}) {
    return userRepository.findAll(query);
  }
}

export default new AuthService();
