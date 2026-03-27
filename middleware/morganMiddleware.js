// middleware/morganMiddleware.js
const morgan = require('morgan');
const logger = require('../utils/logger');

// Create a write stream that pipes Morgan output into Winston
const stream = {
  write: (message) => logger.http(message.trim())
};

// Morgan format — logs method, URL, status, response time
// 'combined' format — Apache style, includes IP, user agent
const morganMiddleware = morgan('combined', { stream });

module.exports = morganMiddleware;