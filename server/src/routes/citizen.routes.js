import express from 'express';
import citizenController from '../controllers/citizen.controller.js';
import { verifyCitizenValidator, updateProfileValidator } from '../validators/citizen.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// All routes here require authentication
router.use(protect);

// @route   POST /api/v1/citizens/verify
// @desc    Verify user as a citizen
// @access  Private
router.post(
  '/verify',
  verifyCitizenValidator,
  validate,
  asyncHandler(citizenController.verify)
);

// @route   GET /api/v1/citizens/profile
// @desc    Get verified citizen profile
// @access  Private
router.get(
  '/profile',
  asyncHandler(citizenController.getProfile)
);

// @route   PUT /api/v1/citizens/profile
// @desc    Update verified citizen profile
// @access  Private
router.put(
  '/profile',
  updateProfileValidator,
  validate,
  asyncHandler(citizenController.updateProfile)
);

// @route   GET /api/v1/citizens/all
// @desc    Get all citizens
// @access  Private/Admin
router.get(
  '/all',
  authorize('admin'),
  asyncHandler(citizenController.getAllCitizens)
);

export default router;
