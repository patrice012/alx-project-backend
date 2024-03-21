const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentModel = require("../comments/comment.model");
const Retweet = require("../retweet/reTweet.model");

const TweetSchema = Schema(
  {
    text: {
      type: String,
      trim: true,
      require: true,
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
    userId: {
      type: mongoose.ObjectId,
      ref: "User",
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

TweetSchema.methods.getComments = async function () {
  const tweet = this;
  const comments = await CommentModel.find({ tweetId: tweet._id })
    .populate("userId", "-__v")
    .lean(true);
  return comments;
};

TweetSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

/* delete all related comments, retweets */
TweetSchema.post("findOneAndDelete", async function () {
  const filter = { tweetId: this.getQuery()["_id"].toString() };
  const comments = await CommentModel.deleteMany(filter);
  const retweets = await Retweet.deleteMany(filter);
  console.log(comments, retweets);
});

module.exports = mongoose.model("Tweet", TweetSchema);
