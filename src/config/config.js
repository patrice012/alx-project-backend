const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    DB_URI: process.env.DB_URI,
    PORT: process.env.PORT,
    API_KEY: process.env.API_KEY,
    NODE_ENV: process.env.NODE_ENV,
};
