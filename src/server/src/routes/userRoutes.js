const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const { submitApplication, getUserApplications } = require("../controllers/applicationController");

router.use(authMiddleware);


router.post("/applications/:petId", submitApplication);
router.get("/user", authMiddleware, getUserApplications)


router.delete("/applications/:applicationId", () => {
    console.log("delete an application screen")
});

module.exports = router;
