import { check } from 'express-validator';

const allowedCategories = ['Election', 'General', 'Security', 'Maintenance', 'Emergency'];

export const announcementValidator = [
  check('title').notEmpty().withMessage('Title is required').trim(),
  check('content').notEmpty().withMessage('Content is required').trim(),
  check('category').optional().isIn(allowedCategories).withMessage('Invalid category'),
  check('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  check('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),
];

export const toggleValidator = [
  check('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
  check('isPinned').optional().isBoolean().withMessage('isPinned must be a boolean'),
];
