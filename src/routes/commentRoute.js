const express = require("express");
const commentRoute = express.Router();
const validator = require("../middlewares/validationMiddleware");
const commentValidationSchema = require("../models/comments/commentValidation");
const { authenticate } = require("../middlewares/auth");

const {
    comment_delete,
    comment_get,
    comment_list,
    comment_patch,
    comment_post,
    comment_put,
} = require("../controllers/comment");

commentRoute.use(authenticate);

commentRoute.get("/", comment_list);

commentRoute.get("/:id/", comment_get);

commentRoute.post("/", validator(commentValidationSchema), comment_post);

commentRoute.delete("/:id", comment_delete);

commentRoute.put("/:id", validator(commentValidationSchema), comment_put);

commentRoute.patch("/:id", validator(commentValidationSchema), comment_patch);

module.exports = commentRoute;
