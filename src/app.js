const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { PORT, DB_URI } = require("./config/config");
const userRoute = require("./routes/user/route");
const tweetRoute = require("./routes/tweet/route");
const errorHandler = require("./error/error");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// log using Morgan
app.use(morgan("dev"));

// connect to DB
const db_uri = DB_URI || "mongodb://localhost:27017/twitterDB";
mongoose.set("strictQuery", false);
mongoose.connect(db_uri);

// test db connection
const db = mongoose.connection;
db.once("open", (_) => {
    console.log("Database connected:", DB_URI);
});
db.on("error", (err) => {
    console.error("connection error:", err);
});

app.use("/tweet", tweetRoute);
app.use("/", userRoute);

app.all("/*", (req, res) => {
    res.send("Error 404");
});


// Error Handler Middleware
app.use(errorHandler);

// open port
const port = PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
