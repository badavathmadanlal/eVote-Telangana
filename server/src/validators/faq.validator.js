import { check } from 'express-validator';

const allowedCategories = ['Registration', 'Login', 'Verification', 'Voting', 'Election', 'Candidates', 'Security', 'Technical', 'General'];

export const faqValidator = [
  check('question').notEmpty().withMessage('Question is required').trim(),
  check('answer').notEmpty().withMessage('Answer is required').trim(),
  check('category').notEmpty().withMessage('Category is required').isIn(allowedCategories).withMessage('Invalid category'),
  check('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];
