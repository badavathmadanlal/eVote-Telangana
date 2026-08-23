import { check } from 'express-validator';

export const registerValidator = [
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters')
    .trim(),

  check('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
    .trim(),

  check('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),

  check('mobileNumber')
    .optional({ checkFalsy: true })
    .matches(/^\d{10}$/).withMessage('Must be a valid 10-digit mobile number'),

  check('aadhaar')
    .optional({ checkFalsy: true })
    .matches(/^\d{12}$/).withMessage('Aadhaar must be a 12-digit number'),

  check('whatsappNumber')
    .optional({ checkFalsy: true })
    .matches(/^\d{10}$/).withMessage('WhatsApp number must be a valid 10-digit mobile number'),

  check('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const loginValidator = [
  check('emailOrMobile')
    .notEmpty().withMessage('Email, Mobile, or Aadhaar number is required'),
  check('password')
    .notEmpty().withMessage('Password is required'),
];

export const sendOtpValidator = [
  check('mobileNumber')
    .notEmpty().withMessage('Mobile number or Aadhaar is required')
    .matches(/^(\d{10}|\d{12})$/).withMessage('Must be a valid 10-digit mobile or 12-digit Aadhaar number'),
];

export const verifyOtpValidator = [
  check('mobileNumber')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^(\d{10}|\d{12})$/).withMessage('Must be a valid 10-digit mobile or 12-digit Aadhaar number'),
  check('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
];

export const forgotPasswordValidator = [
  check('identifier')
    .notEmpty().withMessage('Email or Mobile number is required'),
];

export const verifyResetOtpValidator = [
  check('identifier')
    .notEmpty().withMessage('Email or Mobile number is required'),
  check('otp')
    .notEmpty().withMessage('OTP is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
];

export const resetPasswordValidator = [
  check('resetToken')
    .notEmpty().withMessage('Reset token is required'),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
  check('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];
