import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import envConfig from './config/env.js';
import corsOptions from './config/cors.js';
import morganConfig from './config/morgan.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import ApiResponse from './utils/ApiResponse.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: envConfig.RATE_LIMIT_WINDOW_MS,
  max: envConfig.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Request Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
const morganMiddleware =
  envConfig.NODE_ENV === 'production' ? morganConfig.production : morganConfig.dev;
app.use(morganMiddleware);

// Health Check
app.get('/api/health', (_req, res) => {
  ApiResponse.success(res, 'Server is healthy', {
    uptime: process.uptime(),
    environment: envConfig.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

import authRoutes from './routes/auth.routes.js';
import citizenRoutes from './routes/citizen.routes.js';
import electionRoutes from './routes/election.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import voteRoutes from './routes/vote.routes.js';

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/citizens', citizenRoutes);
app.use('/api/v1/elections', electionRoutes);
app.use('/api/v1/candidates', candidateRoutes);
app.use('/api/v1/votes', voteRoutes);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
