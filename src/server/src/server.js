const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const guestRoutes = require("./routes/guestRoutes")
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")

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

app.use("/api/pets", guestRoutes);
app.use("api/user", userRoutes);
app.use("api/admin", adminRoutes);

module.exports = { app }