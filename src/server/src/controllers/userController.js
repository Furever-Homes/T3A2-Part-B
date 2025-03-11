const { User } = require("../models/UserModel");

const cloudinary = require("../utils/cloudinaryConfig");
const { getCloudinaryPublicId } = require("../utils/cloudinaryPublicId");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Validation schema for updating user details
const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(5).optional(),
  image: Joi.string().allow(null, ""),
});

// Register a New User
async function registerUser(request, response) {
  try {
    const { name, email, password, admin } = request.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response
        .status(400)
        .json({ message: "Email address already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      admin,
    });

    await user.save();
    response.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

// Login User
async function loginUser(request, response) {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .json({ message: "User with that email does not exist." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({ message: "Invalid Password." });
    }

    const token = jwt.sign(
      { userId: user._id, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "4hr" }
    );

    response.json({ token });
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

// Update User Profile
async function updateUser(request, response) {
  try {
    // Grab user ID from validated JWT
    const user = await User.findById(request.authUserData.userId);

    const defaultUserImage = process.env.CLOUDINARY_DEFAULT_USER;

    let newImage = user.image; // Keep the existing image by default

    // If new image is uploaded
    if (request.file) {
      newImage = request.file.path; // Assign new file to newImage

      // Delete previous Cloudinary image if it's not a default one
      if (user.image && user.image !== defaultUserImage) {
        const publicId = getCloudinaryPublicId(user.image);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // If image is reset (image: "" or null)
    if (request.body.image === "" || request.body.image === null) {
      // Delete previous Cloudinary image if it's not a default one
      if (user.image && user.image !== defaultUserImage) {
        const publicId = getCloudinaryPublicId(user.image);
        await cloudinary.uploader.destroy(publicId);
      }
      newImage = process.env.CLOUDINARY_DEFAULT_USER;
    }

    // If password is being updated, hash it
    if (request.body.password) {
      request.body.password = await bcrypt.hash(request.body.password, 10);
    }

    Object.assign(user, request.body, { image: newImage });
    await user.save();
    response.status(200).json(user);
  } catch (err) {
    response.status(500).json({ error: "Server error" });
  }
}

// Delete User Profile
async function deleteUser(request, response) {
  try {
    const user = await User.findById(request.authUserData.userId);

    const defaultImage = process.env.CLOUDINARY_DEFAULT_USER;

    // If user image exists & it is not the default user image
    if (user.image && user.image !== defaultImage) {
      const publicId = getCloudinaryPublicId(user.image); // Extract user image from Cloudinary
      await cloudinary.uploader.destroy(publicId); // Delete user image from Cloudinary
    }

    await User.findByIdAndDelete(request.authUserData.userId);
    response
      .status(200)
      .json({ message: "You have successfully deleted your account." });
  } catch (err) {
    response.status(500).json({ error: "Server error" });
  }
}

async function getUser(request, response) {
  try {
    const user = await User.findById(request.authUserData.userId).select(
      "-password"
    );

    response.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    response.status(500).json({ message: "Server error" });
  }
}

async function logout(request, response) {
  try {
    response.status(200).json({ message: "You have logged out successfully." });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Logout failed", error: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  logout,
};
