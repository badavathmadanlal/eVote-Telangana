const MESSAGES = Object.freeze({
  GENERAL: {
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    ROUTE_NOT_FOUND: 'The requested route does not exist',
    VALIDATION_ERROR: 'Validation failed',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Access denied',
    TOO_MANY_REQUESTS: 'Too many requests, please try again later',
    SUCCESS: 'Operation completed successfully',
  },
  SERVER: {
    STARTING: 'Starting server...',
    RUNNING: (port) => `🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`,
    SHUTDOWN: 'Server shutting down gracefully...',
  },
});

export default MESSAGES;
