import Candidate from '../models/candidate.model.js';

class CandidateRepository {
  async createCandidate(candidateData) {
    return Candidate.create(candidateData);
  }

  async getAllCandidates(query = {}) {
    return Candidate.find(query).populate('electionId', 'title electionType startDate endDate status');
  }

  async getCandidateById(id) {
    return Candidate.findById(id).populate('electionId', 'title electionType startDate endDate status');
  }

  async getCandidatesByElection(electionId) {
    return Candidate.find({ electionId }).populate('electionId', 'title electionType startDate endDate status');
  }

  async updateCandidate(id, updateData) {
    return Candidate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('electionId', 'title electionType startDate endDate status');
  }

  async deleteCandidate(id) {
    return Candidate.findByIdAndDelete(id);
  }

  async findByFullNameAndElection(fullName, electionId) {
    return Candidate.findOne({ fullName, electionId });
  }
}

export default new CandidateRepository();
