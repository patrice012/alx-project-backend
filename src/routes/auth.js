const express = require("express");
const { register, login, logout } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/:id/logout", logout);

module.exports = authRouter;
