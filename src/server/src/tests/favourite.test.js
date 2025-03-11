const request = require("supertest");
const bcrypt = require("bcrypt");
const { app } = require("../server");
const { User } = require("../models/UserModel");

require("./setupTestDB");

describe("Favourite API Endpoints", () => {
  let userToken, userId, petId;

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

    // Create a pet
    const createPetResponse = await request(app)
      .post("/api/admin/pets")
      .set("Authorization", adminToken)
      .send({
        name: "Favourite Buddy",
        animalType: "Dog",
        age: 3,
        activityLevel: "High",
        status: "Available",
        description: "A playful favourite dog.",
        location: "Sydney",
      });

    petId = createPetResponse.body._id;
  });

  test("should add a pet to favourites", async () => {
    const response = await request(app)
      .post(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Pet added to favourites");
    expect(response.body.favourites).toContain(petId);
  });

  test("should remove a pet from favourites", async () => {
    // First, add the pet to favourites
    await request(app)
      .post(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    // Now, remove it from favourites
    const response = await request(app)
      .delete(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Pet removed from favourites");
    expect(response.body.favourites).not.toContain(petId);
  });

  test("should get all favourite pets", async () => {
    // First, add a pet to favourites
    await request(app)
      .post(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    // Fetch favourite pets
    const response = await request(app)
      .get("/api/user/favourites")
      .set("Authorization", userToken);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.favourites)).toBe(true);
    expect(response.body.favourites.length).toBe(1);
    expect(response.body.favourites[0]._id).toBe(petId);
  });

  test("should return an error when trying to favourite a non-existent pet", async () => {
    const fakePetId = "605c72d7bcf86cd799439011"; // Random valid ObjectId

    const response = await request(app)
      .post(`/api/user/favourites/${fakePetId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Pet not found");
  });

  test("should return an error when trying to unfavourite a non-existent pet", async () => {
    const fakePetId = "605c72d7bcf86cd799439012"; // Random valid ObjectId

    const response = await request(app)
      .delete(`/api/user/favourites/${fakePetId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Pet not found");
  });

  test("should prevent duplicate favouriting of a pet", async () => {
    await request(app)
      .post(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    const duplicateResponse = await request(app)
      .post(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.success).toBe(false);
    expect(duplicateResponse.body.message).toBe("Pet is already in favourites");
  });

  test("should return an error when trying to unfavourite a pet not in favourites", async () => {
    const response = await request(app)
      .delete(`/api/user/favourites/${petId}`)
      .set("Authorization", userToken);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Pet is not in favourites");
  });
});
