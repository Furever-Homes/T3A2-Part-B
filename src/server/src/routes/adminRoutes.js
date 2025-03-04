const express = require("express");

const { createPet, updatePet, deletePet } = require("../controllers/petController");
const { getAllApplications, approveApplication, rejectApplication, deleteApplicationByAdmin } = require("../controllers/applicationController");
const { validateToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/adminMiddleware");
validateToken

const router = express.Router();


// Apply authentication & admin check
router.use(validateToken);
router.use(checkAdmin);

// Manage pets "/api/admin"
router.post("/pets", createPet); // Add a new pet
router.put("/pets/:id", updatePet); // Edit pet details
router.delete("/pets/:id", deletePet); // Remove a pet

// Application routes "/api/admin"
router.get("/applications", getAllApplications);
router.put("/applications/:applicationId/approve", approveApplication)
router.put("/applications/:applicationId/reject", rejectApplication)
router.delete("/applications/:applicationId", deleteApplicationByAdmin);


module.exports = router;





