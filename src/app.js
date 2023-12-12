const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { PORT } = require("../config/config");

const app = express();

// log using Morgan
app.use(morgan("dev"));

// open port
const port = PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
