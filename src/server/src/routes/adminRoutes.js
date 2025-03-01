const express = require("express");
const router = express.Router();
const { createPet,
    updatePet,
    deletePet
} = require("../controllers/petController");
const { validateToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/adminMiddleware");

// Apply authentication & admin check
router.use(validateToken);
router.use(checkAdmin);

// Manage pets
router.post("/pets", createPet); // Add a new pet
router.put("/pets/:id", updatePet); // Edit pet details
router.delete("/pets/:id", deletePet); // Remove a pet

// Manage applications

module.exports = router;
