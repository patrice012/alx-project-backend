const express = require("express");
const userRoute = express.Router({ strict: true });
const retweetRoute = require("./retweetRoute");
const validator = require("../middlewares/validationMiddleware");
const userValidationSchema = require("../models/user/userValidation");
const { authenticate } = require("../middlewares/auth");

const {
    user_post,
    user_list,
    user_get,
    user_delete,
    user_put,
    user_patch,
} = require("../controllers/user");

const bindUserIdToRequest = (req, res, next) => {
    req.userId = req.params.id;
    next();
};

userRoute.use("/:id/retweet", bindUserIdToRequest, retweetRoute);

userRoute.get("/", user_list);

userRoute.get("/:id", user_get);

userRoute.post("/", validator(userValidationSchema), user_post);

userRoute.delete("/:id",authenticate, user_delete);

userRoute.put("/:id", validator(userValidationSchema), user_put);

userRoute.patch("/:id", validator(userValidationSchema), user_patch);

module.exports = userRoute;
