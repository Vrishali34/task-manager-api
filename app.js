// app.js
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const express = require('express');
const app = express();

// Swagger imports
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Import routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Import global error handler
const errorHandler = require('./middleware/errorHandler');

// Middleware to parse JSON
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager API is running',
    status: 'success'
  });
});

// Mount routes
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Global error middleware (must be after routes)
app.use(errorHandler);

module.exports = app;