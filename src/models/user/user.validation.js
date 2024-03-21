const Joi = require("joi");

const userValidationSchema = Joi.object({
    username: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
});

module.exports = userValidationSchema;
