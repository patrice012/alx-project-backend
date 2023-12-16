const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = Schema(
    {
        name: {
            type: String,
            trim: true,
            require: [true, "profile name is required!"],
        },
        email: {
            type: String,
            trim: true,
            require: [true, "email is required!"],
        },
        location: {
            type: String,
            trim: true,
            minLength: [2, "Must be at least 2, got {VALUE}"],
            maxLength: [100, "Maximum value is 100, got {VALUE"],
        },
        bio: {
            type: String,
            trim: true,
            minLength: [2, "Must be at least 2, got {VALUE}"],
            maxLength: [250, "Maximum value is 250, got {VALUE"],
        },
        experience: {
            type: String,
            trim: true,
            minLength: [2, "Must be at least 2, got {VALUE}"],
            maxLength: [150, "Maximum value is 150, got {VALUE"],
        },
        coverPicture: {
            type: String,
            trim: true,
        },
        profilePicture: {
            type: String,
            trim: true,
        },
        userId: {
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

profileSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
