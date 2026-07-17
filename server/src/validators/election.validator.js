import { check } from 'express-validator';

export const electionValidator = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  
  check('electionType')
    .notEmpty()
    .withMessage('Election type is required')
    .trim(),
  
  check('constituency')
    .notEmpty()
    .withMessage('Constituency is required')
    .trim(),
  
  check('state')
    .notEmpty()
    .withMessage('State is required')
    .trim(),
  
  check('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date string'),
  
  check('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date string'),
];
