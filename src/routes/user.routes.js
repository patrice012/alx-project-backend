const express = require("express");
const userRoute = express.Router({ strict: true });
const retweetRoute = require("./retweet.routes");
const validator = require("../middlewares/schemaValidation.middleware");
const userValidationSchema = require("../models/user/user.validation");
const { authenticate } = require("../middlewares/auth.middleware");

const UserController = require("../controllers/user.controller");

const bindUserIdToRequest = (req, res, next) => {
  req.userId = req.params.id;
  next();
};

userRoute.use("/:id/retweet", bindUserIdToRequest, retweetRoute);

userRoute.get("/", user_list);

userRoute.post("/", validator(userValidationSchema), UserController.user_post);

// userRoute.use(authenticate);

userRoute.get("/:id", UserController.user_get);

userRoute.delete("/:id", UserController.user_delete);

userRoute.put("/:id", validator(userValidationSchema), UserController.user_put);

userRoute.patch(
  "/:id",
  validator(userValidationSchema),
  UserController.user_patch
);

module.exports = userRoute;
