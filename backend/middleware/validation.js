const Joi = require('joi');

const patientSchema = Joi.object({
  fullName: Joi.string()
    .pattern(/^[a-zA-Z\s]+$/)
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.pattern.base': 'Full name must contain only letters and spaces',
      'string.min': 'Full name must be at least 2 characters long',
      'string.max': 'Full name must not exceed 100 characters',
      'any.required': 'Full name is required'
    }),
  
  email: Joi.string()
    .email()
    .pattern(/@gmail\.com$/)
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.pattern.base': 'Email must be a Gmail address (@gmail.com)',
      'any.required': 'Email is required'
    }),
  
  phone: Joi.string()
    .pattern(/^\+\d{1,3}\d{4,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must include country code and be 5-15 digits (e.g., +1234567890)',
      'any.required': 'Phone number is required'
    })
});

const validatePatient = (req, res, next) => {
  const { error, value } = patientSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  req.body = value;
  next();
};

const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Document photo is required'
    });
  }
  next();
};

module.exports = {
  validatePatient,
  validateFileUpload
};