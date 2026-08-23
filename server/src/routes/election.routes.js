import express from 'express';
import electionController from '../controllers/election.controller.js';
import { electionValidator, updateStatusValidator } from '../validators/election.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize, optionalProtect } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Public / Citizen GET routes (with optional user context)
router.get(
  '/active',
  optionalProtect,
  asyncHandler(electionController.getActiveElection)
);

router.get(
  '/',
  optionalProtect,
  asyncHandler(electionController.getAllElections)
);

router.get(
  '/:id',
  optionalProtect,
  asyncHandler(electionController.getElectionById)
);

// Admin-only mutation routes
router.post(
  '/',
  protect,
  authorize('admin'),
  electionValidator,
  validate,
  asyncHandler(electionController.createElection)
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  electionValidator,
  validate,
  asyncHandler(electionController.updateElection)
);

router.patch(
  '/:id/status',
  protect,
  authorize('admin'),
  updateStatusValidator,
  validate,
  asyncHandler(electionController.updateElectionStatus)
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  asyncHandler(electionController.deleteElection)
);

export default router;
