import express from 'express';
import rateLimit from 'express-rate-limit';
import aiController from '../controllers/ai.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { isDemoMobile } from '../constants/demoAccounts.js';

const router = express.Router();

// Dedicated rate limiter for AI Assistant (with demo citizen exemption)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // 60 requests per minute
  message: {
    success: false,
    message: 'AI request limit reached. Please wait a minute before asking more questions.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => Boolean(req.user?.isDemoAccount || isDemoMobile(req.user?.mobileNumber)),
});

// Authenticated AI Chat Route (protect must run before aiLimiter so req.user is populated)
router.post('/chat', protect, aiLimiter, aiController.chat);

export default router;
