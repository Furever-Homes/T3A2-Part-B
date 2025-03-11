const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const guestRoutes = require("./routes/guestRoutes")
const userRoutes = require("./routes/userRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express();

app.use(helmet());

const corsOptions = {
    origin: [
      "http://localhost:5173", // Allow local frontend for testing
      // https://fureverhomes.com.au <-- insert URL for deployed frontend website here
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  };
  
app.use(cors(corsOptions));

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