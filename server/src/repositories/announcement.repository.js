import Announcement from '../models/announcement.model.js';

class AnnouncementRepository {
  async createAnnouncement(data) {
    return Announcement.create(data);
  }

  async getAllAnnouncements(query = {}) {
    return Announcement.find(query).sort({ isPinned: -1, createdAt: -1 });
  }

  async getAnnouncementById(id) {
    return Announcement.findById(id);
  }

  async getLatestAnnouncements(limit = 10) {
    return Announcement.find({ isPublished: true }).sort({ createdAt: -1 }).limit(limit);
  }

  async getPinnedAnnouncements() {
    return Announcement.find({ isPublished: true, isPinned: true }).sort({ createdAt: -1 });
  }

  async updateAnnouncement(id, updateData) {
    return Announcement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteAnnouncement(id) {
    return Announcement.findByIdAndDelete(id);
  }
}

export default new AnnouncementRepository();
