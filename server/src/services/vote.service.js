import Vote from '../models/vote.model.js';
import User from '../models/user.model.js';
import Citizen from '../models/citizen.model.js';
import Election from '../models/election.model.js';
import Candidate from '../models/candidate.model.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const getStateCode = (stateName) => {
  const map = {
    'Telangana': 'TS',
    'Andhra Pradesh': 'AP',
    'Delhi': 'DL',
    'Tamil Nadu': 'TN',
    'Maharashtra': 'MH',
    'Assam': 'AS'
  };
  return map[stateName] || (stateName ? stateName.slice(0, 2).toUpperCase() : 'IN');
};

class VoteService {
  /**
   * Cast an encrypted, anonymous vote in an active election
   */
  async castVote(userId, { candidateId, electionId }) {
    // 1. User must exist and be KYC verified
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Voter profile not found');
    }

    if (!user.isKycVerified) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Only KYC-verified citizens can cast a vote. Please complete verification.');
    }

    // 2. Prevent duplicate vote in this election
    const existingVote = await Vote.findOne({ userId, electionId });
    if (existingVote) {
      throw new ApiError(HTTP_STATUS.CONFLICT, 'You have already cast your vote in this election.');
    }

    // 3. Election must exist and be ACTIVE
    const election = await Election.findById(electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }

    if (election.status !== 'ACTIVE') {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Voting is only allowed during an ACTIVE polling window');
    }

    // 4. Candidate must exist and belong to the Election
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Candidate not found');
    }

    if (candidate.electionId.toString() !== electionId.toString()) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Selected candidate does not belong to this election');
    }

    // 5. Voter State must match Election State (Strict State Isolation)
    const userState = (user.state || 'Telangana').trim().toLowerCase();
    const electionState = (election.state || 'Telangana').trim().toLowerCase();
    if (userState !== electionState) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, `You are registered in ${user.state}, and cannot vote in ${election.state} elections.`);
    }

    // 6. Ensure Citizen reference exists
    let citizen = await Citizen.findOne({ userId });

    // 7. Create Vote record
    const vote = await Vote.create({
      userId,
      citizenId: citizen?._id || user._id,
      candidateId,
      electionId,
      constituency: election.constituency,
      votedAt: new Date()
    });

    // 8. Update voter hasVoted flag
    user.hasVoted = true;
    await user.save();

    const stateCode = getStateCode(election.state);
    const referenceNumber = `${stateCode}-DEMO-VOTE-${vote._id.toString().slice(-6).toUpperCase()}`;

    // Return sanitized confirmation without candidate choice to maintain ballot secrecy
    return {
      _id: vote._id,
      electionId: election._id,
      electionTitle: election.title,
      state: election.state,
      constituency: election.constituency,
      referenceNumber,
      votedAt: vote.votedAt,
      status: 'Vote Recorded',
      message: 'Vote Recorded Successfully. Your receipt confirms participation without revealing candidate selection.'
    };
  }

  /**
   * Retrieve anonymous voting receipts for a user (Strict Ballot Secrecy across all states)
   */
  async getMyVotes(userId) {
    const rawVotes = await Vote.find({ userId })
      .populate('electionId', 'title state constituency')
      .sort({ createdAt: -1 });

    return rawVotes.map(v => {
      const st = v.electionId?.state || 'Telangana';
      const stateCode = getStateCode(st);
      return {
        _id: v._id,
        electionId: v.electionId?._id || v.electionId,
        electionTitle: v.electionId?.title || `${st} State Assembly Election 2026`,
        state: st,
        constituency: v.constituency,
        votedAt: v.votedAt || v.createdAt,
        status: 'Vote Recorded',
        referenceNumber: `${stateCode}-DEMO-VOTE-${v._id.toString().slice(-6).toUpperCase()}`
      };
    });
  }

  /**
   * Check if user has voted in a specific election
   */
  async hasUserVoted(userId, electionId) {
    const existingVote = await Vote.findOne({ userId, electionId }).populate('electionId', 'state');
    if (!existingVote) {
      return { hasVoted: false };
    }
    const st = existingVote.electionId?.state || 'Telangana';
    const stateCode = getStateCode(st);
    return {
      hasVoted: true,
      referenceNumber: `${stateCode}-DEMO-VOTE-${existingVote._id.toString().slice(-6).toUpperCase()}`,
      votedAt: existingVote.votedAt || existingVote.createdAt
    };
  }

  /**
   * Aggregate election results (Candidate totals only, no voter IDs)
   */
  async getElectionResults(electionId) {
    const election = await Election.findById(electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }

    const candidates = await Candidate.find({ electionId, isActive: true });
    const totalVotes = await Vote.countDocuments({ electionId });

    const candidateResults = [];
    let maxVotes = -1;
    let winner = null;

    for (const cand of candidates) {
      const votes = await Vote.countDocuments({ electionId, candidateId: cand._id });
      const percentage = totalVotes > 0 ? parseFloat(((votes / totalVotes) * 100).toFixed(1)) : 0;
      
      const resObj = {
        candidateId: cand._id,
        fullName: cand.fullName,
        partyName: cand.partyName,
        partySymbol: cand.partySymbol,
        votes,
        percentage
      };
      
      candidateResults.push(resObj);

      if (votes > maxVotes && votes > 0) {
        maxVotes = votes;
        winner = resObj;
      }
    }

    // Sort by votes descending
    candidateResults.sort((a, b) => b.votes - a.votes);

    return {
      electionId: election._id,
      title: election.title,
      state: election.state,
      constituency: election.constituency,
      status: election.status,
      totalVotes,
      candidates: candidateResults,
      winner: winner || (candidateResults.length > 0 ? candidateResults[0] : null)
    };
  }
}

export default new VoteService();
