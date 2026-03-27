// middleware/errorHandler.js
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log error with full stack trace using Winston
  // Replaces console.error with structured logging
  logger.error(`${err.message} — ${req.method} ${req.originalUrl}`, {
    stack: err.stack
  });

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;