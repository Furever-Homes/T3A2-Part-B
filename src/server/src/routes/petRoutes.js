const express = require("express");
const { getAllPets } = require("../controllers/petController");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Use the validateToken middleware on this route
router.use(validateToken);

// GET localhost:5000/api/posts/
router.get("/" ,getAllPets);

module.exports = router;
