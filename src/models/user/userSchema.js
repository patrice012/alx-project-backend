const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentModel = require("../comments/comments");
const Tweet = require("../tweet/tweetModel");

const validateEmail = function (v) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/.test(v);
};

const UserSchema = Schema(
    {
        username: {
            type: String,
            trim: true,
            require: [true, "username is required"],
            minLength: [2, "Must be at least 2, got {VALUE}"],
            maxLength: [50, "Maximum value is 50, got {VALUE"],
        },
        email: {
            type: String,
            require: [true, "email is required"],
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

UserSchema.post("findOneAndDelete", async function () {
    /* delete all related comments and tweets */
    const id = this.getQuery()["_id"].toString();
    const comments = await CommentModel.deleteMany({ userId: id });
    const tweets = await Tweet.deleteMany({ user: id });
    console.log(comments, tweets);
});



// UserSchema.post("findByIdAndUpdate", async function () {
//     /* delete all related comments and tweets */
//     const id = this.getQuery()["_id"].toString();
//     const comments = await CommentModel.updateMany({ userId: id }, {name:value});
//     const tweets = await Tweet.updateMany({ user: id }, { name: value });
//     console.log(comments, tweets);
// });

module.exports = UserSchema;
