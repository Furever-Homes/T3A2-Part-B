const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

// Setup in-memory MongoDB before all test cases
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create(); // create an in-memory MongoDB instance
  const mongoUri = mongoServer.getUri(); // creates a unique connection for in-memory MongoDB instance

  await mongoose.connect(mongoUri); // create connection
});

// Cleanup after tests
afterEach(async () => {
  const collections = mongoose.connection.collections; // Grabs all collections in the DB
  for (const key in collections) { // For each document in each collection
    await collections[key].deleteMany(); // Delete all documents
  }
});

// Close the database after all tests are done
afterAll(async () => {
  await mongoose.connection.close(); // Close connection 
  await mongoServer.stop(); // Stop the in-memory MongoDB instance
});