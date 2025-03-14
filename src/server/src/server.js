const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const guestRoutes = require("./routes/guestRoutes")
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express();

app.use(helmet());
app.use(express.json());

const corsOptions = {
    origin: [
      "http://localhost:5173", // Allow local frontend for testing
      "https://fureverhomes.netlify.app", // <-- For deployed frontend website
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };
  
app.use(cors(corsOptions));

// Test server connection;
app.get("/", (request, response) => {
    response.json({
        message: "Hello World!"
    });
});

app.use("/api", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

module.exports = { app }