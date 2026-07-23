import voteRepository from '../repositories/vote.repository.js';
import citizenRepository from '../repositories/citizen.repository.js';
import electionRepository from '../repositories/election.repository.js';
import candidateRepository from '../repositories/candidate.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class VoteService {
  async castVote(userId, { candidateId, electionId }) {
    // 1. & 2. Citizen must be verified
    const citizen = await citizenRepository.findCitizenByUserId(userId);
    if (!citizen || !citizen.verificationStatus) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Only verified citizens can cast a vote');
    }

    // 3. Citizen.hasVoted must be false (for this specific election, checking vote record is safer)
    // Actually, in a real system, a citizen might vote in multiple elections (e.g. State & National).
    // The instructions say "Update Citizen.hasVoted=true", so we will do that, but checking specific election vote is more robust.
    const existingVote = await voteRepository.findVoteByCitizen(citizen._id, electionId);
    if (existingVote || citizen.hasVoted) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'You have already cast your vote in this election');
    }

    // 4. Election must exist
    const election = await electionRepository.getElectionById(electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }

    // 5. Election status must be ACTIVE
    if (election.status !== 'ACTIVE') {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Voting is only allowed during an ACTIVE election');
    }

    // 6. Candidate must exist
    const candidate = await candidateRepository.getCandidateById(candidateId);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Candidate not found');
    }

    // 7. Candidate must belong to the Election
    if (candidate.electionId._id.toString() !== electionId.toString() && candidate.electionId.toString() !== electionId.toString()) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Candidate does not belong to this election');
    }

    // 8. Citizen constituency must equal Election constituency
    // Citizen constituency is stored in CitizenMaster which is populated in citizen.citizenMasterId
    const citizenConstituency = citizen.citizenMasterId.constituency;
    if (citizenConstituency !== election.constituency) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, `You are not registered in the ${election.constituency} constituency`);
    }

    // 9. Create Vote
    const vote = await voteRepository.createVote({
      userId,
      citizenId: citizen._id,
      candidateId,
      electionId,
      constituency: election.constituency,
    });

    // 10. Update Citizen.hasVoted=true
    await citizenRepository.updateCitizen(citizen._id, { hasVoted: true });

    return vote;
  }

  async getMyVotes(userId) {
     return voteRepository.findVotesByUser(userId);
  }

  async getElectionResults(electionId) {
    const election = await electionRepository.getElectionById(electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }
    
    // In a real system, you would aggregate this. For now, returning raw votes based on the prompt.
    return voteRepository.findVotesByElection(electionId);
  }
}

export default new VoteService();
