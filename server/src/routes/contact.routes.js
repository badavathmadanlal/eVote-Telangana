import express from 'express';
import contactController from '../controllers/contact.controller.js';
import { contactValidator, updateContactValidator } from '../validators/contact.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Public route
router.post(
  '/',
  contactValidator,
  validate,
  asyncHandler(contactController.submitContact)
);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.get(
  '/',
  asyncHandler(contactController.getAllContacts)
);

router.get(
  '/:id',
  asyncHandler(contactController.getContactById)
);

router.patch(
  '/:id',
  updateContactValidator,
  validate,
  asyncHandler(contactController.updateContact)
);

router.delete(
  '/:id',
  asyncHandler(contactController.deleteContact)
);

export default router;
