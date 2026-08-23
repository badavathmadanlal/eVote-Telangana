import electionRepository from '../repositories/election.repository.js';
import voteRepository from '../repositories/vote.repository.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class ElectionService {
  /**
   * Helper to retrieve an active demo election for a given constituency
   */
  async ensureDemoElection(constituency = '057-Musheerabad') {
    return electionRepository.getActiveElection(constituency);
  }

  async createElection(electionData, adminId) {
    if (new Date(electionData.startDate) >= new Date(electionData.endDate)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'startDate must be before endDate');
    }

    const data = { ...electionData, status: 'INACTIVE', createdBy: adminId };
    return electionRepository.createElection(data);
  }

  async getAllElections(filters = {}, user = null) {
    const queryFilters = {};

    // 1. If explicit state filter provided (e.g. from public state portal /elections/:stateId)
    if (filters.state) {
      queryFilters.state = new RegExp(`^${filters.state.toString().trim()}$`, 'i');
    }

    // 2. If explicit constituency filter provided
    if (filters.constituency) {
      queryFilters.constituency = filters.constituency;
    }

    // 3. If explicit status filter provided
    if (filters.status) {
      queryFilters.status = filters.status.toUpperCase();
    }

    // 4. If logged-in citizen is requesting elections on their citizen dashboard without an explicit different state query
    if (user && user.role === 'voter' && !filters.state) {
      if (user.state) {
        queryFilters.state = user.state;
      }
    }

    let elections = await electionRepository.getAllElections(queryFilters);
    return elections;
  }

  async getElectionById(id) {
    const election = await electionRepository.getElectionById(id);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }
    return election;
  }

  async updateElection(id, updateData) {
    const existing = await electionRepository.getElectionById(id);
    if (!existing) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }

    // If votes exist, only status can be changed
    const votes = await voteRepository.findVotesByElection(id);
    if (votes && votes.length > 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot update election details because votes already exist');
    }

    const newStart = updateData.startDate || existing.startDate;
    const newEnd = updateData.endDate || existing.endDate;

    if (new Date(newStart) >= new Date(newEnd)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'startDate must be before endDate');
    }

    // Prevent status change via this generic endpoint
    delete updateData.status;

    return electionRepository.updateElection(id, updateData);
  }
  
  async updateElectionStatus(id, status) {
    const existing = await electionRepository.getElectionById(id);
    if (!existing) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }
    
    if (status === 'ACTIVE') {
      const activeElection = await electionRepository.getActiveElection(existing.constituency);
      if (activeElection && activeElection._id.toString() !== id) {
        throw new ApiError(HTTP_STATUS.CONFLICT, `There is already an ACTIVE election in constituency: ${existing.constituency}`);
      }
    }
    
    return electionRepository.updateElection(id, { status });
  }

  async deleteElection(id) {
    const votes = await voteRepository.findVotesByElection(id);
    if (votes && votes.length > 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete election because votes already exist');
    }
    
    const election = await electionRepository.deleteElection(id);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }
    return election;
  }

  async getActiveElection(constituency = '057-Musheerabad') {
    let election = await electionRepository.getActiveElection(constituency);
    if (!election) {
      election = await this.ensureDemoElection(constituency);
    }
    return election;
  }
}

export default new ElectionService();
