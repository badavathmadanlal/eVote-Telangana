import candidateRepository from '../repositories/candidate.repository.js';
import electionRepository from '../repositories/election.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class CandidateService {
  async createCandidate(candidateData, adminId) {
    // 1. Election must exist
    const election = await electionRepository.getElectionById(candidateData.electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }

    // 2. Election must not be ACTIVE
    if (election.status === 'ACTIVE') {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot add candidate to an active election');
    }

    // 3. Candidate constituency must match Election constituency
    if (candidateData.constituency !== election.constituency) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Candidate constituency (${candidateData.constituency}) does not match Election constituency (${election.constituency})`
      );
    }

    // 4. Prevent duplicate candidate names inside the same Election
    const existingCandidate = await candidateRepository.findByFullNameAndElection(
      candidateData.fullName,
      candidateData.electionId
    );
    if (existingCandidate) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        'A candidate with this name already exists in this election'
      );
    }

    const data = { ...candidateData, createdBy: adminId };
    return candidateRepository.createCandidate(data);
  }

  async getAllCandidates(filters) {
    return candidateRepository.getAllCandidates(filters);
  }

  async getCandidateById(id) {
    const candidate = await candidateRepository.getCandidateById(id);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Candidate not found');
    }
    return candidate;
  }

  async getCandidatesByElection(electionId) {
    const election = await electionRepository.getElectionById(electionId);
    if (!election) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Election not found');
    }
    return candidateRepository.getCandidatesByElection(electionId);
  }

  async updateCandidate(id, updateData) {
    const candidate = await candidateRepository.getCandidateById(id);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Candidate not found');
    }

    // If changing election or constituency, apply business rules
    if (updateData.electionId || updateData.constituency) {
      const targetElectionId = updateData.electionId || candidate.electionId;
      const targetConstituency = updateData.constituency || candidate.constituency;

      const election = await electionRepository.getElectionById(targetElectionId);
      if (!election) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Target election not found');
      }

      if (election.status === 'ACTIVE') {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot move candidate to an active election');
      }

      if (targetConstituency !== election.constituency) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          `Candidate constituency (${targetConstituency}) does not match Election constituency (${election.constituency})`
        );
      }
    }

    // Prevent name collision if changing fullName
    if (updateData.fullName && updateData.fullName !== candidate.fullName) {
      const targetElectionId = updateData.electionId || candidate.electionId;
      const existing = await candidateRepository.findByFullNameAndElection(
        updateData.fullName,
        targetElectionId
      );
      if (existing) {
        throw new ApiError(HTTP_STATUS.CONFLICT, 'A candidate with this name already exists in the target election');
      }
    }

    return candidateRepository.updateCandidate(id, updateData);
  }

  async deleteCandidate(id) {
    const candidate = await candidateRepository.getCandidateById(id);
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Candidate not found');
    }
    
    // Prevent delete if election is ACTIVE
    const election = await electionRepository.getElectionById(candidate.electionId);
    if (election && election.status === 'ACTIVE') {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete candidate from an active election');
    }

    await candidateRepository.deleteCandidate(id);
    return candidate;
  }
}

export default new CandidateService();
