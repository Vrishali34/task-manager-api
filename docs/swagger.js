// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'taskion',
      version: '1.0.0',
      description: 'Taskion — A secure, production-style REST API for managing personal tasks. Built with Node.js, Express, and PostgreSQL.',
    },
    servers: [
  {
    url: process.env.NODE_ENV === 'production'
      ? 'https://taskion.onrender.com'
      : 'http://localhost:5000',
    description: process.env.NODE_ENV === 'production'
      ? 'Production server'
      : 'Local development server'
  }
],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;