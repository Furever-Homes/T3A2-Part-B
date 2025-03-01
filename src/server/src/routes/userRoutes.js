const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/applications/:petId", () => {
    console.log("submit application screen")
});

router.get("/applications", () => {
    console.log("view all submitted applications screen")
});

router.delete("/applications/:applicationId", () => {
    console.log("delete an application screen")
});

module.exports = router;
