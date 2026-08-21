import mongoose from 'mongoose';
import Vote from '../models/vote.model.js';
import User from '../models/user.model.js';
import Citizen from '../models/citizen.model.js';
import Election from '../models/election.model.js';
import Candidate from '../models/candidate.model.js';

class ResultRepository {
  async getElectionResults(electionId) {
    return Vote.aggregate([
      { $match: { electionId: new mongoose.Types.ObjectId(electionId) } },
      {
        $group: {
          _id: '$candidateId',
          votes: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidateDetails',
        },
      },
      { $unwind: '$candidateDetails' },
      {
        $project: {
          _id: 0,
          candidateId: '$_id',
          candidateName: '$candidateDetails.fullName',
          partyName: '$candidateDetails.partyName',
          partySymbol: '$candidateDetails.partySymbol',
          votes: 1,
        },
      },
      { $sort: { votes: -1 } },
    ]);
  }

  async getTotalVotesByElection(electionId) {
    return Vote.countDocuments({ electionId: new mongoose.Types.ObjectId(electionId) });
  }

  async getDashboardAnalytics() {
    const totalUsers = await User.countDocuments();
    const verifiedCitizens = await Citizen.countDocuments({ verificationStatus: true });
    
    const elections = await Election.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { status: 'ACTIVE' } }, { $count: 'count' }],
          inactive: [{ $match: { status: 'INACTIVE' } }, { $count: 'count' }],
        },
      },
    ]);

    const totalElections = elections[0].total[0]?.count || 0;
    const activeElections = elections[0].active[0]?.count || 0;
    const inactiveElections = elections[0].inactive[0]?.count || 0;

    const totalCandidates = await Candidate.countDocuments();
    const totalVotes = await Vote.countDocuments();

    // Top 5 Candidates By Votes across all elections
    const top5CandidatesByVotes = await Vote.aggregate([
      {
        $group: {
          _id: '$candidateId',
          votes: { $sum: 1 },
        },
      },
      { $sort: { votes: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidateDetails',
        },
      },
      { $unwind: '$candidateDetails' },
      {
        $lookup: {
          from: 'elections',
          localField: 'candidateDetails.electionId',
          foreignField: '_id',
          as: 'electionDetails',
        },
      },
      { $unwind: '$electionDetails' },
      {
        $project: {
          _id: 0,
          candidateId: '$_id',
          candidateName: '$candidateDetails.fullName',
          partyName: '$candidateDetails.partyName',
          electionTitle: '$electionDetails.title',
          votes: 1,
        },
      },
    ]);

    // Recent 5 elections
    const recentElections = await Election.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status startDate endDate constituency');

    // Recent 5 votes
    const recentVotes = await Vote.find()
      .sort({ votedAt: -1 })
      .limit(5)
      .populate('electionId', 'title')
      .populate('candidateId', 'fullName partyName');

    return {
      totalUsers,
      verifiedCitizens,
      totalElections,
      activeElections,
      inactiveElections,
      totalCandidates,
      totalVotes,
      top5CandidatesByVotes,
      recentElections,
      recentVotes,
    };
  }

  async getCandidateVotes(candidateId) {
    return Vote.countDocuments({ candidateId: new mongoose.Types.ObjectId(candidateId) });
  }

  async getConstituencyElections(constituency) {
    return Election.find({ constituency }).sort({ createdAt: -1 });
  }
}

export default new ResultRepository();
