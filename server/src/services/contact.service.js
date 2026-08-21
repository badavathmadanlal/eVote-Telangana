import contactRepository from '../repositories/contact.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class ContactService {
  async createContact(contactData) {
    return contactRepository.createContact(contactData);
  }

  async getAllContacts(filters) {
    return contactRepository.getAllContacts(filters);
  }

  async getContactById(id) {
    const contact = await contactRepository.getContactById(id);
    if (!contact) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Contact request not found');
    }
    return contact;
  }

  async updateContact(id, updateData) {
    const contact = await contactRepository.getContactById(id);
    if (!contact) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Contact request not found');
    }

    return contactRepository.updateContact(id, updateData);
  }

  async deleteContact(id) {
    const contact = await contactRepository.deleteContact(id);
    if (!contact) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Contact request not found');
    }
    return contact;
  }
}

export default new ContactService();
