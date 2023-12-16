const Profile = require("../models/user/profile");

// handle GET request base on ID
const profile_get = async (req, res, next) => {
    const { id } = req.params;
    /* more logic here */
    try {
        const profile = await Profile.findById(id)
            .populate("userId")
            .lean(true);
        if (!profile) {
            next({ status: 404, message: "Not found." });
        }
        res.status(200).json(profile);
    } catch (error) {
        next({ status: 500, message: "Invalid profileId provided!" });
    }
};

const profile_put = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const profile = await Profile.findByIdAndUpdate({ _id: id }, payload, {
            new: true,
        });
        if (!profile) {
            next({ status: 400, message: "Invalid profileId provided!" });
        }
        res.status(200).json(profile);
    } catch (error) {
        next({ status: 500, message: "Invalid profileId provided!" });
    }
};

const profile_patch = async (req, res, next) => {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
        /* refactoring this */
        const profile = await Profile.findByIdAndUpdate({ _id: id }, payload, {
            new: true,
        });
        if (!profile) {
            next({ status: 400, message: "Invalid profileId provided!" });
        }
        res.status(200).json(profile);
    } catch (error) {
        next({ status: 500, message: "Invalid profileId provided!" });
    }
};

module.exports = { profile_get, profile_patch, profile_put };
