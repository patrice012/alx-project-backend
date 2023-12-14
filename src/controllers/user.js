const UserModel = require("../models/user/userModels");

// handle GET request
const user_list = async (req, res) => {
    /* more logic here */
    try {
        const user = await UserModel.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// handle GET request base on ID
const user_get = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).send("Invalid userId provided!");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// handle POST request
const user_post = async (req, res) => {
    /* more logic here */
    const data = req.body;
    // Validate request
    try {
        // Create a Todo
        const user = await UserModel.create(data);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// handle DELETE request
const user_delete = async (req, res) => {
    const { id } = req.params;
    /* more logic here */
    try {
        /* use another method here */
        const user = await UserModel.findOneAndDelete(id);
        if (!user) {
            return res.status(400).send("Invalid userId provided!");
        }
        res.status(200).json({ deleted: user, msg: "success" });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// handle PUT request
const user_put = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const user = await UserModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!user) {
            return res.status(400).send("Invalid userId provided!");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// handle PATCH request
const user_patch = async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const user = await UserModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!user) {
            return res.status(400).send("Invalid userId provided!");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    user_list,
    user_get,
    user_post,
    user_delete,
    user_put,
    user_patch,
};
