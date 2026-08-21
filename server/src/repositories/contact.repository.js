import Contact from '../models/contact.model.js';

class ContactRepository {
  async createContact(contactData) {
    return Contact.create(contactData);
  }

  async getAllContacts(query = {}) {
    return Contact.find(query).sort({ createdAt: -1 });
  }

  async getContactById(id) {
    return Contact.findById(id);
  }

  async updateContact(id, updateData) {
    return Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteContact(id) {
    return Contact.findByIdAndDelete(id);
  }
}

export default new ContactRepository();
