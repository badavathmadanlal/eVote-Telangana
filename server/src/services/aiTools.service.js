import User from '../models/user.model.js';
import Election from '../models/election.model.js';
import Candidate from '../models/candidate.model.js';
import Vote from '../models/vote.model.js';
import { STATES_DATA } from '../constants/statesData.js';

/**
 * AI Read-Only Tools Service
 * Prepared for Phase 27+ Agentic AI Integration.
 * Strictly Read-Only. Never mutates MongoDB.
 */
class AiToolsService {
  /**
   * Tool 1: Get Citizen Jurisdiction
   */
  async getCitizenJurisdiction(userId) {
    const user = await User.findById(userId).select('firstName lastName state district mandal village constituency epicNumber isKycVerified');
    if (!user) return { error: 'Citizen record not found' };

    return {
      name: `${user.firstName} ${user.lastName}`.trim(),
      state: user.state,
      district: user.district,
      mandal: user.mandal,
      village: user.village,
      constituency: user.constituency,
      epicNumber: user.epicNumber,
      isVerified: user.isKycVerified
    };
  }

  /**
   * Tool 2: Get Citizen Eligibility
   */
  async getCitizenEligibility(userId) {
    const user = await User.findById(userId).select('isKycVerified kycStatus constituency role');
    if (!user) return { error: 'Citizen record not found' };

    return {
      isEligible: Boolean(user.isKycVerified),
      kycStatus: user.kycStatus || (user.isKycVerified ? 'verified' : 'pending'),
      registeredConstituency: user.constituency,
      role: user.role
    };
  }

  /**
   * Tool 3: Get Election Status
   */
  async getElectionStatus(electionId) {
    const election = await Election.findById(electionId);
    if (!election) return { error: 'Election not found' };

    return {
      electionId: election._id,
      title: election.title,
      state: election.state,
      constituency: election.constituency,
      status: election.status,
      startDate: election.startDate,
      endDate: election.endDate
    };
  }

  /**
   * Tool 4: Get Constituency Candidates
   */
  async getConstituencyCandidates(constituency) {
    const election = await Election.findOne({ constituency, status: 'ACTIVE' });
    if (!election) return { message: `No active election found for ${constituency}`, candidates: [] };

    const candidates = await Candidate.find({ electionId: election._id, isActive: true })
      .select('fullName partyName partySymbol shortProfile');

    return {
      constituency,
      electionTitle: election.title,
      candidates
    };
  }

  /**
   * Tool 5: Get Election Schedule
   */
  async getElectionSchedule(stateName) {
    const query = stateName ? { state: stateName } : {};
    const elections = await Election.find(query).select('title state constituency status startDate endDate');
    return { count: elections.length, elections };
  }

  /**
   * Tool 6: Get Voting History (confidential - returns participation only)
   */
  async getVotingHistory(userId) {
    const votes = await Vote.find({ userId })
      .populate('electionId', 'title state constituency')
      .sort({ createdAt: -1 });

    return votes.map(v => ({
      electionTitle: v.electionId?.title || 'State Assembly Election',
      constituency: v.constituency,
      votedAt: v.votedAt || v.createdAt,
      receiptNumber: `TEL-DEMO-VOTE-${v._id.toString().slice(-6).toUpperCase()}`,
      status: 'Vote Recorded'
    }));
  }

  /**
   * Tool 7: Get Election Metrics
   */
  async getElectionMetrics(stateName) {
    const query = stateName ? { state: stateName } : {};
    const totalElections = await Election.countDocuments(query);
    const activeElections = await Election.countDocuments({ ...query, status: 'ACTIVE' });
    const totalVotes = await Vote.countDocuments();

    return {
      state: stateName || 'All Registered States',
      totalElections,
      activeElections,
      totalVotesCast: totalVotes
    };
  }
}

export default new AiToolsService();
