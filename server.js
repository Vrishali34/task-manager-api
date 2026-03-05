// server.js

require('dotenv').config(); // Load environment variables

const express = require('express');
const app = express();

// Use PORT from .env or fallback to 3000
const PORT = process.env.PORT || 3000;

// Import task routes
const taskRoutes = require('./routes/taskRoutes');

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

// Mount task routes
app.use('/tasks', taskRoutes);

// Global error middleware (must be after routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});