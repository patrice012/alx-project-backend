const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user/user.model");
const { ACCESS_TOKEN, RESET_PASSWORD_TOKEN } = require("../config/config");

const REFRESH_TOKEN = {
  // ...
  cookie: {
    name: "refreshToken",
    options: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  },
};

class AuthController {
  // Register a new user
  static async register(req, res, next) {
    const { username, email, password } = req.body;

    try {
      const user = await UserModel.create({
        username,
        email,
        password: password,
      });
      const accessToken = await user.generateAcessToken(); // Create Access Token
      const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

      // SET refresh Token cookie in response
      res.cookie(
        REFRESH_TOKEN.cookie.name,
        refreshToken,
        REFRESH_TOKEN.cookie.options
      );
      // Send Response on successful Sign Up
      res.status(201).json({
        success: true,
        user: user,
        accessToken,
      });
      // res.json({ message: "Registration successful", user });
    } catch (error) {
      next(error);
    }
  }

  // Login with an existing user
  static async login(req, res, next) {
    const { username, password } = req.body;

    try {
      // Identify and retrieve user by credentials
      const user = await UserModel.findByCredentials(username, password);
      const accessToken = await user.generateAcessToken(); // Create Access Token
      const refreshToken = await user.generateRefreshToken(); // Create Refresh Token
      // SET refresh Token cookie in response
      res.cookie(
        REFRESH_TOKEN.cookie.name,
        refreshToken,
        REFRESH_TOKEN.cookie.options
      );
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      // Authenticated user ID attached on `req` by authentication middleware
      const userId = req.params.id;
      const user = await UserModel.findById(userId);

      const cookies = req.cookies;
      const authHeader = req.header("Authorization");
      const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
      // Create a access token hash
      const refreshTokenHash = crypto
        .createHmac("sha256", REFRESH_TOKEN.secret)
        .update(refreshToken)
        .digest("hex");
      user.tokens = user.tokens.filter(
        (tokenObj) => tokenObj.token !== refreshTokenHash
      );
      await user.save();

      // Set cookie expiry to past date so it is destroyed
      const expireCookieOptions = Object.assign(
        {},
        REFRESH_TOKEN.cookie.options,
        {
          expires: new Date(1),
        }
      );

      // Destroy refresh token cookie
      res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
      res.status(205).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async logoutAllDevices(req, res, next) {
    try {
      // Authenticated user ID attached on `req` by authentication middleware
      const userId = req.userId;
      const user = await UserModel.findById(userId);

      user.tokens = undefined;
      await user.save();

      // Set cookie expiry to past date to mark for destruction
      const expireCookieOptions = Object.assign(
        {},
        REFRESH_TOKEN.cookie.options,
        {
          expires: new Date(1),
        }
      );

      // Destroy refresh token cookie
      res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
      res.status(205).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async refreshAccessToken(req, res, next) {
    try {
      const cookies = req.cookies;
      const authHeader = req.header("Authorization");

      if (!cookies[REFRESH_TOKEN.cookie.name]) {
        throw new Error("Authentication error! You are unauthenticated");
      }
      if (!authHeader?.startsWith("Bearer ")) {
        throw new Error("Authentication error! You are unauthenticated");
      }

      const accessTokenParts = authHeader.split(" ");
      const staleAccessTkn = accessTokenParts[1];

      const decodedExpiredAccessTkn = jwt.verify(
        staleAccessTkn,
        ACCESS_TOKEN.secret,
        {
          ignoreExpiration: true,
        }
      );

      const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
      const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret);

      const userWithRefreshTkn = await User.findOne({
        _id: decodedRefreshTkn._id,
        "tokens.token": staleAccessTkn,
      });
      if (!userWithRefreshTkn) {
        throw new Error("Authentication error! You are unauthenticated");
      }
      // Delete the stale access token
      console.log("Removing Stale access tkn from DB in refresh handler...");
      userWithRefreshTkn.tokens = userWithRefreshTkn.tokens.filter(
        (tokenObj) => tokenObj.token !== staleAccessTkn
      );
      await userWithRefreshTkn.save();
      console.log("...Tkn removED!");

      // GENERATE NEW ACCESSTOKEN
      const accessToken = await userWithRefreshTkn.generateAcessToken();

      // Send back new created accessToken
      res.status(201);
      res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });
      res.json({
        success: true,
        accessToken,
      });
    } catch (error) {
      console.log(error);
      if (error?.name === "JsonWebTokenError") {
        return next(
          new AuthorizationError(error, "You are unauthenticated", {
            realm: "reauth",
            error_description: "token error",
          })
        );
      }
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError(errors.array(), 422);
      }

      const email = req.body.email;

      const user = await User.findOne({ email });
      if (!user) throw new CustomError("Email not sent", 404);

      let resetToken = await user.generateResetToken();
      resetToken = encodeURIComponent(resetToken);

      const resetPath = req.header("X-reset-base");
      const origin = req.header("Origin");

      const resetUrl = resetPath
        ? `${resetPath}/${resetToken}`
        : `${origin}/resetpass/${resetToken}`;
      console.log("Password reset URL: %s", resetUrl);

      const message = `
                <h1>You have requested to change your password</h1>
                <p>You are receiving this because someone(hopefully you) has requested to reset password for your account.<br/>
                  Please click on the following link, or paste in your browser to complete the password reset.
                </p>
                <p>
                  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
                </p>
                <p>
                  <em>
                    If you did not request this, you can safely ignore this email and your password will remain unchanged.
                  </em>
                </p>
                <p>
                <strong>DO NOT share this link with anyone else!</strong><br />
                  <small>
                    <em>
                      This password reset link will <strong>expire after ${
                        RESET_PASSWORD_TOKEN.expiry || 5
                      } minutes.</strong>
                    </em>
                  <small/>
                </p>
            `;

      try {
        await sendEmail({
          to: user.email,
          html: message,
          subject: "Reset password",
        });

        res.json({
          message:
            "An email has been sent to your email address. Check your email, and visit the link to reset your password",
          success: true,
        });
      } catch (error) {
        user.resetpasswordtoken = undefined;
        user.resetpasswordtokenexpiry = undefined;
        await user.save();

        console.log(error.message);
        throw new CustomError("Email not sent", 500);
      }
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      console.log("req.params: ", req.params);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError(errors.array(), 422);
      }

      const resetToken = new String(req.params.resetToken);

      const [tokenValue, tokenSecret] =
        decodeURIComponent(resetToken).split("+");

      console.log({ tokenValue, tokenSecret });

      // Recreate the reset Token hash
      const resetTokenHash = crypto
        .createHmac("sha256", tokenSecret)
        .update(tokenValue)
        .digest("hex");

      const user = await User.findOne({
        resetpasswordtoken: resetTokenHash,
        resetpasswordtokenexpiry: { $gt: Date.now() },
      });
      if (!user) throw new CustomError("The reset link is invalid", 400);
      console.log(user);

      user.password = req.body.password;
      user.resetpasswordtoken = undefined;
      user.resetpasswordtokenexpiry = undefined;

      await user.save();

      // Email to notify owner of the account
      const message = `<h3>This is a confirmation that you have changed Password for your account.</h3>`;
      // No need to await
      sendEmail({
        to: user.email,
        html: message,
        subject: "Password changed",
      });

      res.json({
        message: "Password reset successful",
        success: true,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
