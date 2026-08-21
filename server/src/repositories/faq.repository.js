import Faq from '../models/faq.model.js';

class FaqRepository {
  async createFaq(faqData) {
    return Faq.create(faqData);
  }

  async getAllFaqs(query = {}) {
    return Faq.find(query).sort({ createdAt: -1 });
  }

  async getFaqById(id) {
    return Faq.findById(id);
  }

  async updateFaq(id, updateData) {
    return Faq.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteFaq(id) {
    return Faq.findByIdAndDelete(id);
  }

  async searchFaqs(searchTerm) {
    return Faq.find({ $text: { $search: searchTerm }, isActive: true }).sort({ score: { $meta: 'textScore' } });
  }
}

export default new FaqRepository();
