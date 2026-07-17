import express from 'express';
import electionController from '../controllers/election.controller.js';
import { electionValidator } from '../validators/election.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Apply JWT protection to all routes
router.use(protect);

// Admin-only routes
router.post(
  '/',
  authorize('admin'),
  electionValidator,
  validate,
  asyncHandler(electionController.createElection)
);

router.put(
  '/:id',
  authorize('admin'),
  electionValidator, // Assuming we validate the full payload on update too
  validate,
  asyncHandler(electionController.updateElection)
);

router.delete(
  '/:id',
  authorize('admin'),
  asyncHandler(electionController.deleteElection)
);

// Authenticated user routes (GET)
// Note: /active must be defined before /:id to prevent 'active' being treated as an id parameter.
router.get(
  '/active',
  asyncHandler(electionController.getActiveElection)
);

router.get(
  '/',
  asyncHandler(electionController.getAllElections)
);

router.get(
  '/:id',
  asyncHandler(electionController.getElectionById)
);

export default router;
