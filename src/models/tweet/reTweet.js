const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const retweetSchema = Schema(
    {
        text: {
            type: String,
            minLength: [1, "Must be at least 1, got {VALUE}"],
            maxLength: [100, "Maximum value is 100, got {VALUE"],
        },
        userId: {
            type: mongoose.ObjectId,
            ref: "User",
        },
        tweetId: {
            type: mongoose.ObjectId,
            ref: "Tweet",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model("Retweet", retweetSchema);
