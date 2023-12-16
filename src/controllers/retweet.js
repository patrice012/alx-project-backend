const Retweet = require("../models/tweet/reTweet");

// handle GET request
// get all user retweets
const retweet_list = async (req, res, next) => {
    /* more logic here */
    const userId = req.userId;
    try {
        const retweet = await Retweet.find({ userId: userId })
            .populate("userId", "-__v")
            .populate("tweetId", "-__v")
            .lean(true);
        res.status(200).json(retweet);
    } catch (error) {
        next({ status: 500, message: "Invalid request!", error });
    }
};

// handle GET request base on ID
const retweet_get = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;
    /* more logic here */
    try {
        const retweet = await Retweet.find({
            _id: id,
            userId: userId,
        })
            .populate("tweetId", "-__v")
            .populate("userId", "-__v")
            .lean(true);
        if (!retweet) {
            next({ status: 404, message: "Not found.", error });
        }
        res.status(200).json(retweet);
    } catch (error) {
        console.log(error);
        next({ status: 500, message: "Invalid retweetId provided!", error });
    }
};

// handle POST request
const retweet_post = async (req, res, next) => {
    /* more logic here */
    const data = req.body;
    // Validate request
    try {
        // Create a Todo
        const retweet = await Retweet.create(data);
        if (!retweet) {
            next({ status: 404, message: "Failed to create retweet.", error });
        }
        res.status(201).json(retweet);
    } catch (error) {
        next({ status: 500, message: "Invalid retweetId provided!", error });
    }
};

// handle DELETE request
const retweet_delete = async (req, res, next) => {
    const { id } = req.params;
    /* more logic here */
    try {
        /* use another method here */
        const retweet = await Retweet.findOneAndDelete({ _id: id });
        if (!retweet) {
            next({ status: 404, message: "Not found.", error });
        }
        res.status(200).json({ deleted: retweet, msg: "success" });
    } catch (error) {
        next({ status: 500, message: "Invalid retweetId provided!", error });
    }
};

// handle PUT request
const retweet_put = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const retweet = await Retweet.findByIdAndUpdate({ _id: id }, payload, {
            new: true,
        });
        if (!retweet) {
            next({
                status: 400,
                message: "Invalid retweetId provided!",
                error,
            });
        }
        res.status(200).json(retweet);
    } catch (error) {
        next({ status: 500, message: "Invalid retweetId provided!", error });
    }
};

// handle PATCH request
const retweet_patch = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const retweet = await Retweet.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!retweet) {
            next({
                status: 400,
                message: "Invalid retweetId provided!",
                error,
            });
        }
        res.status(200).json(retweet);
    } catch (error) {
        next({ status: 500, message: "Invalid retweetId provided!", error });
    }
};

module.exports = {
    retweet_list,
    retweet_get,
    retweet_post,
    retweet_delete,
    retweet_put,
    retweet_patch,
};
