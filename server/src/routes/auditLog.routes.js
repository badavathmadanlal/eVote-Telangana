import express from 'express';
import auditLogController from '../controllers/auditLog.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', asyncHandler(auditLogController.getLogs));

export default router;
