import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

/**
 * Middleware to format express-validator errors.
 * If errors exist, it throws an ApiError which is caught by the global error handler.
 */
const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  throw new ApiError(
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    'Validation failed',
    extractedErrors
  );
};

export default validate;
