import citizenService from '../services/citizen.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class CitizenController {
  /**
   * @desc    Verify citizen credentials against master DB
   * @route   POST /api/v1/citizens/verify
   * @access  Private
   */
  async verify(req, res) {
    const { voterId, aadhaar } = req.body;
    const userId = req.user._id;

    // We pass voterId and aadhaar to service for core verification.
    // In a real scenario, you might also cross-check mobile/email if required by business logic.
    const citizen = await citizenService.verifyCitizen(userId,{
    voterId,
    aadhaar
});

    return ApiResponse.success(res, 'Citizen verification successful', { citizen });
  }

  /**
   * @desc    Get verified citizen profile
   * @route   GET /api/v1/citizens/profile
   * @access  Private
   */
  async getProfile(req, res) {
    const userId = req.user._id;
    const citizenProfile = await citizenService.getCitizenProfile(userId);

    return ApiResponse.success(res, 'Citizen profile retrieved successfully', { profile: citizenProfile });
  }

  /**
   * @desc    Update citizen profile
   * @route   PUT /api/v1/citizens/profile
   * @access  Private
   */
  async updateProfile(req, res) {
    const userId = req.user._id;
    const updateData = req.body;

    const updatedProfile = await citizenService.updateProfile(userId, updateData);

    return ApiResponse.success(res, 'Citizen profile updated successfully', { profile: updatedProfile });
  }
}

export default new CitizenController();
