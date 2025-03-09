const request = require("supertest");
const bcrypt = require("bcrypt");
const { app } = require("../server");
const { User } = require("../models/UserModel");

require("./setupTestDB");

describe("Pet API Endpoints", () => {
  let adminToken;
  let petId;

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
  

});
