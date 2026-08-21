import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Admin Dashboard - Strictly Admin Only
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/v1/dashboard/summary
// @desc    Get top-level KPIs
router.get(
  '/summary',
  asyncHandler(dashboardController.getSummary)
);

// @route   GET /api/v1/dashboard/charts
// @desc    Get chart-ready data distribution
router.get(
  '/charts',
  asyncHandler(dashboardController.getCharts)
);

// @route   GET /api/v1/dashboard/recent
// @desc    Get recent users, elections, candidates, votes
router.get(
  '/recent',
  asyncHandler(dashboardController.getRecent)
);

// @route   GET /api/v1/dashboard/activity
// @desc    Get chronological activity feed
router.get(
  '/activity',
  asyncHandler(dashboardController.getActivityFeed)
);

export default router;
