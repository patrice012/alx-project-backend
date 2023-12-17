const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user/userSchema");
// const { SECRET_KEY, TOKEN_EXPIRE_TIME } = require("../config/config");

// Register a new user
const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await UserModel.create({
            username,
            email,
            password: password,
        });
        res.json({ message: "Registration successful", user });
    } catch (error) {
        next(error);
    }
};

// Login with an existing user
const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findByCredentials(username, password);
        const token = await user.generateAcessToken();
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
