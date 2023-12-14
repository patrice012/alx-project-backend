const express = require("express");
const userRoute = express.Router({ strict: true });
// const validator = require("../middleware/validationMiddleware");
// const userValidationSchema = require("../models/user/userValidation");
const {
    user_post,
    user_list,
    user_get,
    user_delete,
    user_put,
    user_patch,
} = require("../controllers/user");

userRoute.get("/", user_list);

userRoute.get("/:id", user_get);

userRoute.post("/", user_post);

userRoute.delete("/:id", user_delete);

userRoute.put("/:id", user_put);

userRoute.patch("/:id", user_patch);

module.exports = userRoute;
