import Joi from 'joi';

export const staffAvailabilitySchema = {
  params: Joi.object({
    staffId: Joi.number().integer().positive().required().messages({
      'number.base': 'Staff ID must be a positive integer.',
      'any.required': 'Staff ID is required.',
    }),
  }),
  query: Joi.object({
    date: Joi.string()
      .isoDate()
      .required()
      .messages({
        'string.base': 'Date must be a string in ISO 8601 format.',
        'string.isoDate': 'Date must be a valid ISO 8601 date (e.g., 2025-03-15).',
        'any.required': 'Date parameter is required.',
      }),
    serviceId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.base': 'Service ID must be a positive integer.',
        'any.required': 'Service ID is required.',
      }),
  }),
};
