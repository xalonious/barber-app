import Joi from 'joi';

const allowedServices = ['Knipbeurt', 'Baardtrimmen', 'Scheren', 'Kapsel & Baard Combinatie'];


export const createAppointmentSchema = {
  body: Joi.object({
    customerId: Joi.number().integer().positive().required(),
    service: Joi.string()
      .valid(...allowedServices)
      .required(),
    date: Joi.date().iso().required(),
    staffId: Joi.number().integer().positive().required(),
  }),
};

export const updateAppointmentSchema = {
  body: Joi.object({
    customerId: Joi.number().integer().positive().required(),
    service: Joi.string()
      .valid(...allowedServices)
      .optional(),
    date: Joi.date().iso().optional(),
    staffId: Joi.number().integer().positive().optional(),
  }).or('service', 'date', 'staffId'),
};


export const appointmentIdParamSchema = {
  params: Joi.object({
    appointmentid: Joi.number().integer().positive().required(),
  }),
};

export const customerIdParamSchema = {
  params: Joi.object({
    customerid: Joi.number().integer().positive().required(),
  }),
};
