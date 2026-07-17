import CitizenMaster from '../models/citizenMaster.model.js';
import Citizen from '../models/citizen.model.js';

class CitizenRepository {
  /**
   * Create a new verified Citizen record
   * @param {Object} citizenData 
   * @returns {Promise<Object>}
   */
  async createCitizen(citizenData) {
    return Citizen.create(citizenData);
  }

  /**
   * Find a CitizenMaster record by voter ID
   * @param {string} voterId 
   * @returns {Promise<Object>}
   */
  async findCitizenMasterByVoterId(voterId) {
    return CitizenMaster.findOne({ voterId, isActive: true });
  }

  /**
   * Find a Citizen by associated User ID
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async findCitizenByUserId(userId) {
    return Citizen.findOne({ userId }).populate('citizenMasterId');
  }

  /**
   * Update an existing Citizen record
   * @param {string} citizenId 
   * @param {Object} updateData 
   * @returns {Promise<Object>}
   */
  async updateCitizen(citizenId, updateData) {
    return Citizen.findByIdAndUpdate(citizenId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Verify Citizen - Helper wrapper for creation
   * @param {string} userId
   * @param {string} citizenMasterId
   */
  async verifyCitizen(userId, citizenMasterId) {
    const newCitizen = await this.createCitizen({
      userId,
      citizenMasterId,
      verificationStatus: true,
      verifiedAt: new Date(),
    });
    return newCitizen;
  }
}

export default new CitizenRepository();
