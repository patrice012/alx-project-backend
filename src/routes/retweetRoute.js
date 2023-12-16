const express = require("express");
const retweetRoute = express.Router();

const {
    retweet_list,
    retweet_get,
    retweet_post,
    retweet_delete,
    retweet_put,
    retweet_patch,
} = require("../controllers/retweet");

retweetRoute.get("/", retweet_list);
retweetRoute.post("/", retweet_post);
retweetRoute.get("/:id", retweet_get);
retweetRoute.delete("/:id", retweet_delete);
retweetRoute.put("/:id", retweet_put);
retweetRoute.patch("/:id", retweet_patch);

module.exports = retweetRoute;
