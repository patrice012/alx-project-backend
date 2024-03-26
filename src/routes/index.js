const userRoute = require("./user.routes");
const tweetRoute = require("./tweet.routes");
const authRoutes = require("./auth.routes");

const express = require("express");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/tweet", tweetRoute);
router.use("/", userRoute);

module.exports = router;
