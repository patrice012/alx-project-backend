const dotenv = require("dotenv");
dotenv.config();

const ACCESS_TOKEN = {
    secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
};
const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
};
const RESET_PASSWORD_TOKEN = {
    expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

const DB_URI = process.env.DB_URI;

const PORT = process.env.PORT;

const NODE_ENV = process.env.NODE_ENV;


const DOMAIN = process.env.DOMAIN;

module.exports = {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  RESET_PASSWORD_TOKEN,
  DB_URI,
  PORT,
  NODE_ENV,
  DOMAIN,
};
