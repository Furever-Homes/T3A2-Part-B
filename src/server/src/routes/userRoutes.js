const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { submitApplication, getUserApplications, deleteUserApplication } = require("../controllers/applicationController");

router.use(authMiddleware);


router.post("/applications/:petId", submitApplication);
router.get("/applications", authMiddleware, getUserApplications)
router.delete("/applications/:applicationId", authMiddleware, deleteUserApplication);

module.exports = router;
