const express = require("express");
const router = express.Router();
const { favouritePet, unFavouritePet, getFavourites } = require("../controllers/favouriteController");
const { validateToken } = require("../middlewares/authMiddleware");

// Routes requiring authentication
router.use(validateToken); // Apply authentication middleware

// Favouriting
router.post("/favourites/:petId", favouritePet); // Favourite a pet
router.delete("/favourites/:petId", unFavouritePet); // Unfavourite a pet
router.get("/favourites", getFavourites); // View user's favourited pets

module.exports = router;

