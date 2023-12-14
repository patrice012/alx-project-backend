const Tweet = require("../models/tweet/tweetModel");

// handle GET request
const tweet_list = async (req, res) => {
    /* more logic here */
    const { id } = req.body;
    const tweets = await Tweet.find({ userId: id });
    console.log(tweets.user);
    res.json(tweets);
};

// handle GET request base on ID
const tweet_get = async (req, res) => {
    const { id } = req.params;
    console.log("wwww");
    res.send("hello from get");
    /* more logic here */
};

// handle POST request
const tweet_post = async (req, res) => {
    /* more logic here */
    const data = req.body;
    const tweet = await Tweet.create(data);
    res.json({ message: tweet });
};

// handle DELETE request
const tweet_delete = async (req, res) => {
    const { id } = req.params;
    console.log("wwww");
    res.send("hello");
    /* more logic here */
};

// handle PUT request
const tweet_put = async (req, res) => {
    const { id } = req.params;
    console.log("wwww", req);
    res.send("hello");
    /* more logic here */
};

// handle PATCH request
const tweet_patch = async (req, res) => {
    const { id } = req.params;
    console.log("wwww");
    res.send("hello");
    /* more logic here */
};

module.exports = {
    tweet_delete,
    tweet_get,
    tweet_list,
    tweet_patch,
    tweet_post,
    tweet_put,
};
