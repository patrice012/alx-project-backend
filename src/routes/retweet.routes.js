const express = require("express");
const retweetRoute = express.Router();
const validator = require("../middlewares/schemaValidation.middleware");
const { authenticate } = require("../middlewares/auth.middleware");
const reTweetValidationSchema = require("../models/retweet/reTweet.validation");

const RetweetController = require("../controllers/retweet.controller");

retweetRoute.get("/", RetweetController.retweet_list);

retweetRoute.get("/:id", RetweetController.retweet_get);

retweetRoute.use(authenticate);

retweetRoute.post(
  "/",
  validator(reTweetValidationSchema),
  RetweetController.retweet_post
);

retweetRoute.delete("/:id", RetweetController.retweet_delete);

retweetRoute.put(
  "/:id",
  validator(reTweetValidationSchema),
  RetweetController.retweet_put
);

retweetRoute.patch(
  "/:id",
  validator(reTweetValidationSchema),
  RetweetController.retweet_patch
);

module.exports = retweetRoute;
