import dashboardService from '../services/dashboard.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class DashboardController {
  async getSummary(req, res) {
    const summary = await dashboardService.getSummary();
    return ApiResponse.success(res, 'Dashboard summary retrieved successfully', summary);
  }

  async getCharts(req, res) {
    const charts = await dashboardService.getCharts();
    return ApiResponse.success(res, 'Dashboard charts retrieved successfully', charts);
  }

  async getRecent(req, res) {
    const recent = await dashboardService.getRecent();
    return ApiResponse.success(res, 'Recent activity retrieved successfully', recent);
  }

  async getActivityFeed(req, res) {
    const feed = await dashboardService.getActivityFeed();
    return ApiResponse.success(res, 'Activity feed retrieved successfully', { feed });
  }
}

export default new DashboardController();
