import express from 'express';
import voteController from '../controllers/vote.controller.js';
import { castVoteValidator } from '../validators/vote.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Apply JWT protection to all routes
router.use(protect);

// @route   POST /api/v1/votes/cast
// @desc    Cast a vote
// @access  Private (Verified Voter)
router.post(
  '/cast',
  castVoteValidator,
  validate,
  asyncHandler(voteController.castVote)
);

// @route   GET /api/v1/votes/me
// @desc    Get user's voting history
// @access  Private (Voter)
router.get(
  '/me',
  asyncHandler(voteController.getMyVotes)
);

// @route   GET /api/v1/votes/election/:electionId
// @desc    Get raw election results
// @access  Private (Admin Only)
router.get(
  '/election/:electionId',
  authorize('admin'),
  asyncHandler(voteController.getElectionResults)
);

export default router;
