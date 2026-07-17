const LOG_LEVELS = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG' };

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

const logger = {
  error: (message, meta = {}) => console.error(formatMessage(LOG_LEVELS.ERROR, message, meta)),
  warn: (message, meta = {}) => console.warn(formatMessage(LOG_LEVELS.WARN, message, meta)),
  info: (message, meta = {}) => console.info(formatMessage(LOG_LEVELS.INFO, message, meta)),
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage(LOG_LEVELS.DEBUG, message, meta));
    }
  },
};

export default logger;
