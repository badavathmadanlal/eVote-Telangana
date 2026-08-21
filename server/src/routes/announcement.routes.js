import express from 'express';
import announcementController from '../controllers/announcement.controller.js';
import { announcementValidator, toggleValidator } from '../validators/announcement.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Public routes
router.get(
  '/latest',
  asyncHandler(announcementController.getLatestAnnouncements)
);

router.get(
  '/pinned',
  asyncHandler(announcementController.getPinnedAnnouncements)
);

router.get(
  '/:id',
  asyncHandler(announcementController.getAnnouncementById)
);

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.post(
  '/',
  announcementValidator,
  validate,
  asyncHandler(announcementController.createAnnouncement)
);

router.get(
  '/',
  asyncHandler(announcementController.getAllAnnouncements)
);

router.put(
  '/:id',
  announcementValidator,
  validate,
  asyncHandler(announcementController.updateAnnouncement)
);

router.patch(
  '/:id/toggle',
  toggleValidator,
  validate,
  asyncHandler(announcementController.updateAnnouncement) // Can reuse update for toggling fields
);

router.delete(
  '/:id',
  asyncHandler(announcementController.deleteAnnouncement)
);

export default router;
