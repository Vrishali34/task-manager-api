// utils/logger.js
const winston = require('winston');

// Define log format
// Combines timestamp, log level, and message into clean readable output
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // includes stack trace on errors
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Colorized format for console output only
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message}\n${stack}`
      : `${timestamp} [${level}]: ${message}`;
  })
);

// Create Winston logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'http',
  transports: [

    // Console transport — colorized, for development visibility
    new winston.transports.Console({
      format: consoleFormat
    }),

    // Combined log file — all levels
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat
    }),

    // Error log file — only errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat
    })

  ]
});

module.exports = logger;