const express = require("express");
const tweetRoute = express.Router({ strict: true });
const commentRoute = require("../routes/commentRoute");

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

tweetRoute.post("/", tweet_post);

tweetRoute.delete("/:id", tweet_delete);

tweetRoute.put("/:id", tweet_put);

tweetRoute.patch("/:id", tweet_patch);

module.exports = tweetRoute;
