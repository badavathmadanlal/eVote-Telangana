import electionRepository from '../repositories/election.repository.js';
import voteRepository from '../repositories/vote.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class ElectionService {
  async createElection(electionData, adminId) {
    if (new Date(electionData.startDate) >= new Date(electionData.endDate)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'startDate must be before endDate');
    }

    const data = { ...electionData, status: 'INACTIVE', createdBy: adminId };
    return electionRepository.createElection(data);
  }

  async getAllElections(filters) {
    return electionRepository.getAllElections(filters);
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

    // If votes exist, only status can be changed (handled via separate endpoint)
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
    // Elections with votes cannot be deleted
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

  async getActiveElection(constituency) {
    const election = await electionRepository.getActiveElection(constituency);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'No active election found for the specified criteria');
    }
    return election;
  }
}

export default new ElectionService();
