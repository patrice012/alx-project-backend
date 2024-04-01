const express = require("express");
const AuthController = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/check-identity", AuthController.verifyUser);

authRouter.post("/register", AuthController.register);

authRouter.post("/login", AuthController.login);

authRouter.get("/:id/logout", AuthController.logout);

module.exports = authRouter;
