const express = require("express");
const retweetRoute = express.Router();
const validator = require("../middlewares/validationMiddleware");
const { authenticate } = require("../middlewares/auth");
const reTweetValidationSchema = require("../models/tweet/reTweetValidation");
const {
    retweet_list,
    retweet_get,
    retweet_post,
    retweet_delete,
    retweet_put,
    retweet_patch,
} = require("../controllers/retweet");

retweetRoute.get("/", retweet_list);

retweetRoute.get("/:id", retweet_get);

retweetRoute.use(authenticate);

retweetRoute.post("/", validator(reTweetValidationSchema), retweet_post);

retweetRoute.delete("/:id", retweet_delete);

retweetRoute.put("/:id", validator(reTweetValidationSchema), retweet_put);

retweetRoute.patch("/:id", validator(reTweetValidationSchema), retweet_patch);

module.exports = retweetRoute;
