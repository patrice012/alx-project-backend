const express = require("express");
const commentRoute = express.Router();
const validator = require("../middlewares/schemaValidation.middleware");
const commentValidationSchema = require("../models/comments/comment.validation");
const { authenticate } = require("../middlewares/auth.middleware");

const CommentController = require("../controllers/comment.controller");

// commentRoute.use(authenticate);

commentRoute.get("/", CommentController.comment_list);

commentRoute.get("/:id/", CommentController.comment_get);

commentRoute.post(
  "/",
  validator(commentValidationSchema),
  CommentController.comment_post
);

commentRoute.delete("/:id", CommentController.comment_delete);

commentRoute.put(
  "/:id",
  validator(commentValidationSchema),
  CommentController.comment_put
);

commentRoute.patch(
  "/:id",
  validator(commentValidationSchema),
  CommentController.comment_patch
);

module.exports = commentRoute;
