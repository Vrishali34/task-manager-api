// validators/taskValidator.js

const Joi = require('joi');

// Validation schema for creating a task
const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 3 characters long',
      'any.required': 'Title is required'
    })
});

// Validation schema for updating a task
const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(255)
    .optional(),

  completed: Joi.boolean()
    .optional()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
