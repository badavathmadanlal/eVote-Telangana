import User from '../models/user.model.js';
import Citizen from '../models/citizen.model.js';
import Election from '../models/election.model.js';
import Candidate from '../models/candidate.model.js';
import Vote from '../models/vote.model.js';

class DashboardRepository {
  async getSummary() {
    const totalUsers = await User.countDocuments();
    const verifiedCitizens = await Citizen.countDocuments({ verificationStatus: true });
    // In this system, all Users who are not verified citizens might be pending verification
    // Since we don't have a direct 'pending' flag, we can infer it as totalUsers - admin (1 or more) - verifiedCitizens
    // For a cleaner approach based on Citizen collection:
    // Actually, any User who hasn't verified is pending. But User collection might just be registered users.
    const pendingVerification = totalUsers - verifiedCitizens; // rough estimate

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

    return {
      totalUsers,
      verifiedCitizens,
      pendingVerification: pendingVerification > 0 ? pendingVerification : 0,
      totalElections,
      activeElections,
      inactiveElections,
      totalCandidates,
      totalVotes,
    };
  }

  async getCharts() {
    // 1. Candidate Vote Distribution (Top 10)
    const candidateVoteDistribution = await Vote.aggregate([
      { $group: { _id: '$candidateId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'candidates', localField: '_id', foreignField: '_id', as: 'candidate' } },
      { $unwind: '$candidate' },
      { $project: { _id: 0, candidateName: '$candidate.fullName', partyName: '$candidate.partyName', votes: '$count' } }
    ]);

    // 2. Election Status Distribution
    const electionStatusDistribution = await Election.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } }
    ]);

    // 3. Constituency Vote Distribution
    const constituencyVoteDistribution = await Vote.aggregate([
      { $group: { _id: '$constituency', votes: { $sum: 1 } } },
      { $project: { _id: 0, constituency: '$_id', votes: 1 } },
      { $sort: { votes: -1 } }
    ]);

    // 4. User Registration Growth (Mocked loosely by looking at timestamps if available)
    // Grouping by Date (YYYY-MM-DD)
    const userRegistrationGrowth = await User.aggregate([
      { 
        $group: { 
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }, // last 30 days
      { $project: { _id: 0, date: '$_id', users: '$count' } }
    ]);

    // 5. Verification Status
    const totalUsers = await User.countDocuments();
    const verifiedCitizens = await Citizen.countDocuments({ verificationStatus: true });
    const verificationStatus = [
      { status: 'Verified', count: verifiedCitizens },
      { status: 'Unverified', count: totalUsers - verifiedCitizens > 0 ? totalUsers - verifiedCitizens : 0 }
    ];

    // 6. Votes Per Election
    const votesPerElection = await Vote.aggregate([
      { $group: { _id: '$electionId', votes: { $sum: 1 } } },
      { $lookup: { from: 'elections', localField: '_id', foreignField: '_id', as: 'election' } },
      { $unwind: '$election' },
      { $project: { _id: 0, electionTitle: '$election.title', votes: 1 } },
      { $sort: { votes: -1 } }
    ]);

    return {
      candidateVoteDistribution,
      electionStatusDistribution,
      constituencyVoteDistribution,
      userRegistrationGrowth,
      verificationStatus,
      votesPerElection
    };
  }

  async getRecent() {
    const limit = 5;
    
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(limit).select('name email role createdAt');
    const recentElections = await Election.find().sort({ createdAt: -1 }).limit(limit).select('title status constituency createdAt');
    const recentCandidates = await Candidate.find().sort({ createdAt: -1 }).limit(limit).select('fullName partyName electionId createdAt').populate('electionId', 'title');
    const recentVotes = await Vote.find().sort({ votedAt: -1 }).limit(limit).select('constituency votedAt').populate('candidateId', 'fullName partyName').populate('electionId', 'title');

    return {
      recentUsers,
      recentElections,
      recentCandidates,
      recentVotes
    };
  }

  async getActivityFeed() {
    // Generate an activity feed by fetching recent items from multiple collections
    // and mapping them into a uniform structure, then sorting them manually.
    
    const limit = 5;
    
    const recentElections = await Election.find().sort({ updatedAt: -1 }).limit(limit);
    const recentCandidates = await Candidate.find().sort({ updatedAt: -1 }).limit(limit);
    const recentVotes = await Vote.find().sort({ votedAt: -1 }).limit(limit);
    const recentCitizens = await Citizen.find().sort({ verifiedAt: -1 }).limit(limit); // assuming createdAt or verifiedAt

    let activities = [];

    recentElections.forEach(e => {
      activities.push({
        type: e.createdAt.getTime() === e.updatedAt.getTime() ? 'Election Created' : `Election Updated to ${e.status}`,
        description: `Election '${e.title}' in ${e.constituency}`,
        timestamp: e.updatedAt,
      });
    });

    recentCandidates.forEach(c => {
      activities.push({
        type: c.createdAt.getTime() === c.updatedAt.getTime() ? 'Candidate Added' : 'Candidate Updated',
        description: `Candidate '${c.fullName}' for party ${c.partyName}`,
        timestamp: c.updatedAt,
      });
    });

    recentVotes.forEach(v => {
      activities.push({
        type: 'Vote Cast',
        description: `A vote was cast in ${v.constituency}`,
        timestamp: v.votedAt || v.createdAt,
      });
    });

    recentCitizens.forEach(c => {
      activities.push({
        type: 'Citizen Verified',
        description: `A citizen verified their identity`,
        timestamp: c.updatedAt || c.createdAt,
      });
    });

    // Sort combined feed by timestamp descending
    activities.sort((a, b) => b.timestamp - a.timestamp);
    
    return activities.slice(0, 15); // Return top 15 recent activities
  }
}

export default new DashboardRepository();
