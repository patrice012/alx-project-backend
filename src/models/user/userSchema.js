const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentModel = require("../comments/comments");
const Tweet = require("../tweet/tweetModel");
const Profile = require("./profil");
const Retweet = require("../tweet/reTweet");

const validateEmail = function (v) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(v);
};

const UserSchema = Schema(
    {
        username: {
            type: String,
            trim: true,
            require: true,
            minLength: [2, "Must be at least 2, got {VALUE}"],
            maxLength: [50, "Maximum value is 50, got {VALUE"],
        },
        email: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,

            validate: {
                validator: validateEmail,
                message: (props) =>
                    `${props.value} is not a valid Email address!`,
            },
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

UserSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

/* delete all related comments, tweets and profile */
UserSchema.post("findOneAndDelete", async function () {
    const id = this.getQuery()["_id"].toString();
    const comments = await CommentModel.deleteMany({ userId: id });
    const retweets = await Retweet.deleteMany({ userId: id });
    const tweets = await Tweet.deleteMany({ userId: id });
    const profile = await Profile.deleteOne({ userId: id });
    console.log(comments, tweets, profile, retweets);
});

// create user related profile
UserSchema.post("save", async function () {
    const payload = {
        name: this.username,
        email: this.email,
        userId: this._id.toString(),
    };
    let profile = await Profile.findOne({
        userId: this._id.toString(),
    });
    if (!profile) {
        profile = await Profile.create(payload);
        console.log(profile, "profile");
    }
});

/* update profile information */
UserSchema.post("findOneAndUpdate", async function () {
    /* get user id */
    const id = this.getQuery()["_id"].toString();
    /* get updated fields */
    const updateValues = this.getUpdate()["$set"];
    let payload = { userId: id };
    let conditions = { userId: id };
    let options = { upsert: true, new: true };
    if (updateValues.username) payload["name"] = updateValues.username;
    if (updateValues.email) payload["email"] = updateValues.email;
    const profile = await Profile.findOneAndUpdate(
        conditions,
        payload,
        options
    );
    console.log(profile);
});

module.exports = UserSchema;
