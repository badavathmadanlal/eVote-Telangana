import { check } from 'express-validator';

export const verifyCitizenValidator = [
  check('voterId')
    .notEmpty()
    .withMessage('Voter ID is required')
    .trim()
    .toUpperCase(),

  check('aadhaar')
    .notEmpty()
    .withMessage('Aadhaar number is required')
    .isLength({ min: 12, max: 12 })
    .withMessage('Aadhaar number must be exactly 12 digits')
    .isNumeric()
    .withMessage('Aadhaar number must contain only numbers'),
];

export const updateProfileValidator = [];