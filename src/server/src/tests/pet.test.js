const request = require("supertest");
const bcrypt = require("bcrypt");
const { app } = require("../server");
const { User } = require("../models/UserModel");

require("./setupTestDB");

describe("Pet API Endpoints", () => {
  let adminToken;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    // Create an admin user
    await User.create({
      name: "Test Admin User",
      email: "admintest@example.com",
      password: hashedPassword,
      admin: true,
    });

    // Log in as the admin to get a valid token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ email: "admintest@example.com", password: "testpassword" });

    adminToken = `Bearer ${loginResponse.body.token}`;
  });

  test("✅ should create a new pet", async () => {
    const response = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "TestBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    // Check if pet creation was successful
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("TestBuddy");
  });

  test("✅ should create and then delete a pet", async () => {
    // Create pet
    const createResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "DeleteTestBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    const petId = createResponse.body._id;

    // Delete the pet
    const deleteResponse = await request(app)
      .delete(`/api/admin/pets/${petId}`)
      .set("Authorization", adminToken);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Pet deleted successfully.");
  });

  test("✅ should create and then update pet details", async () => {
    // Create pet
    const createResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "UpdateTestBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    const petId = createResponse.body._id;

    // Update the pet location
    const updateResponse = await request(app)
      .put(`/api/admin/pets/${petId}`)
      .set("Authorization", adminToken)
      .send({
        location: "Melbourne",
      });
    console.log(updateResponse.body);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.location).toBe("Melbourne");
  });

  test("✅ should create 3x pets, then get all available pets (2x only)", async () => {
    // Create first pet (Available)
    await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "FirstBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    // Create second pet (Available)
    await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "SecondBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    // Create third pet (Adopted)
    await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "ThirdBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Adopted",
        description: "A playful test dog.",
        location: "Sydney",
      });

    // Get available pets from database
    const getResponse = await request(app)
      .get("/api/pets");

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.length).toBe(2); // Only 2x pets get returned
    getResponse.body.forEach((pet) => {
        expect(pet.status).toBe("Available"); // For each returned pet, status for each to be "Available"
    });
  });

  test("✅ should create a pet, then be able to fetch that pet by its ID", async () => {
    // Create pet
    const createResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "IDBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    const petId = createResponse.body._id;

    // Get available pets from database
    const getResponse = await request(app)
      .get(`/api/pets/${petId}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe("IDBuddy"); // To return recently created pet named "IDBuddy"
  });

  test("❌ should fail getting a pet", async () => {
    // Create pet to create valid petId
    const createResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "IDBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful test dog.",
        location: "Sydney",
      });

    const petId = createResponse.body._id;

    // Delete the pet
    await request(app)
      .delete(`/api/admin/pets/${petId}`)
      .set("Authorization", adminToken);

    // Fail getting pet from database using petId (since it has been deleted)
    const getResponse = await request(app)
      .get(`/api/pets/${petId}`);

    expect(getResponse.status).toBe(404);
    expect(getResponse.body.error).toBe("Pet not found");
  });
});
