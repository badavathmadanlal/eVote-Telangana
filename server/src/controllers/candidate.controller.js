import candidateService from '../services/candidate.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class CandidateController {
  async createCandidate(req, res) {
    const adminId = req.user._id;
    const candidate = await candidateService.createCandidate(req.body, adminId);
    return ApiResponse.created(res, 'Candidate created successfully', { candidate });
  }

  async getAllCandidates(req, res) {
    const candidates = await candidateService.getAllCandidates(req.query);
    return ApiResponse.success(res, 'Candidates retrieved successfully', { candidates });
  }

  async getCandidateById(req, res) {
    const candidate = await candidateService.getCandidateById(req.params.id);
    return ApiResponse.success(res, 'Candidate retrieved successfully', { candidate });
  }

  async getCandidatesByElection(req, res) {
    const candidates = await candidateService.getCandidatesByElection(req.params.electionId);
    return ApiResponse.success(res, 'Candidates retrieved successfully', { candidates });
  }

  async updateCandidate(req, res) {
    const candidate = await candidateService.updateCandidate(req.params.id, req.body);
    return ApiResponse.success(res, 'Candidate updated successfully', { candidate });
  }

  async deleteCandidate(req, res) {
    const candidate = await candidateService.deleteCandidate(req.params.id);
    return ApiResponse.success(res, 'Candidate deleted successfully', { candidate });
  }
}

export default new CandidateController();
