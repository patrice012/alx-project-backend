const Joi = require("joi");

const DiscussionValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  senderId: Joi.string(),
  receiverId: Joi.string(),
});

module.exports = DiscussionValidationSchema;
