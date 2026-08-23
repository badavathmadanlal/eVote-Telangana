import rateLimit from 'express-rate-limit';
import envConfig from '../config/env.js';
import { isDemoMobile } from '../constants/demoAccounts.js';

/**
 * Helper to check if request is for one of the 6 exact demo accounts
 */
const shouldBypassDemoRateLimit = (req) => {
  const identifier = 
    req.body?.mobileNumber || 
    req.body?.identifier || 
    req.body?.emailOrMobile ||
    req.query?.mobileNumber ||
    req.query?.identifier;

  if (identifier && isDemoMobile(identifier)) {
    return true; // Bypass strictly for verified academic demo mobile numbers
  }
  return false;
};

/**
 * General API rate limiter for non-demo endpoints
 */
export const globalLimiter = rateLimit({
  windowMs: envConfig.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: Math.max(envConfig.RATE_LIMIT_MAX || 100, 500),
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => shouldBypassDemoRateLimit(req),
});

/**
 * Stricter rate limiter for authentication endpoints (prevent brute-force for real numbers)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 requests per 15 minutes for real voter authentication
  message: {
    success: false,
    message: 'Too many authentication requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => shouldBypassDemoRateLimit(req),
});

/**
 * Stricter OTP rate limiter for SMS dispatch (prevent SMS flooding for real numbers)
 */
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, // Max 5 OTP requests per 10 minutes for real mobile numbers
  message: {
    success: false,
    message: 'Too many OTP requests for this number. Please wait before requesting another OTP.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => shouldBypassDemoRateLimit(req),
});

export default {
  globalLimiter,
  authLimiter,
  otpLimiter,
};
