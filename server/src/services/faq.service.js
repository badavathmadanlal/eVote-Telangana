import faqRepository from '../repositories/faq.repository.js';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

class FaqService {
  async createFaq(faqData, adminId) {
    const data = { ...faqData, createdBy: adminId };
    return faqRepository.createFaq(data);
  }

  async getAllFaqs(filters) {
    return faqRepository.getAllFaqs(filters);
  }

  async getFaqById(id) {
    const faq = await faqRepository.getFaqById(id);
    if (!faq) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'FAQ not found');
    }
    return faq;
  }

  async getFaqsByCategory(category) {
    return faqRepository.getAllFaqs({ category, isActive: true });
  }

  async searchFaqs(searchTerm) {
    return faqRepository.searchFaqs(searchTerm);
  }

  async updateFaq(id, updateData) {
    const faq = await faqRepository.getFaqById(id);
    if (!faq) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'FAQ not found');
    }

    return faqRepository.updateFaq(id, updateData);
  }

  async deleteFaq(id) {
    const faq = await faqRepository.deleteFaq(id);
    if (!faq) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'FAQ not found');
    }
    return faq;
  }
}

export default new FaqService();
