import electionRepository from '../repositories/election.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class ElectionService {
  _calculateStatus(startDate, endDate) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'UPCOMING';
    if (now >= start && now <= end) return 'ACTIVE';
    return 'COMPLETED';
  }

  async createElection(electionData, adminId) {
    if (new Date(electionData.startDate) >= new Date(electionData.endDate)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'startDate must be before endDate');
    }

    const activeElection = await electionRepository.getActiveElection(electionData.constituency);
    if (activeElection) {
      throw new ApiError(HTTP_STATUS.CONFLICT, `There is already an ACTIVE election in constituency: ${electionData.constituency}`);
    }

    const status = this._calculateStatus(electionData.startDate, electionData.endDate);
    const data = { ...electionData, status, createdBy: adminId };

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

    const newStart = updateData.startDate || existing.startDate;
    const newEnd = updateData.endDate || existing.endDate;

    if (new Date(newStart) >= new Date(newEnd)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'startDate must be before endDate');
    }

    // Auto-calculate new status
    const status = this._calculateStatus(newStart, newEnd);
    updateData.status = status;

    return electionRepository.updateElection(id, updateData);
  }

  async deleteElection(id) {
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
