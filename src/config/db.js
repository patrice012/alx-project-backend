const mongoose = require("mongoose");
const { DB_URI } = require("./config");

// connect to DB using URI
const db_uri = DB_URI || "mongodb://localhost:27017/twitterDB";

// define some basic method connect / disconnect
const db = {
    connect(uri = undefined) {
        if (!uri) uri = db_uri;
        return mongoose.connect(uri);
    },

    disconnect() {
        return mongoose.connection.close(() => process.exit(0));
    },
};

mongoose.set("strictQuery", false);

// this  let mongoose use the node's default promises
mongoose.Promise = global.Promise;

// app logs
mongoose.connection.on("connected", () => {
    console.log("mongoose connection open to " + db_uri);
});

mongoose.connection.on("disconnected", () => {
    console.log("mongoose disconnected");
});

mongoose.connection.on("error", (error) => {
    console.log(error);
});

// handle process terminations
process.on("SIGINT", db.disconnect).on("SIGTERM", db.disconnect);

module.exports = db;
