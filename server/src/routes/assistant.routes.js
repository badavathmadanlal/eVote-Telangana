import express from 'express';
import assistantController from '../controllers/assistant.controller.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// Public chat route - No authentication required
router.post(
  '/chat',
  asyncHandler(assistantController.chat)
);

export default router;
