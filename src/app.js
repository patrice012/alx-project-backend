const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { PORT, DB_URI } = require("../config/config");
const userRoute = require('../routes/user/route')

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
// body parsing
app.use(express.json());

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

app.use("/", userRoute);

// open port
const port = PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
