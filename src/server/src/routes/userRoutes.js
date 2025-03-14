const express = require("express");

const {
  favouritePet,
  unFavouritePet,
  getFavourites,
} = require("../controllers/favouriteController");

const {
  submitApplication,
  getUserApplications,
  deleteUserApplication,
} = require("../controllers/applicationController");

const { updateUser, deleteUser, getUser, logout } = require("../controllers/userController");

const upload = require("../middlewares/uploadMiddleware");
const { validateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes requiring authentication
router.use(validateToken); // Apply authentication middleware

// Profile Routes "/api/user"
router.put("/profile", upload.single("image"), updateUser); // Route to update user details (with image upload)
router.delete("/profile", deleteUser); // Route to delete user profile
router.get("/profile", getUser); // Route to get logged in user details

// Application Routes "/api/user"
router.post("/applications/:petId", submitApplication);
router.get("/applications", getUserApplications);
router.delete("/applications/:applicationId", deleteUserApplication);

// Favouriting "/api/user"
router.post("/favourites/:petId", favouritePet); // Favourite a pet
router.delete("/favourites/:petId", unFavouritePet); // Unfavourite a pet
router.get("/favourites", getFavourites); // View user's favourited pets

// Logout Route "/api/user/logout"
router.post("/logout", logout);

module.exports = router;