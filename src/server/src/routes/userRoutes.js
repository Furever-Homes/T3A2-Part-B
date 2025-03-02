const express = require("express");
const router = express.Router();
const { submitApplication, getUserApplications, deleteUserApplication } = require("../controllers/applicationController");
const { validateToken } = require("../middlewares/authMiddleware");

router.use(validateToken);


router.post("/applications/:petId", submitApplication);
router.get("/applications", validateToken, getUserApplications)
router.delete("/applications/:applicationId", validateToken, deleteUserApplication);

module.exports = router;

