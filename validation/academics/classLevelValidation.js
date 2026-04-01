const Joi = require('joi');

const objectIdString = Joi.string().hex().length(24);

const classLevelValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Class level name is required',
    }),

  description: Joi.string().allow(''),

  students: Joi.array().items(objectIdString).default([]),

  subjects: Joi.array().items(objectIdString).default([]),

  teachers: Joi.array().items(objectIdString).default([]),

}).options({ stripUnknown: true });

const classLevelUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),

  description: Joi.string(),

}).options({ stripUnknown: true });

module.exports = { classLevelValidationSchema, classLevelUpdateSchema };
