import ApiError from '../utils/ApiError.js';
import MESSAGES from '../constants/messages.js';

const notFound = (req, _res, next) => {
  const error = ApiError.notFound(
    `${MESSAGES.GENERAL.ROUTE_NOT_FOUND}: ${req.method} ${req.originalUrl}`
  );
  next(error);
};

export default notFound;
