import bcrypt from 'bcryptjs';
import citizenRepository from '../repositories/citizen.repository.js';
import User from '../models/user.model.js';
import Citizen from '../models/citizen.model.js';
import CitizenMaster from '../models/citizenMaster.model.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { isDemoMobile, getDemoCitizen } from '../constants/demoAccounts.js';

class CitizenService {
  /**
   * Verify Citizen credentials against Election Commission Database
   * @param {string} userId - User ID
   * @param {Object} verificationData - Contains voterId and aadhaar
   */
  async verifyCitizen(userId, { voterId, aadhaar }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User profile not found');
    }

    const cleanVoterId = String(voterId || '').trim().toUpperCase();
    const rawAadhaar = String(aadhaar || '').trim();

    // 1. DEMO CITIZEN VERIFICATION FLOW
    const isDemo = user.isDemoAccount || isDemoMobile(user.mobileNumber) || cleanVoterId.startsWith('DEMO-');
    if (isDemo) {
      const demoConfig = getDemoCitizen(user.mobileNumber);
      
      // If user is a registered demo user, validate that submitted credentials match
      if (demoConfig) {
        const expectedEpic = demoConfig.epicNumber;
        if (cleanVoterId !== expectedEpic && !cleanVoterId.startsWith('DEMO-')) {
          throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Verification Failed: Invalid Demo EPIC. Expected ${expectedEpic} for ${demoConfig.firstName}.`);
        }
      } else if (!cleanVoterId.startsWith('DEMO-')) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Verification Failed: Demo EPIC must begin with DEMO-');
      }

      user.isKycVerified = true;
      user.kycStatus = 'verified';
      if (cleanVoterId) user.epicNumber = cleanVoterId;
      await user.save();

      // Ensure Citizen record exists for compatibility with voting engine
      let master = await CitizenMaster.findOne({ 
        $or: [{ voterId: user.epicNumber }, { mobile: user.mobileNumber }] 
      });
      if (!master) {
        master = await CitizenMaster.create({
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: new Date('1995-01-01'),
          gender: 'Male',
          voterId: user.epicNumber || `DEMO-${(user.state || 'TEL').slice(0, 3).toUpperCase()}-001`,
          aadhaarHash: user.aadhaar || '123412341234',
          mobile: user.mobileNumber,
          email: user.email,
          state: user.state || 'Telangana',
          district: user.district || 'Hyderabad',
          constituency: user.constituency || '057-Musheerabad',
          pollingStation: `01 - Community Hall, ${user.constituency || 'Central'}`,
        });
      }

      let citizen = await Citizen.findOne({ 
        $or: [{ userId: user._id }, { citizenMasterId: master._id }] 
      });
      if (!citizen) {
        citizen = await Citizen.create({
          userId: user._id,
          citizenMasterId: master._id,
          verificationStatus: true,
          verifiedAt: new Date(),
        });
      } else {
        citizen.userId = user._id;
        citizen.citizenMasterId = master._id;
        citizen.verificationStatus = true;
        citizen.verifiedAt = new Date();
        await citizen.save();
      }

      return {
        _id: citizen._id,
        userId: user._id,
        isVerified: true,
        verificationStatus: true,
        kycStatus: 'KYC_VERIFIED',
        isKycVerified: true,
        eligibilityStatus: 'ELIGIBLE',
        voterId: user.epicNumber,
        epicNumber: user.epicNumber,
        state: user.state || 'Telangana',
        district: user.district || 'Hyderabad',
        mandal: user.mandal || 'Musheerabad',
        constituency: user.constituency || '057-Musheerabad',
        status: 'verified',
        isDemo: true,
        message: 'Demo verification completed successfully. Simulated verification — Final Year Project Demonstration'
      };
    }

    // 2. REAL CITIZEN MASTER RECORD VERIFICATION
    const cleanDigitsAadhaar = rawAadhaar.replace(/\D/g, '');
    if (!/^\d{12}$/.test(cleanDigitsAadhaar)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Aadhaar number must be exactly 12 numeric digits');
    }

    const masterRecord = await citizenRepository.findCitizenMasterByVoterId(cleanVoterId);
    if (!masterRecord) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Verification Failed: Voter ID not found in Master Database');
    }

    // Compare hashed Aadhaar
    const isAadhaarMatch = await bcrypt.compare(cleanDigitsAadhaar, masterRecord.aadhaarHash);
    if (!isAadhaarMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Verification Failed: Aadhaar number does not match electoral roll records');
    }

    user.isKycVerified = true;
    user.kycStatus = 'verified';
    user.epicNumber = cleanVoterId;
    user.state = masterRecord.state;
    user.district = masterRecord.district;
    user.constituency = masterRecord.constituency;
    await user.save();

    let verifiedCitizen = await citizenRepository.findCitizenByUserId(userId);
    if (!verifiedCitizen) {
      verifiedCitizen = await citizenRepository.verifyCitizen(userId, masterRecord._id);
    } else {
      verifiedCitizen.verificationStatus = true;
      verifiedCitizen.verifiedAt = new Date();
      await verifiedCitizen.save();
    }

    return {
      ...verifiedCitizen.toObject(),
      isVerified: true,
      status: 'verified',
      kycStatus: 'KYC_VERIFIED',
      isKycVerified: true,
      eligibilityStatus: 'ELIGIBLE',
      voterId: cleanVoterId,
      epicNumber: cleanVoterId,
      state: user.state,
      district: user.district,
      constituency: user.constituency,
      message: 'Identity verified successfully with State Electoral Roll records.'
    };
  }

  /**
   * Get Citizen profile
   * @param {string} userId 
   */
  async getCitizenProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Citizen profile not found');
    }

    const demoConfig = getDemoCitizen(user.mobileNumber);
    const defaultEpic = user.epicNumber || demoConfig?.epicNumber || (user.isDemoAccount ? `DEMO-${(user.state || 'TEL').slice(0, 3).toUpperCase()}-001` : undefined);

    return {
      _id: user._id,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`.trim(),
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      mobileNumber: user.mobileNumber,
      mobile: user.mobileNumber,
      phone: user.mobileNumber,
      aadhaar: user.aadhaar ? (user.isDemoAccount ? `DEMO-AADHAAR-${(defaultEpic || '001').slice(-3)}` : `●●●● ●●●● ${user.aadhaar.slice(-4)}`) : undefined,
      epicNumber: defaultEpic,
      voterId: defaultEpic,
      state: user.state || demoConfig?.state || 'Telangana',
      district: user.district || demoConfig?.district || 'Central District',
      mandal: user.mandal || demoConfig?.mandal || 'Headquarters',
      village: user.village || demoConfig?.village || 'Locality Center',
      constituency: user.constituency || demoConfig?.constituency || '057-Musheerabad',
      address: user.address || demoConfig?.address || '',
      whatsappNumber: user.whatsappNumber || '',
      isMobileVerified: Boolean(user.isMobileVerified),
      isKycVerified: Boolean(user.isKycVerified),
      isVerified: Boolean(user.isKycVerified),
      kycStatus: user.isKycVerified ? 'KYC_VERIFIED' : 'KYC_PENDING',
      status: user.isKycVerified ? 'verified' : 'pending',
      isDemoAccount: Boolean(user.isDemoAccount),
      role: user.role,
      eligibilityStatus: user.isKycVerified ? 'ELIGIBLE' : 'KYC_PENDING'
    };
  }

  /**
   * Update Citizen profile (Only safe fields allowed)
   * @param {string} userId 
   * @param {Object} updateData 
   */
  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Citizen profile not found');
    }

    // Explicitly allow only editable safe fields
    if (updateData.firstName && typeof updateData.firstName === 'string' && updateData.firstName.trim().length >= 2) {
      user.firstName = updateData.firstName.trim();
    }

    if (updateData.lastName && typeof updateData.lastName === 'string' && updateData.lastName.trim().length >= 2) {
      user.lastName = updateData.lastName.trim();
    }

    if (updateData.whatsappNumber !== undefined) {
      const clean = String(updateData.whatsappNumber).trim().replace(/\D/g, '');
      user.whatsappNumber = clean.length === 10 ? clean : undefined;
    }

    if (updateData.address !== undefined && typeof updateData.address === 'string') {
      user.address = updateData.address.trim();
    }

    if (updateData.village !== undefined && typeof updateData.village === 'string') {
      user.village = updateData.village.trim();
    }

    await user.save();
    return this.getCitizenProfile(userId);
  }

  /**
   * Get all citizens for Admin Elector Management
   */
  async getAllCitizens(query = {}) {
    const filter = { role: 'voter' };

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { epicNumber: regex },
        { mobileNumber: regex },
        { email: regex },
        { constituency: regex }
      ];
    }

    if (query.state && query.state !== 'All') {
      filter.state = query.state;
    }

    if (query.district && query.district !== 'All') {
      filter.district = query.district;
    }

    if (query.constituency && query.constituency !== 'All') {
      filter.constituency = query.constituency;
    }

    if (query.kycStatus && query.kycStatus !== 'All') {
      if (query.kycStatus === 'VERIFIED' || query.kycStatus === 'verified') {
        filter.isKycVerified = true;
      } else if (query.kycStatus === 'PENDING' || query.kycStatus === 'pending') {
        filter.isKycVerified = false;
      }
    }

    if (query.hasVoted !== undefined && query.hasVoted !== 'All') {
      filter.hasVoted = query.hasVoted === 'true' || query.hasVoted === true;
    }

    const voters = await User.find(filter).sort({ createdAt: -1 });

    return voters.map((u, idx) => ({
      sNo: idx + 1,
      _id: u._id,
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      name: `${u.firstName} ${u.lastName}`.trim(),
      epicNumber: u.epicNumber || `DEMO-TEL-${String(idx + 1).padStart(3, '0')}`,
      voterId: u.epicNumber || 'PENDING',
      mobileNumber: u.mobileNumber,
      mobile: u.mobileNumber,
      village: u.village || u.mandal || 'N/A',
      mandal: u.mandal || 'N/A',
      district: u.district || 'Hyderabad',
      state: u.state || 'Telangana',
      constituency: u.constituency || '057-Musheerabad',
      isKycVerified: Boolean(u.isKycVerified),
      kycStatus: u.isKycVerified ? 'VERIFIED' : 'PENDING',
      eligibilityStatus: u.isKycVerified ? 'ELIGIBLE' : 'KYC_PENDING',
      hasVoted: Boolean(u.hasVoted),
      votingStatus: u.hasVoted ? 'VOTED' : 'NOT_VOTED',
      isDemoAccount: Boolean(u.isDemoAccount)
    }));
  }
}

export default new CitizenService();
