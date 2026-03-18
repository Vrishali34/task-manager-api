// validators/authValidator.js
const Joi = require('joi');

// Schema for registering a new user
const registerSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

// Schema for logging in
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),

  // No min() on login password intentionally
  // We only check it exists — let bcrypt comparison handle the rest
  // This avoids leaking information about password rules to attackers
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

module.exports = {
  registerSchema,
  loginSchema
};