const express = require("express");
const commentRoute = express.Router();

const {
    comment_delete,
    comment_get,
    comment_list,
    comment_patch,
    comment_post,
    comment_put,
} = require("../controllers/comment");

commentRoute.get("/", comment_list);

commentRoute.get("/:id/", comment_get);

commentRoute.post("/", comment_post);

commentRoute.delete("/:id", comment_delete);

commentRoute.put("/:id", comment_put);

commentRoute.patch("/:id", comment_patch);

module.exports = commentRoute;
