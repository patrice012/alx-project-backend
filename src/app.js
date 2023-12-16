const express = require("express");
const morgan = require("morgan");
// const cors = require("cors");
const db = require("./config/db");
const { PORT } = require("./config/config");
const userRoute = require("./routes/userRoute");
const tweetRoute = require("./routes/tweetRoute");
const errorHandler = require("./error/error");

const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// log using Morgan
app.use(morgan("dev"));

// connect to DB
db.connect();

app.use("/tweet", tweetRoute);
app.use("/", userRoute);

app.all("/*", (req, res) => {
    res.status(404).json({ error: "invalid endpoint." });
});

// Error Handler Middleware
app.use(errorHandler);

// open port
const port = PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
