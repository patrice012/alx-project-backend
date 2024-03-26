const Profile = require("../models/user/profile");

class ProfileController {
  // handle GET request base on ID
  static async profile_get(req, res, next) {
    const { id } = req.params;
    /* more logic here */
    try {
      const profile = await Profile.findById(id).populate("userId").lean(true);
      if (!profile) {
        next({ status: 404, message: "Not found.", error });
      }
      res.status(200).json(profile);
    } catch (error) {
      next({ status: 500, message: "Invalid profileId provided!", error });
    }
  }

  static async profile_put(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
      /* refactoring this */
      const profile = await Profile.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
      });
      if (!profile) {
        next({
          status: 400,
          message: "Invalid profileId provided!",
          error,
        });
      }
      res.status(200).json(profile);
    } catch (error) {
      next({ status: 500, message: "Invalid profileId provided!", error });
    }
  }

  static async profile_patch(req, res, next) {
    const { id } = req.params;
    const payload = req.body;
    /* more logic here */
    try {
      /* refactoring this */
      const profile = await Profile.findByIdAndUpdate({ _id: id }, payload, {
        new: true,
      });
      if (!profile) {
        next({
          status: 400,
          message: "Invalid profileId provided!",
          error,
        });
      }
      res.status(200).json(profile);
    } catch (error) {
      next({ status: 500, message: "Invalid profileId provided!", error });
    }
  }
}

module.exports = ProfileController;
