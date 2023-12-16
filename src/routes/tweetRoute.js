const express = require("express");
const tweetRoute = express.Router({ strict: true });
const commentRoute = require("../routes/commentRoute");
const validator = require("../middlewares/validationMiddleware");
const tweetValidationSchema = require("../models/tweet/tweetValidation");
const {
    tweet_delete,
    tweet_get,
    tweet_list,
    tweet_patch,
    tweet_post,
    tweet_put,
} = require("../controllers/tweet");

const bindTweetIdToRequest = (req, res, next) => {
    req.tweetId = req.params.id;
    next();
};

tweetRoute.use("/:id/comment", bindTweetIdToRequest, commentRoute);

tweetRoute.get("/", tweet_list);

tweetRoute.get("/:id", tweet_get);

tweetRoute.post("/", validator(tweetValidationSchema), tweet_post);

tweetRoute.delete("/:id", tweet_delete);

tweetRoute.put("/:id", validator(tweetValidationSchema), tweet_put);

tweetRoute.patch("/:id", validator(tweetValidationSchema), tweet_patch);

module.exports = tweetRoute;
