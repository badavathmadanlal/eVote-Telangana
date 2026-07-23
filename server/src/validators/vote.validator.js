import { check } from 'express-validator';

export const castVoteValidator = [
  check('candidateId')
    .notEmpty()
    .withMessage('Candidate ID is required')
    .isMongoId()
    .withMessage('Candidate ID must be a valid MongoDB ObjectId'),

  check('electionId')
    .notEmpty()
    .withMessage('Election ID is required')
    .isMongoId()
    .withMessage('Election ID must be a valid MongoDB ObjectId'),
];
