const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user/userModels");
const { SECRET_KEY } = require("../config/config");

// Register a new user
const register = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = UserModel.create({
            username,
            email,
            password: password,
        });
        // await user.save();
        res.json({ message: "Registration successful" });
    } catch (error) {
        next(error);
    }
};

// Login with an existing user
const login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
            expiresIn: "1 hour",
        });
        res.json({ token });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
