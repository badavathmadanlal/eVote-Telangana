import { check } from 'express-validator';
import { isDemoMobile } from '../constants/demoAccounts.js';

export const verifyCitizenValidator = [
  check('voterId')
    .notEmpty()
    .withMessage('Voter ID is required')
    .trim()
    .toUpperCase(),

  check('aadhaar')
    .notEmpty()
    .withMessage('Aadhaar or Demo Aadhaar Identifier is required')
    .trim()
    .custom((value, { req }) => {
      const voterId = String(req.body.voterId || '').trim().toUpperCase();
      const isDemo = 
        req.user?.isDemoAccount || 
        voterId.startsWith('DEMO-TEL-') || 
        isDemoMobile(req.user?.mobileNumber);

      if (isDemo) {
        if (!value || value.length < 3) {
          throw new Error('Please enter a valid Demo Aadhaar Identifier');
        }
        return true;
      }

      // Normal non-demo users strictly require exactly 12 numeric digits
      if (!/^\d{12}$/.test(value)) {
        throw new Error('Aadhaar number must be exactly 12 numeric digits');
      }

      return true;
    }),
];

export const updateProfileValidator = [];
