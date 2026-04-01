const Joi = require('joi');

const objectIdString = Joi.string().hex().length(24);

/** Accepts Date, ISO strings, or a four-digit year string (e.g. "2020"). */
const yearOrDate = (label) =>
  Joi.any()
    .required()
    .custom((value, helpers) => {
      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
      }
      if (typeof value === 'string' && /^\d{4}$/.test(value)) {
        return new Date(Date.UTC(parseInt(value, 10), 0, 1));
      }
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        return helpers.error('any.invalid');
      }
      return d;
    }, `${label} (date or YYYY)`)
    .messages({
      'any.required': `${label} is required`,
      'any.invalid': `Invalid ${label} — use a date or a four-digit year`,
    });

const academicYearValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      'any.required': 'Academic year name is required',
    }),

  fromYear: yearOrDate('Start of academic year'),

  toYear: yearOrDate('End of academic year'),

  isCurrent: Joi.boolean().default(false),

  students: Joi.array().items(objectIdString).default([]),

  teachers: Joi.array().items(objectIdString).default([]),

}).options({ stripUnknown: true });

const academicYearUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'string.min': 'Name must be at least {#limit} characters long',
      'string.max': 'Name cannot exceed {#limit} characters',
    }),
}).options({ stripUnknown: true });

module.exports = { academicYearValidationSchema, academicYearUpdateSchema };
