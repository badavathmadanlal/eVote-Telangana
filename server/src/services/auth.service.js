import userRepository from '../repositories/user.repository.js';
import Otp from '../models/otp.model.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import jwtUtils from '../utils/jwt.js';
import emailService from '../utils/emailService.js';
import smsProvider from '../utils/smsProvider.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import envConfig from '../config/env.js';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    const userExists = await userRepository.findByEmail(userData.email);
    if (userExists) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this email already exists');
    }
    
    if (userData.mobileNumber) {
      const mobileExists = await userRepository.findByMobileNumber(userData.mobileNumber);
      if (mobileExists) {
         throw new ApiError(HTTP_STATUS.CONFLICT, 'User with this mobile number already exists');
      }
    }

    const user = await userRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      password: userData.password,
      role: 'voter', 
    });

    const token = jwtUtils.generateToken(user._id);
    return { user, token };
  }

  /**
   * Login a user with email/mobile and password
   */
  async login({ emailOrMobile, password }) {
    const user = await userRepository.findByEmailOrMobile(emailOrMobile);
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
   * Send login OTP
   */
  async sendLoginOtp(mobileNumber) {
    const user = await userRepository.findByMobileNumber(mobileNumber);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Mobile number not registered');
    }

    // Rate limit check
    const recentOtp = await Otp.findOne({ identifier: mobileNumber, purpose: 'LOGIN_OTP' });
    if (recentOtp && (Date.now() - recentOtp.updatedAt.getTime() < 60000)) {
       throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, 'Please wait 60 seconds before requesting another OTP');
    }

    const otpCode = this.generateNumericOtp();
    
    // Invalidate old OTPs for this purpose
    await Otp.deleteMany({ identifier: mobileNumber, purpose: 'LOGIN_OTP' });

    await Otp.create({
      identifier: mobileNumber,
      otp: otpCode,
      purpose: 'LOGIN_OTP',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });

    await smsProvider.sendSms(mobileNumber, `Your eVote login OTP is ${otpCode}. Valid for 5 minutes.`);

    return { message: 'OTP sent successfully' };
  }

  /**
   * Verify login OTP
   */
  async verifyLoginOtp(mobileNumber, otpCode) {
    const otpRecord = await Otp.findOne({ identifier: mobileNumber, purpose: 'LOGIN_OTP' });
    
    if (!otpRecord) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'OTP expired or invalid');
    }

    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Too many failed attempts. Please request a new OTP.');
    }

    if (otpRecord.otp !== otpCode) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid OTP');
    }

    // Success
    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await userRepository.findByMobileNumber(mobileNumber);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    // Mark as verified if not already
    if (!user.isMobileVerified) {
      await userRepository.update(user._id, { isMobileVerified: true });
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
    const user = await userRepository.findByEmailOrMobile(identifier);
    if (!user) {
      // Security: Don't reveal if user exists, just return success
      return { message: 'If an account exists, a reset OTP has been sent.' };
    }

    const recentOtp = await Otp.findOne({ identifier, purpose: 'RESET_PASSWORD' });
    if (recentOtp && (Date.now() - recentOtp.updatedAt.getTime() < 60000)) {
       throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, 'Please wait 60 seconds before requesting another OTP');
    }

    const otpCode = this.generateNumericOtp();
    await Otp.deleteMany({ identifier, purpose: 'RESET_PASSWORD' });

    await Otp.create({
      identifier,
      otp: otpCode,
      purpose: 'RESET_PASSWORD',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) 
    });

    if (identifier.includes('@')) {
       await emailService.sendMail({
         to: identifier,
         subject: 'eVote Telangana - Password Reset OTP',
         html: emailService.getResetPasswordTemplate(user.firstName, otpCode)
       });
    } else {
       await smsProvider.sendSms(identifier, `Your eVote password reset OTP is ${otpCode}. Valid for 5 minutes.`);
    }

    return { message: 'If an account exists, a reset OTP has been sent.' };
  }

  /**
   * Verify Reset OTP and provide a short-lived token to set new password
   */
  async verifyResetOtp(identifier, otpCode) {
    const otpRecord = await Otp.findOne({ identifier, purpose: 'RESET_PASSWORD' });
    
    if (!otpRecord) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'OTP expired or invalid');
    }

    if (otpRecord.attempts >= 3) {
      await Otp.deleteOne({ _id: otpRecord._id });
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Too many failed attempts. Please request a new OTP.');
    }

    if (otpRecord.otp !== otpCode) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid OTP');
    }

    await Otp.deleteOne({ _id: otpRecord._id });
    
    const user = await userRepository.findByEmailOrMobile(identifier);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
    }

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

    if (user.email) {
      await emailService.sendMail({
         to: user.email,
         subject: 'eVote Telangana - Password Reset Successful',
         html: emailService.getSuccessPasswordResetTemplate(user.firstName)
      });
    }

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
