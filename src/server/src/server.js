const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const petRoutes = require("./routes/petRoutes")

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

app.use("/api/pets", petRoutes);

module.exports = { app }