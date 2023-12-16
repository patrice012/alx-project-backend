const Joi = require("joi");

const profileValidationSchema = Joi.object({
    userId: Joi.string(),
    name: Joi.string().min(2).max(150).when("userId", {
        is: Joi.exist(),
        then: Joi.required(),
    }),
    email: Joi.string().email().when("userId", {
        is: Joi.exist(),
        then: Joi.required(),
    }),
    location: Joi.string().allow("").min(2).max(100),
    bio: Joi.string().allow("").min(2).max(250),
    experience: Joi.string().allow("").min(2).max(150),
    coverPicture: Joi.string().allow(""),
    profilePicture: Joi.string().allow(""),
});

module.exports = profileValidationSchema;
