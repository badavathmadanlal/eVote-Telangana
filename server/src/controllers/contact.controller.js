import contactService from '../services/contact.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class ContactController {
  async submitContact(req, res) {
    const contact = await contactService.createContact(req.body);
    return ApiResponse.created(res, 'Contact request submitted successfully', { contact });
  }

  async getAllContacts(req, res) {
    const contacts = await contactService.getAllContacts(req.query);
    return ApiResponse.success(res, 'Contact requests retrieved successfully', { contacts });
  }

  async getContactById(req, res) {
    const contact = await contactService.getContactById(req.params.id);
    return ApiResponse.success(res, 'Contact request retrieved successfully', { contact });
  }

  async updateContact(req, res) {
    const contact = await contactService.updateContact(req.params.id, req.body);
    return ApiResponse.success(res, 'Contact request updated successfully', { contact });
  }

  async deleteContact(req, res) {
    const contact = await contactService.deleteContact(req.params.id);
    return ApiResponse.success(res, 'Contact request deleted successfully', { contact });
  }
}

export default new ContactController();
