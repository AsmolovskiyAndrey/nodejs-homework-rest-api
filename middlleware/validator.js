const Joi = require("joi");

const addPostValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).hostname().required(),
    email: Joi.string().min(3).max(30).email().required(),
    phone: Joi.string().min(3).max(30).required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

const patchPostValidation = (req, res, next) => {
  const schema = Joi.object({
    topic: Joi.string().min(3).max(30).optional(),
    text: Joi.string().min(10).max(500).optional(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ status: validationResult.error.details });
  }
  next();
};

module.exports = { addPostValidation, patchPostValidation };
