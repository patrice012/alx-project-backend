const Joi = require("joi");

const reTweetValidationSchema = Joi.object({
    text: Joi.string().trim().trim().allow("").min(2).max(150),
    userId: Joi.string().trim().required(),
    tweetId: Joi.string().trim().required(),
});

module.exports = reTweetValidationSchema;
