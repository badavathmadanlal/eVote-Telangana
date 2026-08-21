import { check } from 'express-validator';

export const contactValidator = [
  check('name').notEmpty().withMessage('Name is required').trim(),
  check('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  check('subject').notEmpty().withMessage('Subject is required').trim(),
  check('message').notEmpty().withMessage('Message is required').trim(),
  check('category').optional().isIn(['Registration', 'Login', 'Verification', 'Voting', 'Election', 'Candidates', 'Security', 'Technical', 'General']).withMessage('Invalid category'),
];

export const updateContactValidator = [
  check('status').optional().isIn(['Open', 'In Progress', 'Resolved', 'Closed']).withMessage('Invalid status'),
  check('adminReply').optional().trim(),
];
