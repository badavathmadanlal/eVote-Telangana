import voteService from '../services/vote.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class VoteController {
  async castVote(req, res) {
    const userId = req.user._id;
    const { candidateId, electionId } = req.body;
    
    const vote = await voteService.castVote(userId, { candidateId, electionId });
    return ApiResponse.created(res, 'Vote cast successfully', { vote });
  }

  async getMyVotes(req, res) {
    const userId = req.user._id;
    const votes = await voteService.getMyVotes(userId);
    return ApiResponse.success(res, 'Votes retrieved successfully', { votes });
  }

  async getElectionResults(req, res) {
    const { electionId } = req.params;
    const votes = await voteService.getElectionResults(electionId);
    return ApiResponse.success(res, 'Election results retrieved successfully', { results: votes });
  }
}

export default new VoteController();
