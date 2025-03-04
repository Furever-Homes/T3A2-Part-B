const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { getAllPets, getPet } = require("../controllers/petController.js")

const router = express.Router();


// Public routes (no authentication required) "/api"
router.get("/pets", getAllPets); // View all pets
router.get("/pets/:id", getPet); // View a specific pet by ID
router.post("/register", registerUser); // User registration
router.post("/login", loginUser); // User login

module.exports = router;