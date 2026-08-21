import auditLogService from '../services/auditLog.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class AuditLogController {
  // @desc    Get all audit logs
  // @route   GET /api/v1/audit-logs
  // @access  Private/Admin
  async getLogs(req, res) {
    const { page, limit, action, entityType, search, adminId } = req.query;

    const result = await auditLogService.getLogs({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 50,
      action,
      entityType,
      search,
      adminId
    });

    return ApiResponse.success(res, 'Audit logs retrieved successfully', result);
  }
}

export default new AuditLogController();
