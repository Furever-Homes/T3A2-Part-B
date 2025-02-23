const { app } = require("./server.js");
const { dbConnect } = require("./utils/database.js");

require("dotenv").config()

// GET the PORT
const PORT = process.env.PORT || 8008;

app.listen (PORT, async() => {
    // Server is running at this point
    await dbConnect();

    console.log("Server is running on port: " + PORT);
});