import { RSL_LOAD } from './constants.js';
import Joi from 'joi';

export const isRSLA = ({ type }) => type === RSL_LOAD;

const schemaFSA = Joi.object({
  type: Joi.string().required(),
  payload: Joi.any().optional(),
});

const schemaRSLA = Joi.object({
  type: Joi.only(RSL_LOAD).required(),
  payload: Joi.string().required(),
  async: Joi.boolean().optional(),
  check: Joi.func().optional(),
  append: Joi.alternatives().try(Joi.string(), schemaFSA).optional(),
  success: Joi.alternatives().try(Joi.string(), schemaFSA).optional(),
  fail: Joi.alternatives().try(Joi.string(), schemaFSA).optional(),
});

export const validateRSLAction = (action) => {
  const { error } = Joi.validate(action, schemaRSLA, { abortEarly: false });
  return error ? error.details : [];
};
