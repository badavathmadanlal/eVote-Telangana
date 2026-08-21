import auditLogRepository from '../repositories/auditLog.repository.js';
import logger from '../utils/logger.js';

class AuditLogService {
  async createLog({ adminId, action, entityType, entityId, description, status = 'SUCCESS' }) {
    try {
      if (!adminId || !action || !entityType || !description) {
        logger.warn('Audit log creation skipped: Missing required fields');
        return null;
      }

      return await auditLogRepository.create({
        adminId,
        action,
        entityType,
        entityId,
        description,
        status,
      });
    } catch (error) {
      // We don't want an audit log failure to break the main transaction
      logger.error('Failed to create audit log', { error: error.message });
      return null;
    }
  }

  async getLogs(params) {
    const { page, limit, action, entityType, adminId, search } = params;
    
    const query = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (adminId) query.adminId = adminId;
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    return await auditLogRepository.findAll(query, { page, limit });
  }
}

export default new AuditLogService();
