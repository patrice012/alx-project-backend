const Joi = require("joi");

const commentValidationSchema = Joi.object({
    text: Joi.string().trim().required().min(2).max(100),
    userId: Joi.string().trim().required(),
    tweetId: Joi.string().trim().required(),
});

module.exports = commentValidationSchema;
