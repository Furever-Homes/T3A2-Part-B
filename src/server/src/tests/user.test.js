const request = require("supertest");
const { app } = require("../server");
const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");

require("./setupTestDB");

describe("User API Endpoints", () => {
  let userToken;

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("testpassword", 10);

    // Create a test user
    await User.create({
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    });

    // Log in the user to get a valid token
    const loginResponse = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com", password: "testpassword" });

    userToken = `Bearer ${loginResponse.body.token}`;
  });

  test("✅ should register a new user", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        name: "New User",
        email: "newuser@example.com",
        password: "securepassword",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully.");
  });

  test("✅ should prevent duplicate user registration", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "securepassword",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email address already in use.");
  });

  test("✅ should allow user to log in", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        email: "test@example.com",
        password: "testpassword",
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("❌ should cause error, user with email doesn't exist", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({
        email: "doesntexist@example.com",
        password: "nopassword",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User with that email does not exist.");
  });

  test("✅ should fetch user profile", async () => {
    const response = await request(app)
      .get("/api/user/profile")
      .set("Authorization", userToken);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe("test@example.com");
  });

  test("✅ should update user profile", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", userToken)
      .send({ name: "Updated User" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated User");
  });

  test("✅ should delete user account", async () => {
    const response = await request(app)
      .delete("/api/user/profile")
      .set("Authorization", userToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You have successfully deleted your account.");
  });
});