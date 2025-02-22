const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// app.verb(path, callback) - Test server connection;
app.get("/", (request, response) => {
    response.json({
        message: "Hello World!"
    });
});

module.exports = { app }