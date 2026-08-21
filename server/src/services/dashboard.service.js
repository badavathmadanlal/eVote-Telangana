import dashboardRepository from '../repositories/dashboard.repository.js';

class DashboardService {
  async getSummary() {
    const summary = await dashboardRepository.getSummary();
    
    // Calculate overall turnout loosely
    const turnout = summary.verifiedCitizens > 0 
      ? ((summary.totalVotes / summary.verifiedCitizens) * 100).toFixed(2)
      : 0;

    return {
      ...summary,
      overallTurnout: parseFloat(turnout)
    };
  }

  async getCharts() {
    return dashboardRepository.getCharts();
  }

  async getRecent() {
    return dashboardRepository.getRecent();
  }

  async getActivityFeed() {
    return dashboardRepository.getActivityFeed();
  }
}

export default new DashboardService();
