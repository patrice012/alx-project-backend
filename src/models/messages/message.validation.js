const Joi = require("joi");

const messageValidationSchema = Joi.object({
  typeOf: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
  reactions: Joi.array(),
  senderId: Joi.string(),
  receiverId: Joi.string(),
});

module.exports = messageValidationSchema;
