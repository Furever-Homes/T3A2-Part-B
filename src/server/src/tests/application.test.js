const request = require("supertest");
const bcrypt = require("bcrypt");
const { app } = require("../server");
const { User } = require("../models/UserModel");
const { Pet } = require("../models/PetModel");
const { Application } = require("../models/ApplicationModel");

require("./setupTestDB");

describe("Pet Application API Endpoints", () => {
  let adminToken, userToken, petId, userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Application.deleteMany({});

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

    userId = adminUser._id;
    console.log(userId)

    // Create a pet
    const pet = await Pet.create({
      name: "Test Pet",
      animalType: "Cat",
      age: 3,
      activityLevel: "Medium",
      location: "Melbourne",
    });

    petId = pet._id.toString(); // Ensure it's in string format
    console.log("🚀 Created Pet ID:", petId); // Debugging

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
    const res = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I love this pet and would like to adopt!" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("application");
    expect(res.body.application.pet).toBe(petId.toString());
    expect(res.body.application.user).toBe(userId.toString());
    expect(res.body.application.message).toBe("I love this pet and would like to adopt!");

    // Check if application is in database
    const application = await Application.findOne({ user: userId, pet: petId });
    expect(application).not.toBeNull();
    expect(application.message).toBe("I love this pet and would like to adopt!");
  });

  test("should not allow duplicate applications for the same pet", async () => {
    await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I love this pet and would like to adopt!" });

    const res = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "Trying to apply again" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("You have already submitted an application for this pet");
  });

});
