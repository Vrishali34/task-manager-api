// app.js
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Swagger imports
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const morganMiddleware = require('./middleware/morganMiddleware');
const logger = require('./utils/logger');

// ─── SECURITY MIDDLEWARE ────────────────────────────────────

// Helmet — sets secure HTTP response headers
// contentSecurityPolicy disabled to allow Swagger UI to load correctly
app.use(helmet({
  contentSecurityPolicy: false
}));

// General rate limiter — applied to all routes
// Allows 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth rate limiter — stricter, applied only to login and register
// Allows 10 requests per 15 minutes per IP
// Prevents brute force attacks on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 'error',
    message: 'Too many attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ─── LOGGING MIDDLEWARE ─────────────────────────────────────

// Morgan — logs every HTTP request through Winston
app.use(morganMiddleware);

// ─── GENERAL MIDDLEWARE ─────────────────────────────────────

// Apply general limiter to all routes
app.use(generalLimiter);

// Middleware to parse JSON
app.use(express.json());

// ─── ROUTES ────────────────────────────────────────────────

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    status: 'success'
  });
});

// Mount routes — auth limiter applied specifically to auth routes
app.use('/tasks', taskRoutes);
app.use('/auth', authLimiter, authRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── ERROR HANDLER ──────────────────────────────────────────

// Global error middleware (must be after routes)
app.use(errorHandler);

// Log server startup
logger.info('App configured successfully');

module.exports = app;