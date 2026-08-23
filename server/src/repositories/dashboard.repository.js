import User from '../models/user.model.js';
import Election from '../models/election.model.js';
import Candidate from '../models/candidate.model.js';
import Vote from '../models/vote.model.js';
import { STATES_DATA } from '../constants/statesData.js';

class DashboardRepository {
  async getSummary() {
    const totalVoters = await User.countDocuments({ role: 'voter' });
    const verifiedVoters = await User.countDocuments({ role: 'voter', isKycVerified: true });
    const eligibleVoters = verifiedVoters;
    const votesCast = await Vote.countDocuments();
    const remainingVoters = Math.max(0, eligibleVoters - votesCast);
    const overallTurnout = eligibleVoters > 0 ? parseFloat(((votesCast / eligibleVoters) * 100).toFixed(1)) : 0;

    const totalElections = await Election.countDocuments();
    const activeElections = await Election.countDocuments({ status: 'ACTIVE' });
    const totalCandidates = await Candidate.countDocuments();

    // Distinct active constituencies
    const activeConstituencies = (await Election.distinct('constituency', { status: 'ACTIVE' })).length;

    // State-wise Turnout Breakdown
    const stateTurnout = [];
    for (const state of STATES_DATA) {
      const stateVoters = await User.countDocuments({ role: 'voter', state: state.name, isKycVerified: true });
      const stateVotes = await Vote.countDocuments({ constituency: { $in: state.constituencies.map(c => c.name) } });
      const turnoutPct = stateVoters > 0 ? parseFloat(((stateVotes / stateVoters) * 100).toFixed(1)) : 0;
      stateTurnout.push({
        stateName: state.name,
        capital: state.capital,
        eligibleVoters: stateVoters,
        votesCast: stateVotes,
        turnoutPercentage: turnoutPct,
        activeConstituencies: state.constituencies.length
      });
    }

    // Constituency-wise Turnout Breakdown (Top 10)
    const constituencyTurnout = [];
    const activeElectionsList = await Election.find({ status: 'ACTIVE' }).limit(10);
    for (const el of activeElectionsList) {
      const constVoters = await User.countDocuments({ role: 'voter', constituency: el.constituency, isKycVerified: true });
      const constVotes = await Vote.countDocuments({ electionId: el._id });
      const turnoutPct = constVoters > 0 ? parseFloat(((constVotes / constVoters) * 100).toFixed(1)) : 0;
      constituencyTurnout.push({
        constituency: el.constituency,
        state: el.state,
        electionTitle: el.title,
        eligibleVoters: constVoters,
        votesCast: constVotes,
        turnoutPercentage: turnoutPct
      });
    }

    return {
      totalUsers: totalVoters,
      totalRegisteredVoters: totalVoters,
      verifiedCitizens: verifiedVoters,
      verifiedVoters,
      eligibleVoters,
      votesCast,
      totalVotes: votesCast,
      remainingVoters,
      overallTurnout,
      totalElections,
      activeElections,
      activeConstituencies,
      totalCandidates,
      stateTurnout,
      constituencyTurnout
    };
  }

  async getCharts() {
    const candidateVoteDistribution = await Vote.aggregate([
      { $group: { _id: '$candidateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'candidates', localField: '_id', foreignField: '_id', as: 'candidate' } },
      { $unwind: '$candidate' },
      { $project: { _id: 0, candidateName: '$candidate.fullName', partyName: '$candidate.partyName', votes: '$count' } }
    ]);

    const electionStatusDistribution = await Election.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]);

    const constituencyVoteDistribution = await Vote.aggregate([
      { $group: { _id: '$constituency', votes: { $sum: 1 } } },
      { $project: { _id: 0, constituency: '$_id', votes: 1 } },
      { $sort: { votes: -1 } }
    ]);

    return {
      candidateVoteDistribution,
      electionStatusDistribution,
      constituencyVoteDistribution
    };
  }

  async getRecent() {
    const recentElections = await Election.find().sort({ createdAt: -1 }).limit(5);
    const recentVotes = await Vote.find().populate('electionId', 'title constituency').sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find({ role: 'voter' }).select('firstName lastName epicNumber constituency isKycVerified createdAt').sort({ createdAt: -1 }).limit(5);

    return {
      recentElections,
      recentVotes: recentVotes.map(v => ({
        _id: v._id,
        electionTitle: v.electionId?.title || 'State Assembly Election',
        constituency: v.constituency,
        votedAt: v.createdAt,
        referenceNumber: `TEL-DEMO-VOTE-${v._id.toString().slice(-6).toUpperCase()}`
      })),
      recentUsers
    };
  }

  async getActivityFeed() {
    const recentVotes = await Vote.find().populate('electionId', 'title constituency').sort({ createdAt: -1 }).limit(8);
    return recentVotes.map(v => ({
      action: 'VOTE_RECORDED',
      description: `Encrypted ballot recorded in constituency: ${v.constituency}`,
      timestamp: v.createdAt,
      reference: `TEL-DEMO-VOTE-${v._id.toString().slice(-6).toUpperCase()}`
    }));
  }
}

export default new DashboardRepository();
