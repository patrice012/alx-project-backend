const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const CommentModel = require("../comments/comments");
const Tweet = require("../tweet/tweetModel");
const Profile = require("./profile");
const Retweet = require("../tweet/reTweet");
const { ACCESS_TOKEN, REFRESH_TOKEN } = require("../../config/config");
const crypto = require("crypto");

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
            unique: true,
            trim: true,
            lowercase: true,

            validate: {
                validator: validateEmail,
                message: (props) =>
                    `${props.value} is not a valid Email address!`,
            },
        },
        password: {
            type: String,
            required: true,
        },
        tokens: [
            {
                token: { required: true, type: String },
            },
        ],
        resetpasswordtoken: String,
        resetpasswordtokenexpiry: Date,
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

/* Remove password and token in query results */
UserSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.tokens;
        return ret;
    },
});

/* ATTACH CUSTOM STATIC METHODS FOR AUTH */
// Compare the given password with the hashed password in the database
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.findByCredentials = async (username, password) => {
    const user = await UserModel.findOne({ username }); //email
    if (!user) throw new Error("User not found");
    const passwordMacthed = await user.comparePassword(password);
    if (!passwordMacthed) throw new Error("Incorrect password");
    return user;
};

UserSchema.methods.generateAcessToken = function () {
    const user = this;
    // Create signed access token
    const accessToken = jwt.sign({ userId: user._id }, ACCESS_TOKEN.secret, {
        expiresIn: ACCESS_TOKEN.expiry,
    });
    return accessToken;
};

UserSchema.methods.generateRefreshToken = async function () {
    const user = this;

    // Create signed refresh token
    const refreshToken = jwt.sign(
        {
            userId: user._id,
        },
        REFRESH_TOKEN.secret,
        {
            expiresIn: REFRESH_TOKEN.expiry,
        }
    );

    // Create a 'refresh token hash' from 'refresh token'
    const refreshTokenHash = crypto
        .createHmac("sha256", REFRESH_TOKEN.secret)
        .update(refreshToken)
        .digest("hex");
    // Save 'refresh token hash' to database
    user.tokens.push({ token: refreshTokenHash });
    await user.save();
    return refreshToken;
};

UserSchema.methods.generateResetToken = async function () {
    const resetTokenValue = crypto.randomBytes(20).toString("base64url");
    const resetTokenSecret = crypto.randomBytes(10).toString("hex");
    const user = this;
    // Separator of `+` because generated base64url characters doesn't include this character
    const resetToken = `${resetTokenValue}+${resetTokenSecret}`;
    // Create a hash
    const resetTokenHash = crypto
        .createHmac("sha256", resetTokenSecret)
        .update(resetTokenValue)
        .digest("hex");
    user.resetpasswordtoken = resetTokenHash;
    user.resetpasswordtokenexpiry =
        Date.now() + (RESET_PASSWORD_TOKEN.expiry || 5) * 60 * 1000; // Sets expiration age
    await user.save();
    return resetToken;
};

/* SOME HELPER FUNCTION */
UserSchema.methods.getAllTweets = async function () {
    const user = this;
    const tweets = await Tweet.find({ userId: user._id })
        .select("-__v")
        .lean(true);
    return tweets;
};

UserSchema.methods.getAllreTweets = async function () {
    const user = this;
    const retweets = await Retweet.find({ userId: user._id })
        .select("-__v")
        .populate("tweetId")
        .select("-__v")
        .lean(true);
    return retweets;
};

UserSchema.methods.getAllComments = async function () {
    const comments = await CommentModel.find({ userId: this._id })
        .select("-__v")
        .lean(true);
    return comments;
};

/* ATTACH SOME MIDDLEWARE FONCTION */
/* Change _id into id */
UserSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

UserSchema.pre("save", async function (next) {
    // this === user
    // Only run this function if password was moddified (not on other update functions)
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

/* delete all related comments, tweets and profile */
UserSchema.post("findOneAndDelete", async function () {
    const id = this.getQuery()["_id"].toString();
    const comments = await CommentModel.deleteMany({ userId: id });
    const retweets = await Retweet.deleteMany({ userId: id });
    const tweets = await Tweet.deleteMany({ userId: id });
    const profile = await Profile.deleteOne({ userId: id });
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
});

// module.exports = UserSchema;
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
