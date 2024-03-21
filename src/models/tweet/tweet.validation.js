const Joi = require("joi");

const tweetValidationSchema = Joi.object({
    text: Joi.string().trim().required().trim().min(2).max(150),
    userId: Joi.string().trim().required(),
    image: Joi.string().trim().allow(""),
    video: Joi.string().trim().allow(""),
});

module.exports = tweetValidationSchema
