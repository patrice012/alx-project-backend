const jwt = require("jsonwebtoken");
const UserModel = require("../models/user/user.model");
const { SECRET_KEY } = require("../config/config");

const authenticate = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    token = req.headers.bear;
  }
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const user = await UserModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate };
