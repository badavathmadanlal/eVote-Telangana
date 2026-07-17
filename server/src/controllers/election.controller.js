import electionService from '../services/election.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class ElectionController {
  async createElection(req, res) {
    const adminId = req.user._id;
    const election = await electionService.createElection(req.body, adminId);
    return ApiResponse.created(res, 'Election created successfully', { election });
  }

  async getAllElections(req, res) {
    const elections = await electionService.getAllElections(req.query);
    return ApiResponse.success(res, 'Elections retrieved successfully', { elections });
  }

  async getElectionById(req, res) {
    const election = await electionService.getElectionById(req.params.id);
    return ApiResponse.success(res, 'Election retrieved successfully', { election });
  }

  async getActiveElection(req, res) {
    const { constituency } = req.query;
    const election = await electionService.getActiveElection(constituency);
    return ApiResponse.success(res, 'Active election retrieved successfully', { election });
  }

  async updateElection(req, res) {
    const election = await electionService.updateElection(req.params.id, req.body);
    return ApiResponse.success(res, 'Election updated successfully', { election });
  }

  async deleteElection(req, res) {
    const election = await electionService.deleteElection(req.params.id);
    return ApiResponse.success(res, 'Election deleted successfully', { election });
  }
}

export default new ElectionController();
