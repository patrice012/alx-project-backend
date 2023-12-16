const Tweet = require("../models/tweet/tweetModel");
const CommentModel = require("../models/comments/comments");

// handle GET request
const tweet_list = async (req, res, next) => {
    /* more logic here */
    try {
        const tweet = await Tweet.find({})
            .populate("userId", "-__v")
            .lean(true);
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid request!", error });
    }
};

// handle GET request base on ID
const tweet_get = async (req, res, next) => {
    const { id } = req.params;
    /* more logic here */
    try {
        const tweet = await Tweet.findById(id)
            .populate("userId", "-__v")
            .lean(true);
        if (!tweet) {
            next({ status: 404, message: "Not found.", error });
        }
        /* get all comments if exists */
        comments = await CommentModel.find({ tweetId: id })
            .populate("userId", "-__v")
            .lean(true);
        if (comments) {
            tweet.comments = comments;
        }
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!", error });
    }
};

// handle POST request
const tweet_post = async (req, res, next) => {
    /* more logic here */
    const data = req.body;
    // Validate request
    try {
        // Create a Todo
        const tweet = await Tweet.create(data);
        if (!tweet) {
            next({ status: 404, message: "Failed to create tweet.", error });
        }
        res.status(201).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!", error });
    }
};

// handle DELETE request
const tweet_delete = async (req, res, next) => {
    const { id } = req.params;
    /* more logic here */
    try {
        /* use another method here */
        const tweet = await Tweet.findOneAndDelete({ _id: id });
        if (!tweet) {
            next({ status: 404, message: "Not found.", error });
        }
        res.status(200).json({ deleted: tweet, msg: "success" });
    } catch (error) {
        console.log(error, "from view");
        next({ status: 500, message: "Invalid tweetId provided!", error });
    }
};

// handle PUT request
const tweet_put = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const tweet = await Tweet.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!tweet) {
            next({ status: 400, message: "Invalid tweetId provided!", error });
        }
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!", error });
    }
};

// handle PATCH request
const tweet_patch = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const tweet = await Tweet.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!tweet) {
            next({ status: 400, message: "Invalid tweetId provided!", error });
        }
        res.status(200).json(tweet);
    } catch (error) {
        next({ status: 500, message: "Invalid tweetId provided!", error });
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
