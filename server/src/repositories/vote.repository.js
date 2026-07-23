import Vote from '../models/vote.model.js';

class VoteRepository {
  async createVote(voteData) {
    return Vote.create(voteData);
  }

  async findVoteByCitizen(citizenId, electionId) {
    return Vote.findOne({ citizenId, electionId })
      .populate('candidateId', 'fullName partyName')
      .populate('electionId', 'title electionType status');
  }

  async findVotesByElection(electionId) {
    return Vote.find({ electionId })
      .populate('candidateId', 'fullName partyName')
      .populate('citizenId', 'verificationStatus');
  }

  async findVotesByUser(userId) {
     return Vote.find({ userId })
       .populate('candidateId', 'fullName partyName')
       .populate('electionId', 'title electionType status');
  }
}

export default new VoteRepository();
