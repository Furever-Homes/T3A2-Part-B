const express = require("express");

const {
  createPet,
  updatePet,
  deletePet,
} = require("../controllers/petController");
const {
  getAllApplications,
  approveApplication,
  rejectApplication,
  deleteApplicationByAdmin,
} = require("../controllers/applicationController");
const { validateToken } = require("../middlewares/authMiddleware");
const { checkAdmin } = require("../middlewares/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Apply authentication & admin check
router.use(validateToken);
router.use(checkAdmin);

// Manage pets "/api/admin"
router.post("/pets", upload.single("image"), createPet); // Add a new pet
router.put("/pets/:petId", upload.single("image"), updatePet); // Edit pet details
router.delete("/pets/:petId", deletePet); // Remove a pet

// Application routes "/api/admin"
router.get("/applications", getAllApplications);
router.put("/applications/:applicationId/approve", approveApplication);
router.put("/applications/:applicationId/reject", rejectApplication);
router.delete("/applications/:applicationId", deleteApplicationByAdmin);

module.exports = router;