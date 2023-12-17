const UserModel = require("../models/user/userSchema");

// handle GET request
const user_list = async (req, res, next) => {
    /* more logic here */
    try {
        const user = await UserModel.find();
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, message: "Invalid request!", error });
    }
};

// handle GET request base on ID
const user_get = async (req, res, next) => {
    const { id } = req.params;
    /* more logic here */
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            next({ status: 404, message: "Not found." , error});
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, message: "Invalid userId provided!", error });
    }
};

// handle POST request
const user_post = async (req, res, next) => {
    /* more logic here */
    const data = req.body;
    // Validate request
    try {
        // Create a Todo
        const user = await UserModel.create(data);
        if (!user) {
            next({ status: 404, message: "Failed to create user." , error});
        }
        res.status(201).json(user);
    } catch (error) {
        next({ status: 500, message: "Invalid userId provided!", error });
    }
};

// handle DELETE request
const user_delete = async (req, res, next) => {
    const { id } = req.params;
    /* more logic here */
    try {
        /* use another method here */
        const user = await UserModel.findOneAndDelete({ _id: id });
        if (!user) {
            next({ status: 404, message: "Not found.", error });
        }
        res.status(200).json({ deleted: user, msg: "success" });
    } catch (error) {
        next({ status: 500, message: "Invalid userId provided!", error });
    }
};

// handle PUT request
const user_put = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const user = await UserModel.findByIdAndUpdate({ _id: id }, payload, {
            new: true,
        });
        if (!user) {
            next({ status: 400, message: "Invalid userId provided!", error });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, message: "Invalid userId provided!", error });
    }
};

// handle PATCH request
const user_patch = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const user = await UserModel.findByIdAndUpdate(id, payload, {
            new: true,
        });
        if (!user) {
            next({ status: 400, message: "Invalid userId provided!", error });
        }
        res.status(200).json(user);
    } catch (error) {
        next({ status: 500, message: "Invalid userId provided!", error });
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
