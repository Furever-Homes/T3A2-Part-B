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

    petId = createPetResponse.body._id;
  });

  test("should submit an application", async () => {
    // Apply for the pet
    const applicationResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I love this pet and would like to adopt!" });

    expect(applicationResponse.status).toBe(201);
    expect(applicationResponse.body).toHaveProperty("application");
    expect(applicationResponse.body.application.pet).toBe(petId);
    expect(applicationResponse.body.application.user).toBe(userId.toString());
    expect(applicationResponse.body.application.message).toBe(
      "I love this pet and would like to adopt!"
    );

    // Check if application is in database
    const checkResponse = await Application.findOne({
      user: userId,
      pet: petId,
    });
    expect(checkResponse).not.toBeNull();
    expect(checkResponse.message).toBe(
      "I love this pet and would like to adopt!"
    );
  });

  test("should not allow duplicate applications for the same pet", async () => {
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
    expect(duplicateResponse.body.message).toBe(
      "You have already submitted an application for this pet"
    );
  });

  test("should fetch all user applications", async () => {
    // Create an application
    await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I want this pet!" });

    // Fetch user applications
    const response = await request(app)
      .get("/api/user/applications")
      .set("Authorization", userToken);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].pet._id).toBe(petId);
  });

  test("should fetch all applications as admin", async () => {
    // Create an application
    await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "Adopting!" });

    // Fetch all applications as admin
    const response = await request(app)
      .get("/api/admin/applications")
      .set("Authorization", adminToken);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);

    // Fetch applications as admin with query filter
    const queryRes = await request(app)
      .get("/api/admin/applications?location=Sydney&animalType=Dog")
      .set("Authorization", adminToken);

    expect(queryRes.status).toBe(200);
    expect(queryRes.body.length).toBe(1);
  });

  test("should approve an application", async () => {
    // Create an application
    const applicationResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "I want this pet!" });

    const applicationId = applicationResponse.body.application._id;

    // Approve the application
    const approveResponse = await request(app)
      .put(`/api/admin/applications/${applicationId}/approve`)
      .set("Authorization", adminToken);

    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.application.status).toBe("Approved");

    // Check if pet status changed
    const updatedPet = await Pet.findById(petId);
    expect(updatedPet.status).toBe("Adopted");
  });

  test(" should reject an application", async () => {
    // Create an application
    const applicationResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "Please let me adopt!" });

    const applicationId = applicationResponse.body.application._id;

    // Reject the application
    const rejectResponse = await request(app)
      .put(`/api/admin/applications/${applicationId}/reject`)
      .set("Authorization", adminToken);

    expect(rejectResponse.status).toBe(200);
    expect(rejectResponse.body.application.status).toBe("Rejected");

    // Attempt to process same application
    const duplicateResponse = await request(app)
      .put(`/api/admin/applications/${applicationId}/reject`)
      .set("Authorization", adminToken);

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.message).toBe(
      "Application has already been processed"
    );
  });

  test("should delete an application", async () => {
    // Create an application
    const applicationResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "Deleting this later!" });

    const applicationId = applicationResponse.body.application._id;

    // Delete the application
    const deleteResponse = await request(app)
      .delete(`/api/user/applications/${applicationId}`)
      .set("Authorization", userToken);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe(
      "Application deleted successfully"
    );

    // Check if application is removed
    const duplicateDeleteRes = await request(app)
      .delete(`/api/user/applications/${applicationId}`)
      .set("Authorization", userToken);

    expect(duplicateDeleteRes.status).toBe(404);
    expect(duplicateDeleteRes.body.message).toBe("Application not found");
  });

  test("should delete an application as admin", async () => {
    // Create an application
    const applicationResponse = await request(app)
      .post(`/api/user/applications/${petId}`)
      .set("Authorization", userToken)
      .send({ message: "Deleting this later!" });

    const applicationId = applicationResponse.body.application._id;

    // Delete the application
    const deleteResponse = await request(app)
      .delete(`/api/admin/applications/${applicationId}`)
      .set("Authorization", adminToken);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe(
      "Application deleted successfully by admin"
    );

    // Check if application is removed
    const duplicateDeleteRes = await request(app)
      .delete(`/api/admin/applications/${applicationId}`)
      .set("Authorization", adminToken);

    expect(duplicateDeleteRes.status).toBe(404);
    expect(duplicateDeleteRes.body.message).toBe("Application not found");
  });
});
