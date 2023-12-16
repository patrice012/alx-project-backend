const Joi = require("joi");

const profileValidationSchema = Joi.object({
    userId: Joi.string().trim(),
    name: Joi.string().trim().min(2).max(150).when("userId", {
        is: Joi.exist(),
        then: Joi.required(),
    }),
    email: Joi.string().trim().email().when("userId", {
        is: Joi.exist(),
        then: Joi.required(),
    }),
    location: Joi.string().trim().allow("").min(2).max(100),
    bio: Joi.string().trim().allow("").min(2).max(250),
    experience: Joi.string().trim().allow("").min(2).max(150),
    coverPicture: Joi.string().trim().allow(""),
    profilePicture: Joi.string().trim().allow(""),
});

module.exports = profileValidationSchema;
