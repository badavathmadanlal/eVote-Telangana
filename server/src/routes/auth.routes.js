import express from 'express';
import authController from '../controllers/auth.controller.js';
import { 
  registerValidator, 
  loginValidator,
  sendOtpValidator,
  verifyOtpValidator,
  forgotPasswordValidator,
  verifyResetOtpValidator,
  resetPasswordValidator
} from '../validators/auth.validator.js';
import validate from '../middlewares/validate.js';
import asyncHandler from '../utils/asyncHandler.js';

import { authLimiter, otpLimiter } from '../middlewares/rateLimiter.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  registerValidator,
  validate,
  asyncHandler(authController.register)
);

router.post(
  '/login',
  authLimiter,
  loginValidator,
  validate,
  asyncHandler(authController.login)
);

router.post(
  '/login/otp',
  otpLimiter,
  sendOtpValidator,
  validate,
  asyncHandler(authController.sendLoginOtp)
);

router.post(
  '/login/otp/verify',
  authLimiter,
  verifyOtpValidator,
  validate,
  asyncHandler(authController.verifyLoginOtp)
);

router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validate,
  asyncHandler(authController.forgotPassword)
);

router.post(
  '/verify-reset-otp',
  verifyResetOtpValidator,
  validate,
  asyncHandler(authController.verifyResetOtp)
);

router.post(
  '/reset-password',
  resetPasswordValidator,
  validate,
  asyncHandler(authController.resetPassword)
);

router.get(
  '/me',
  protect,
  asyncHandler(authController.getMe)
);

router.get(
  '/users',
  protect,
  authorize('admin'),
  asyncHandler(authController.getAllUsers)
);

export default router;
