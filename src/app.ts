/**
 * @fileoverview Express Application Entry Point.
 *
 * This file:
 * 1. Configures Express with production-grade middleware
 * 2. Registers all API routes
 * 3. Sets up error handling
 * 4. Starts the server
 *
 * Middleware stack (in order):
 * - helmet: Security headers
 * - cors: Cross-origin resource sharing
 * - compression: GZIP response compression
 * - morgan: HTTP request logging
 * - express.json: JSON body parsing
 * - rate-limit: API rate limiting
 * - routes: API route handlers
 * - 404 handler: Catches undefined routes
 * - error handler: Global error catch
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Route imports
import collegeRoutes from './routes/collegeRoutes';
import compareRoutes from './routes/compareRoutes';
import predictorRoutes from './routes/predictorRoutes';
import filterRoutes from './routes/filterRoutes';
import externalRoutes from './routes/externalRoutes';


// Middleware imports
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// MIDDLEWARE CONFIGURATION
// =============================================

// Security headers (protects against common web vulnerabilities)
app.use(helmet());

// GZIP compression for smaller response sizes
app.use(compression());

// HTTP request logging (use 'combined' in production for more details)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parse JSON request bodies (limit to 10kb to prevent abuse)
app.use(express.json({ limit: '10kb' }));

// Rate limiting for external/public endpoints (more relaxed)
const externalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute (allows for 1s polling)
  message: { success: false, error: 'Too many requests to the public API.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/external', externalLimiter, externalRoutes);

// CORS configuration — allow frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);


// General Rate limiting — prevents API abuse
// 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);


// =============================================
// API ROUTES
// =============================================

// Health check endpoint (useful for deployment monitoring)
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'College Discovery Platform API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// College listing, search, filters, detail
app.use('/api/colleges', collegeRoutes);

// College comparison (2-3 colleges side by side)
app.use('/api/compare', compareRoutes);

// Predictor tool (exam + rank → college suggestions)
app.use('/api/predictor', predictorRoutes);

// Filter dropdown data (locations, courses)
app.use('/api/filters', filterRoutes);

// =============================================
// ERROR HANDLING
// =============================================

// 404 handler — catches requests to undefined routes
app.use(notFoundHandler);

// Global error handler — must be registered LAST
app.use(errorHandler);

// =============================================
// SERVER STARTUP
// =============================================

app.listen(PORT, () => {
  console.log(`\n🎓 College Discovery Platform API`);
  console.log(`   ├── Server:      http://localhost:${PORT}`);
  console.log(`   ├── Health:      http://localhost:${PORT}/api/health`);
  console.log(`   ├── Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   └── Started at:  ${new Date().toLocaleTimeString()}\n`);
});

export default app;
