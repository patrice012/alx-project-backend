const Joi = require("joi");

const userValidationSchema = Joi.object({
    username: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
});

const userPutValidationSchema = Joi.object({
    username: Joi.string().min(2).max(50),
    email: Joi.string().email(),
});

module.exports = userValidationSchema;
