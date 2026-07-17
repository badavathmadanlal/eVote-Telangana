import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import envConfig from '../config/env.js';

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(error.errors.length && { errors: error.errors }),
    ...(envConfig.NODE_ENV === 'development' && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  };

  logger.error(error.message, {
    statusCode: error.statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
