require("dotenv").config();
const mongoose = require("mongoose");

// Function to connect to the DB
async function dbConnect() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is missing in .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(databaseUrl);
    console.log("✅ Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB Atlas: ", error);
    process.exit(1);
  }
}

async function dbDisconnect() {
  await mongoose.disconnect();
  console.log("🔌 Disconnected from database.");
}

async function dbDrop() {
  await mongoose.connection.db.dropDatabase();
  console.log("🗑️ Database dropped.");
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbDrop,
};
