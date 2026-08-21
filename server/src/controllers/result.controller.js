import resultService from '../services/result.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class ResultController {
  async getElectionResults(req, res) {
    const { electionId } = req.params;
    const results = await resultService.getElectionResults(electionId);
    return ApiResponse.success(res, 'Election results retrieved successfully', results);
  }

  async getDashboardAnalytics(req, res) {
    const analytics = await resultService.getDashboardAnalytics();
    return ApiResponse.success(res, 'Dashboard analytics retrieved successfully', analytics);
  }

  async getCandidateResults(req, res) {
    const { candidateId } = req.params;
    const results = await resultService.getCandidateResults(candidateId);
    return ApiResponse.success(res, 'Candidate results retrieved successfully', results);
  }

  async getConstituencyResults(req, res) {
    const { constituency } = req.params;
    const results = await resultService.getConstituencyResults(constituency);
    return ApiResponse.success(res, 'Constituency results retrieved successfully', results);
  }
}

export default new ResultController();
