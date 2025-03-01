const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const guestRoutes = require("./routes/guestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

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

app.use("/api", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

module.exports = { app }