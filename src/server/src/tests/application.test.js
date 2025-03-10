const request = require("supertest");
const bcrypt = require("bcrypt");
const { app } = require("../server");
const { User } = require("../models/UserModel");
const { Pet } = require("../models/PetModel");
const { Application } = require("../models/ApplicationModel");

require("./setupTestDB");

describe("Pet Application API Endpoints", () => {
  let adminToken, userToken, petId, userId, adminUserId;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    // Create an admin user
    const adminUser = await User.create({
      name: "Test Admin User",
      email: "admintest@example.com",
      password: hashedPassword,
      admin: true,
    });

    // Create a test user
    const testUser = await User.create({
      name: "Test User",
      email: "usertest@example.com",
      password: hashedPassword,
      admin: false,
    });

    adminUserId = adminUser._id;
    userId = testUser._id;

    // Log in as the admin to get a valid token
    const adminLoginResponse = await request(app)
      .post("/api/login")
      .send({ email: "admintest@example.com", password: "testpassword" });

    adminToken = `Bearer ${adminLoginResponse.body.token}`;

    // Log in as the test user to get a user token
    const userLoginResponse = await request(app)
      .post("/api/login")
      .send({ email: "usertest@example.com", password: "testpassword" });

    userToken = `Bearer ${userLoginResponse.body.token}`;
  });

  test("should submit an application", async () => {
    // Create a pet
    const createPetResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "ApplicationBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful application dog.",
        location: "Sydney",
      });

    const petId = createPetResponse.body._id

    // Apply for the pet
    const applicationResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I love this pet and would like to adopt!" });

    expect(applicationResponse.status).toBe(201);
    expect(applicationResponse.body).toHaveProperty("application");
    expect(applicationResponse.body.application.pet).toBe(petId);
    expect(applicationResponse.body.application.user).toBe(userId.toString());
    expect(applicationResponse.body.application.message).toBe("I love this pet and would like to adopt!");

    // Check if application is in database
    const checkResponse = await Application.findOne({ user: userId, pet: petId });
    expect(checkResponse).not.toBeNull();
    expect(checkResponse.message).toBe("I love this pet and would like to adopt!");
  });

  test("should not allow duplicate applications for the same pet", async () => {
    // Create a pet
    const createPetResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "ApplicationBuddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful application dog.",
        location: "Sydney",
      });

    const petId = createPetResponse.body._id
    
    // Apply for the pet
    await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I love this pet and would like to adopt!" });

    const duplicateResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "Trying to apply again" });

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.message).toBe("You have already submitted an application for this pet");
  });

});
