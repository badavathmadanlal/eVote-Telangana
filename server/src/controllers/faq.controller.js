import faqService from '../services/faq.service.js';
import ApiResponse from '../utils/ApiResponse.js';

class FaqController {
  async createFaq(req, res) {
    const adminId = req.user._id;
    const faq = await faqService.createFaq(req.body, adminId);
    return ApiResponse.created(res, 'FAQ created successfully', { faq });
  }

  async getAllFaqs(req, res) {
    // For admin, might want all including inactive. For public, maybe only active.
    // The requirement says GET /faqs for public. Let's return only active ones if it's public.
    // Here we'll return all, and the client filters, or we can enforce isActive: true.
    const faqs = await faqService.getAllFaqs(req.query);
    return ApiResponse.success(res, 'FAQs retrieved successfully', { faqs });
  }

  async getFaqById(req, res) {
    const faq = await faqService.getFaqById(req.params.id);
    return ApiResponse.success(res, 'FAQ retrieved successfully', { faq });
  }

  async getFaqsByCategory(req, res) {
    const faqs = await faqService.getFaqsByCategory(req.params.category);
    return ApiResponse.success(res, 'FAQs retrieved successfully', { faqs });
  }

  async searchFaqs(req, res) {
    const faqs = await faqService.searchFaqs(req.query.q || '');
    return ApiResponse.success(res, 'FAQs retrieved successfully', { faqs });
  }

  async updateFaq(req, res) {
    const faq = await faqService.updateFaq(req.params.id, req.body);
    return ApiResponse.success(res, 'FAQ updated successfully', { faq });
  }

  async deleteFaq(req, res) {
    const faq = await faqService.deleteFaq(req.params.id);
    return ApiResponse.success(res, 'FAQ deleted successfully', { faq });
  }
}

export default new FaqController();
