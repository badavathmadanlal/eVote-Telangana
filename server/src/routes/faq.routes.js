import express from 'express';
import faqController from '../controllers/faq.controller.js';
import { faqValidator } from '../validators/faq.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Public routes
router.get(
  '/',
  asyncHandler(faqController.getAllFaqs)
);

router.get(
  '/category/:category',
  asyncHandler(faqController.getFaqsByCategory)
);

router.get(
  '/search',
  asyncHandler(faqController.searchFaqs)
);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.post(
  '/',
  faqValidator,
  validate,
  asyncHandler(faqController.createFaq)
);

router.get(
  '/:id',
  asyncHandler(faqController.getFaqById)
);

router.put(
  '/:id',
  faqValidator,
  validate,
  asyncHandler(faqController.updateFaq)
);

router.delete(
  '/:id',
  asyncHandler(faqController.deleteFaq)
);

export default router;
