import AuditLog from '../models/auditLog.model.js';

class AuditLogRepository {
  async create(data) {
    const auditLog = new AuditLog(data);
    return await auditLog.save();
  }

  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 50, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate('adminId', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    return {
      logs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id) {
    return await AuditLog.findById(id).populate('adminId', 'firstName lastName email').lean();
  }
}

export default new AuditLogRepository();
