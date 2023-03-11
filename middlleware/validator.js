const Joi = require("joi");
const { Contacts } = require("../db/contactModel");
const { AppError } = require("../helpers/errors");

const addValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(30).email().required(),
    phone: Joi.string().min(3).max(30).required(),
    favorite: Joi.boolean(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
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
    return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

const checkUserId = async (req, res, next) => {
  const id = req.params.contactId;

  try {
    await Contacts.findById(id);
  } catch (err) {
    return next(new AppError(404, `User with id ${id} not found`));
  }

  next();
};

module.exports = { addValidation, putValidation, checkUserId };
