const express = require("express");
const tweetRoute = express.Router({ strict: true });
const commentRoute = require("./comment.routes");
const validator = require("../middlewares/schemaValidation.middleware");
const tweetValidationSchema = require("../models/tweet/tweet.validation");
const { authenticate } = require("../middlewares/auth.middleware");

const TweetController = require("../controllers/tweet.controller");

const bindTweetIdToRequest = (req, res, next) => {
  req.tweetId = req.params.id;
  next();
};

tweetRoute.use("/:id/comment", bindTweetIdToRequest, commentRoute);

tweetRoute.get("/", TweetController.tweet_list);

tweetRoute.get("/:id", TweetController.tweet_get);

// tweetRoute.use(authenticate);

tweetRoute.post(
  "/",
  validator(tweetValidationSchema),
  TweetController.tweet_post
);

tweetRoute.delete("/:id", tweet_delete);

tweetRoute.put(
  "/:id",
  validator(tweetValidationSchema),
  TweetController.tweet_put
);

tweetRoute.patch(
  "/:id",
  validator(tweetValidationSchema),
  TweetController.tweet_patch
);

module.exports = tweetRoute;
