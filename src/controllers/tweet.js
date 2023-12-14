const Tweet = require("../models/tweet/tweetModel");

// handle GET request
const tweet_list = async (req, res, next) => {
    /* more logic here */
    try {
        const tweet = await Tweet.find();
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid request!" });
    }
};

// handle GET request base on ID
const tweet_get = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
    try {
        const tweet = await Tweet.findById(id);
        if (!tweet) {
            next({ status: 404, message: "Not found." });
        }
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!" });
    }
};

// handle POST request
const tweet_post = async (req, res) => {
    /* more logic here */
    const data = req.body;
    // Validate request
    try {
        // Create a Todo
        const tweet = await Tweet.create(data);
        if (!tweet) {
            next({ status: 404, message: "Failed to create tweet." });
        }
        res.status(201).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!" });
    }
};

// handle DELETE request
const tweet_delete = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
    try {
        /* use another method here */
        const tweet = await Tweet.findOneAndDelete(id);
        if (!tweet) {
            next({ status: 404, message: "Not found." });
        }
        res.status(200).json({ deleted: tweet, msg: "success" });
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!" });
    }
};

// handle PUT request
const tweet_put = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const tweet = await Tweet.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!tweet) {
            next({ status: 400, message: "Invalid tweetId provided!" });
        }
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!" });
    }
};

// handle PATCH request
const tweet_patch = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const tweet = await Tweet.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!tweet) {
            next({ status: 400, message: "Invalid tweetId provided!" });
        }
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!" });
    }
};

module.exports = {
    tweet_delete,
    tweet_get,
    tweet_list,
    tweet_patch,
    tweet_post,
    tweet_put,
};
