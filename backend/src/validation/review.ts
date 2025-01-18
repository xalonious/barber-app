import Joi from 'joi';

export const createReviewSchema = {
  body: Joi.object({
    customerId: Joi.number().integer().positive().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().required(),
  }),
};

export const reviewIdParamSchema = {
  params: Joi.object({
    reviewid: Joi.number().integer().positive().required(),
  }),
};
