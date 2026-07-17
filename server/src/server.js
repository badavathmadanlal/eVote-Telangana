import app from './app.js';
import connectDB from './config/db.js';
import envConfig from './config/env.js';
import MESSAGES from './constants/messages.js';
import logger from './utils/logger.js';

const startServer = async () => {
  try {
    logger.info(MESSAGES.SERVER.STARTING);

    await connectDB();

    const server = app.listen(envConfig.PORT, () => {
      logger.info(MESSAGES.SERVER.RUNNING(envConfig.PORT));
    });

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. ${MESSAGES.SERVER.SHUTDOWN}`);
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection', { reason: reason?.toString() });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', { error: error.message });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
};

startServer();
