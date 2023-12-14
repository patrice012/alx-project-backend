const mongoose = require("mongoose");
const UserSchema = require("./userSchema");

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
