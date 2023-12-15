const express = require("express");
const tweetRoute = express.Router({ strict: true });

const {
    tweet_delete,
    tweet_get,
    tweet_list,
    tweet_patch,
    tweet_post,
    tweet_put,
} = require("../controllers/tweet");


tweetRoute.get("/", tweet_list);

tweetRoute.get("/:id", tweet_get);

tweetRoute.post("/", tweet_post);

tweetRoute.delete("/:id", tweet_delete);

tweetRoute.put("/:id", tweet_put);

tweetRoute.patch("/:id", tweet_patch);


module.exports = tweetRoute;
