import resultRepository from '../repositories/result.repository.js';
import electionRepository from '../repositories/election.repository.js';
import candidateRepository from '../repositories/candidate.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class ResultService {
  async getElectionResults(electionId) {
    const election = await electionRepository.getElectionById(electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }

    const totalVotesCast = await resultRepository.getTotalVotesByElection(electionId);
    const candidateResults = await resultRepository.getElectionResults(electionId);
    const totalCandidates = await candidateRepository.getCandidatesByElection(electionId);

    // If there are zero votes, gracefully return empty structure
    if (totalVotesCast === 0) {
      return {
        electionDetails: {
          electionId: election._id,
          electionName: election.title,
          electionStatus: election.status,
          constituency: election.constituency,
          totalCandidates: totalCandidates.length,
          totalVotesCast: 0,
        },
        winner: null,
        runnerUp: null,
        candidateResults: totalCandidates.map(c => ({
          candidateId: c._id,
          candidateName: c.fullName,
          partyName: c.partyName,
          partySymbol: c.partySymbol,
          votes: 0,
          percentage: 0,
        })),
      };
    }

    // Process candidate results (calculate percentages)
    // Note: candidateResults from aggregation only includes candidates who received votes.
    // We should merge with totalCandidates to include those with 0 votes.
    const resultsMap = new Map();
    candidateResults.forEach(r => resultsMap.set(r.candidateId.toString(), r));

    const finalResults = totalCandidates.map(c => {
      const aggResult = resultsMap.get(c._id.toString());
      const votes = aggResult ? aggResult.votes : 0;
      const percentage = totalVotesCast > 0 ? ((votes / totalVotesCast) * 100).toFixed(2) : 0;
      return {
        candidateId: c._id,
        candidateName: c.fullName,
        partyName: c.partyName,
        partySymbol: c.partySymbol,
        votes,
        percentage: parseFloat(percentage),
      };
    });

    // Sort by highest votes descending
    finalResults.sort((a, b) => b.votes - a.votes);

    let winner = null;
    let runnerUp = null;

    if (finalResults.length > 0) winner = finalResults[0];
    if (finalResults.length > 1) runnerUp = finalResults[1];

    return {
      electionDetails: {
        electionId: election._id,
        electionName: election.title,
        electionStatus: election.status,
        constituency: election.constituency,
        totalCandidates: totalCandidates.length,
        totalVotesCast,
      },
      winner,
      runnerUp,
      candidateResults: finalResults,
    };
  }

  async getDashboardAnalytics() {
    const analytics = await resultRepository.getDashboardAnalytics();
    
    // Calculate overall turnout loosely: totalVotes / verifiedCitizens
    const turnout = analytics.verifiedCitizens > 0 
      ? ((analytics.totalVotes / analytics.verifiedCitizens) * 100).toFixed(2)
      : 0;

    return {
      ...analytics,
      overallTurnout: parseFloat(turnout),
    };
  }

  async getCandidateResults(candidateId) {
    const candidate = await candidateRepository.getCandidateById(candidateId);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Candidate not found');
    }

    const electionId = candidate.electionId._id || candidate.electionId;
    const electionResults = await this.getElectionResults(electionId);
    
    const candidateStats = electionResults.candidateResults.find(
      c => c.candidateId.toString() === candidateId.toString()
    );

    const positionIndex = electionResults.candidateResults.findIndex(
      c => c.candidateId.toString() === candidateId.toString()
    );

    return {
      candidateDetails: {
        candidateId: candidate._id,
        candidateName: candidate.fullName,
        partyName: candidate.partyName,
      },
      electionDetails: {
        electionId: electionResults.electionDetails.electionId,
        electionName: electionResults.electionDetails.electionName,
        constituency: electionResults.electionDetails.constituency,
      },
      votes: candidateStats ? candidateStats.votes : 0,
      percentage: candidateStats ? candidateStats.percentage : 0,
      position: positionIndex !== -1 ? positionIndex + 1 : null,
    };
  }

  async getConstituencyResults(constituency) {
    const elections = await resultRepository.getConstituencyElections(constituency);
    if (!elections || elections.length === 0) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No elections found for this constituency');
    }

    // Get results for the most recent election in this constituency
    const latestElection = elections[0];
    const results = await this.getElectionResults(latestElection._id);

    return {
      constituency,
      election: latestElection,
      winner: results.winner,
      runnerUp: results.runnerUp,
      totalVotesCast: results.electionDetails.totalVotesCast,
      candidates: results.candidateResults,
    };
  }
}

export default new ResultService();
