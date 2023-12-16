const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require("../user/userModels");
// const UserSchema = require("../user/userSchema");
const CommentModel = require("../../models/comments/comments");

const TweetSchema = Schema(
    {
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
        others: { type: Schema.Types.Mixed },
        user: {
            type: mongoose.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

TweetSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

/* delete all related comments */
TweetSchema.post("findOneAndDelete", async function () {
    const filter = { tweetId: this.getQuery()['_id'].toString() };
    const comments = await CommentModel.deleteMany(filter);
    console.log(comments)
});

module.exports = mongoose.model("Tweet", TweetSchema);
