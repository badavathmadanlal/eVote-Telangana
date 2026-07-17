import { check } from 'express-validator';

// Create Candidate Validator
export const createCandidateValidator = [
  check('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .trim(),

  check('partyName')
    .notEmpty()
    .withMessage('Party name is required')
    .trim(),

  check('partySymbol')
    .notEmpty()
    .withMessage('Party symbol is required')
    .trim(),

  check('electionId')
    .notEmpty()
    .withMessage('Election ID is required')
    .isMongoId()
    .withMessage('Election ID must be a valid MongoDB ObjectId'),

  check('constituency')
    .notEmpty()
    .withMessage('Constituency is required')
    .trim(),

  check('photoUrl')
    .optional()
    .isURL()
    .withMessage('Photo URL must be a valid URL'),

  check('manifesto')
    .optional()
    .trim(),
];

// Update Candidate Validator
export const updateCandidateValidator = [
  check('fullName')
    .optional()
    .trim(),

  check('partyName')
    .optional()
    .trim(),

  check('partySymbol')
    .optional()
    .trim(),

  check('electionId')
    .optional()
    .isMongoId()
    .withMessage('Election ID must be a valid MongoDB ObjectId'),

  check('constituency')
    .optional()
    .trim(),

  check('photoUrl')
    .optional()
    .isURL()
    .withMessage('Photo URL must be a valid URL'),

  check('manifesto')
    .optional()
    .trim(),
];