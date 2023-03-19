const Joi = require("joi");
const { ValidationError } = require("../helpers/errors");

const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

const addValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(30).email().required(),
    phone: Joi.string().min(3).max(30).required(),
    favorite: Joi.boolean(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    next(new ValidationError(validationResult.error.details[0].message));
    // return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

const putValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().min(3).max(30).email().optional(),
    phone: Joi.string().min(3).max(30).optional(),
    favorite: Joi.boolean(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    next(new ValidationError(validationResult.error.details[0].message));
    // return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

const createUserValidator = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().regex(PASSWD_REGEX).required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    next(new ValidationError(validationResult.error.details[0].message));
    // return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

module.exports = { addValidation, putValidation, createUserValidator };
