const Retweet = require("../models/retweet/reTweet.model");

class RetweetController {
  // handle GET request
  // get all user retweets
  static async retweet_list(req, res, next) {
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
  }

  // handle GET request base on ID
  static async retweet_get(req, res, next) {
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
  }

  // handle POST request
  static async retweet_post(req, res, next) {
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
  }

  // handle DELETE request
  static async retweet_delete(req, res, next) {
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
  }

  // handle PUT request
  static async retweet_put(req, res, next) {
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
  }

  // handle PATCH request
  static async retweet_patch(req, res, next) {
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
  }
}

module.exports = RetweetController;
