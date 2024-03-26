const CommentModel = require("../models/comments/comment.model");

class CommentController {
  static async comment_list(req, res, next) {
    /* more logic here */
    try {
      const tweetId = req.tweetId;
      const comments = await CommentModel.find({ tweetId: tweetId })
        .populate("userId", "-__v")
        .lean(true);
      res.status(200).json(comments);
    } catch (error) {
      next({ status: 500, message: "Invalid request!", error });
    }
  }

  static async comment_get(req, res, next) {
    const { id } = req.params;

    /* more logic here */
    try {
      const tweetId = req.tweetId;
      const comment = await CommentModel.findById({
        tweetId: tweetId,
        id: id,
      })
        .populate("userId", "-__v")
        .lean(true);
      if (!comment) {
        next({ status: 404, message: "Not found.", error });
      }
      res.status(200).json({ comment: comment });
    } catch (error) {
      next({ status: 500, message: "Invalid tweetId provided!", error });
    }
  }
  static async comment_post(req, res, next) {
    /* more logic here */
    const data = req.body;

    // Validate request
    try {
      // Create a Todo
      const tweetId = req.tweetId;
      const comment = await CommentModel.create(data);
      if (!comment) {
        next({ status: 404, message: "Failed to create tweet.", error });
      }
      res.status(201).json(comment);
    } catch (error) {
      next({ status: 500, message: "Invalid tweetId provided!", error });
    }
  }
  static async comment_delete(req, res, next) {
    const { id } = req.params;

    /* more logic here */
    try {
      /* use another method here */
      const tweetId = req.tweetId;
      const comment = await CommentModel.findOneAndDelete({
        id: id,
        tweetId: tweetId,
      });
      if (!comment) {
        next({ status: 404, message: "Not found.", error });
      }
      res.status(200).json({ deleted: comment, msg: "success" });
    } catch (error) {
      next({ status: 500, message: "Invalid tweetId provided!", error });
    }
  }
  static async comment_put(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
      /* refactoring this */
      const comment = await CommentModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
      if (!comment) {
        next({ status: 400, message: "Invalid tweetId provided!", error });
      }
      res.status(200).json(comment);
    } catch (error) {
      next({ status: 500, message: "Invalid tweetId provided!", error });
    }
  }

  static async comment_patch(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
      /* refactoring this */
      const comment = await CommentModel.findByIdAndUpdate(id, payload, {
        new: true,
      });
      if (!comment) {
        next({ status: 400, message: "Invalid tweetId provided!", error });
      }
      res.status(200).json(comment);
    } catch (error) {
      next({ status: 500, message: "Invalid tweetId provided!", error });
    }
  }
}

module.exports = CommentController;
