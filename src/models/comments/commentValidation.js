const Joi = require("joi");

const reTweetValidationSchema = Joi.object({
    text: Joi.string().trim().required().min(2).max(100),
    userId: Joi.string().trim().required(),
    tweetId: Joi.string().trim().required(),
});

module.exports = reTweetValidationSchema;
