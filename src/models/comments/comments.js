const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = Schema(
    {
        text: {
            type: String,
            trim: true,
            require: [true, "text is required"],
            minLength: [2, "Must be at least 2, got {VALUE}"],
            maxLength: [100, "Maximum value is 100, got {VALUE"],
        },
        userId: {
            type: mongoose.ObjectId,
            ref: "User",
            require: [true, "Comment's user can't be null"],
        },
        tweetId: {
            type: mongoose.ObjectId,
            ref: "Tweet",
            require: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

const CommentModel = mongoose.model("Comment", commentSchema);

module.exports = CommentModel;
