const UserModel = require("../models/user/user.model");

class UserController {
  // handle GET request
  static async user_list(req, res, next) {
    /* more logic here */
    try {
      const user = await UserModel.find();
      res.status(200).json(user);
    } catch (error) {
      next({ status: 500, message: "Invalid request!", error });
    }
  }

  // handle GET request base on ID
  static async user_get(req, res, next) {
    const { id } = req.params;
    /* more logic here */
    try {
      let user = await UserModel.findById(id);
      const tweets = await user.getAllTweets();
      const reTweets = await user.getAllreTweets();
      user = user.toJSON();
      user.tweets = tweets || [];
      user.reTweets = reTweets || [];
      if (!user) {
        next({ status: 404, message: "Not found.", error });
      }
      res.status(200).json(user);
    } catch (error) {
      next({ status: 500, message: "Invalid userId provided!", error });
    }
  }

  // handle POST request
  static async user_post(req, res, next) {
    /* more logic here */
    const data = req.body;
    // Validate request
    try {
      // Create a Todo
      const user = await UserModel.create(data);
      if (!user) {
        next({ status: 404, message: "Failed to create user.", error });
      }
      res.status(201).json(user);
    } catch (error) {
      next({ status: 500, message: "Invalid userId provided!", error });
    }
  }

  // handle DELETE request
  static async user_delete(req, res, next) {
    const { id } = req.params;
    /* more logic here */
    try {
      /* use another method here */
      const user = await UserModel.findOneAndDelete({ _id: id });
      if (!user) {
        next({ status: 404, message: "Not found.", error });
      }
      res.status(200).json({ deleted: user, msg: "success" });
    } catch (error) {
      next({ status: 500, message: "Invalid userId provided!", error });
    }
  }

  // handle PUT request
  static async user_put(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
      /* refactoring this */
      const user = await UserModel.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
      });
      if (!user) {
        next({ status: 400, message: "Invalid userId provided!", error });
      }
      res.status(200).json(user);
    } catch (error) {
      next({ status: 500, message: "Invalid userId provided!", error });
    }
  }

  // handle PATCH request
  static async user_patch(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
      /* refactoring this */
      const user = await UserModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
      if (!user) {
        next({ status: 400, message: "Invalid userId provided!", error });
      }
      res.status(200).json(user);
    } catch (error) {
      next({ status: 500, message: "Invalid userId provided!", error });
    }
  }
}

module.exports = UserController;
