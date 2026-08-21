import announcementRepository from '../repositories/announcement.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class AnnouncementService {
  async createAnnouncement(data, adminId) {
    return announcementRepository.createAnnouncement({ ...data, createdBy: adminId });
  }

  async getAllAnnouncements(filters) {
    return announcementRepository.getAllAnnouncements(filters);
  }

  async getLatestAnnouncements() {
    return announcementRepository.getLatestAnnouncements();
  }

  async getPinnedAnnouncements() {
    return announcementRepository.getPinnedAnnouncements();
  }

  async getAnnouncementById(id) {
    const announcement = await announcementRepository.getAnnouncementById(id);
    if (!announcement) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Announcement not found');
    }
    // Only return published announcements to public if accessed directly, unless requested by admin.
    // The controller will handle the route distinction.
    return announcement;
  }

  async updateAnnouncement(id, updateData) {
    const announcement = await announcementRepository.getAnnouncementById(id);
    if (!announcement) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Announcement not found');
    }
    return announcementRepository.updateAnnouncement(id, updateData);
  }

  async togglePublish(id, isPublished) {
    return this.updateAnnouncement(id, { isPublished });
  }

  async togglePin(id, isPinned) {
    return this.updateAnnouncement(id, { isPinned });
  }

  async deleteAnnouncement(id) {
    const announcement = await announcementRepository.deleteAnnouncement(id);
    if (!announcement) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Announcement not found');
    }
    return announcement;
  }
}

export default new AnnouncementService();
