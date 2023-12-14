const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
module.exports = UserSchema;