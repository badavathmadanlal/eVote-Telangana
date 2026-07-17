import Election from '../models/election.model.js';

class ElectionRepository {
  async createElection(electionData) {
    return Election.create(electionData);
  }

  async getAllElections(query = {}) {
    return Election.find(query).sort({ startDate: 1 });
  }

  async getElectionById(id) {
    return Election.findById(id);
  }

  async updateElection(id, updateData) {
    return Election.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteElection(id) {
    return Election.findByIdAndDelete(id);
  }

  async getActiveElection(constituency) {
    const query = { status: 'ACTIVE' };
    if (constituency) {
      query.constituency = constituency;
    }
    return Election.findOne(query);
  }
}

export default new ElectionRepository();
