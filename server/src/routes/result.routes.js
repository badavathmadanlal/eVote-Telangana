import express from 'express';
import resultController from '../controllers/result.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// All result routes are for Admin only
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/v1/results/dashboard
// @desc    Get system-wide analytics
// @access  Private (Admin Only)
router.get(
  '/dashboard',
  asyncHandler(resultController.getDashboardAnalytics)
);

// @route   GET /api/v1/results/election/:electionId
// @desc    Get detailed results for an election
// @access  Private (Admin Only)
router.get(
  '/election/:electionId',
  asyncHandler(resultController.getElectionResults)
);

// @route   GET /api/v1/results/candidate/:candidateId
// @desc    Get detailed results for a specific candidate
// @access  Private (Admin Only)
router.get(
  '/candidate/:candidateId',
  asyncHandler(resultController.getCandidateResults)
);

// @route   GET /api/v1/results/constituency/:constituency
// @desc    Get latest election results for a constituency
// @access  Private (Admin Only)
router.get(
  '/constituency/:constituency',
  asyncHandler(resultController.getConstituencyResults)
);

export default router;
