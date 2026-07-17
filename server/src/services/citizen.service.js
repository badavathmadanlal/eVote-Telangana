import bcrypt from 'bcryptjs';
import citizenRepository from '../repositories/citizen.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class CitizenService {
  /**
   * Verify Citizen credentials against Election Commission Database
   * @param {string} userId - User's ID
   * @param {Object} verificationData - Contains voterId and aadhaar
   * @returns {Promise<Object>} The verified Citizen record
   */
  async verifyCitizen(userId, { voterId, aadhaar }) {
    // 1. Check if user is already verified
    const existingCitizen = await citizenRepository.findCitizenByUserId(userId);
    if (existingCitizen) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'Citizen is already verified');
    }

    // 2. Search CitizenMaster by voterId
    const masterRecord = await citizenRepository.findCitizenMasterByVoterId(voterId);
    if (!masterRecord) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Verification Failed: Voter ID not found in Master Database');
    }

    // 3. Compare hashed Aadhaar
    const isAadhaarMatch = await bcrypt.compare(aadhaar, masterRecord.aadhaarHash);
    if (!isAadhaarMatch) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Verification Failed: Aadhaar number does not match our records');
    }

    // 4. Verification Successful -> Create Citizen record
    const verifiedCitizen = await citizenRepository.verifyCitizen(userId, masterRecord._id);

    return verifiedCitizen;
  }

  /**
   * Get Citizen profile
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getCitizenProfile(userId) {
    const citizen = await citizenRepository.findCitizenByUserId(userId);
    if (!citizen) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Citizen profile not found');
    }
    return citizen;
  }

  /**
   * Update Citizen profile (e.g. tracking last login or other metadata)
   * @param {string} userId 
   * @param {Object} updateData 
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    const citizen = await citizenRepository.findCitizenByUserId(userId);
    if (!citizen) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Citizen profile not found');
    }

    const updatedCitizen = await citizenRepository.updateCitizen(citizen._id, updateData);
    return updatedCitizen;
  }
}

export default new CitizenService();
