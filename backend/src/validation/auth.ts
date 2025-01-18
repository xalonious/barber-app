import Joi from 'joi';

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(), 
  }),
};