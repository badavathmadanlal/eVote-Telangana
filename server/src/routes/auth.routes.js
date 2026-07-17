import express from 'express';
import authController from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import validate from '../middlewares/validate.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  registerValidator,
  validate,
  asyncHandler(authController.register)
);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  loginValidator,
  validate,
  asyncHandler(authController.login)
);

export default router;
