const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require("../user/userModels");

const TweetSchema = new Schema({
    text: {
        type: String,
        trim: true,
        require: [true, "Input text is required"],
        minLength: [2, "Must be at least 2, got {VALUE}"],
        maxLength: [150, "Maximum value is 150, got {VALUE"],
    },
    image: {
        type: String,
    },
    Video: {
        type: String,
    },
    others: {
        type: Mix,
    },
    userId: mongoose.ObjectId,
});

TweetSchema.virtual(
    "user",
    {
        ref: "User",
        localField: "userId",
        foreignField: "_id",
        justOne: true,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

module.exports = mongoose.model("Tweet", TweetSchema);
