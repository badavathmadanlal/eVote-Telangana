import express from 'express';
import candidateController from '../controllers/candidate.controller.js';
import {
  createCandidateValidator,
  updateCandidateValidator,
} from '../validators/candidate.validator.js';
import validate from '../middlewares/validate.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Apply JWT protection to all routes
router.use(protect);

// GET routes (Authenticated users)
router.get(
  '/',
  asyncHandler(candidateController.getAllCandidates)
);

router.get(
  '/:id',
  asyncHandler(candidateController.getCandidateById)
);

router.get(
  '/election/:electionId',
  asyncHandler(candidateController.getCandidatesByElection)
);

// Admin-only routes
router.post(
  '/',
  authorize('admin'),
  createCandidateValidator,
  validate,
  asyncHandler(candidateController.createCandidate)
);

router.put(
  '/:id',
  authorize('admin'),
  updateCandidateValidator,
  validate,
  asyncHandler(candidateController.updateCandidate)
);

router.delete(
  '/:id',
  authorize('admin'),
  asyncHandler(candidateController.deleteCandidate)
);

export default router;
