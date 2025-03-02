const express = require("express");
const { getAllApplications, approveApplication, rejectApplication, deleteApplicationByAdmin } = require("../controllers/applicationController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const { validateToken } = require("../middlewares/authMiddleware");
validateToken
const router = express.Router();

router.use(validateToken);
router.use(adminMiddleware);


router.get("/applications", validateToken, adminMiddleware,  getAllApplications);
router.put("/applications/:applicationId/approve", validateToken, adminMiddleware, approveApplication)
router.put("/applications/:applicationId/reject", validateToken, adminMiddleware, rejectApplication)
router.delete("/applications/:applicationId", validateToken, adminMiddleware, deleteApplicationByAdmin);


module.exports = router;