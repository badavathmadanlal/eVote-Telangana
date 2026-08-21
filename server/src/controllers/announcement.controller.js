import announcementService from '../services/announcement.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import auditLogService from '../services/auditLog.service.js';

class AnnouncementController {
  // Public
  async getLatestAnnouncements(req, res) {
    const announcements = await announcementService.getLatestAnnouncements();
    return ApiResponse.success(res, 'Latest announcements retrieved successfully', { announcements });
  }

  async getPinnedAnnouncements(req, res) {
    const announcements = await announcementService.getPinnedAnnouncements();
    return ApiResponse.success(res, 'Pinned announcements retrieved successfully', { announcements });
  }

  async getAnnouncementById(req, res) {
    const announcement = await announcementService.getAnnouncementById(req.params.id);
    if (!announcement.isPublished && req.user?.role !== 'admin') {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied');
    }
    return ApiResponse.success(res, 'Announcement retrieved successfully', { announcement });
  }

  // Admin
  async createAnnouncement(req, res) {
    const adminId = req.user._id;
    const announcement = await announcementService.createAnnouncement(req.body, adminId);
    await auditLogService.createLog({
      adminId: req.user._id,
      action: 'ANNOUNCEMENT_CREATED',
      entityType: 'Announcement',
      entityId: announcement._id,
      description: `Created announcement: ${announcement.title}`,
    });
    return ApiResponse.created(res, 'Announcement created successfully', { announcement });
  }

  async getAllAnnouncements(req, res) {
    const announcements = await announcementService.getAllAnnouncements(req.query);
    return ApiResponse.success(res, 'All announcements retrieved successfully', { announcements });
  }

  async updateAnnouncement(req, res) {
    const announcement = await announcementService.updateAnnouncement(req.params.id, req.body);
    await auditLogService.createLog({
      adminId: req.user._id,
      action: 'ANNOUNCEMENT_UPDATED',
      entityType: 'Announcement',
      entityId: announcement._id,
      description: `Updated announcement: ${announcement.title}`,
    });
    return ApiResponse.success(res, 'Announcement updated successfully', { announcement });
  }

  async deleteAnnouncement(req, res) {
    const announcement = await announcementService.deleteAnnouncement(req.params.id);
    await auditLogService.createLog({
      adminId: req.user._id,
      action: 'ANNOUNCEMENT_DELETED',
      entityType: 'Announcement',
      entityId: req.params.id,
      description: `Deleted announcement: ${announcement.title}`,
    });
    return ApiResponse.success(res, 'Announcement deleted successfully', { announcement });
  }
}

export default new AnnouncementController();
