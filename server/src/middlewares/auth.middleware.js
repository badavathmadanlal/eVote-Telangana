import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import envConfig from '../config/env.js';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized to access this route');
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
    }
    next();
  } catch (err) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Not authorized to access this route');
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `User role ${req.user.role} is not authorized to access this route`
      );
    }
    next();
  };
};
