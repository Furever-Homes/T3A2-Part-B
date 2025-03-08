const { User } = require("../models/UserModel");
const cloudinary = require("../utils/cloudinaryConfig");
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
    const { name, email, password } = request.body;

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
      image: null,
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
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

    // If a new image is uploaded, replace in Cloudinary
    let newImage = request.file ? request.file.path : user.image;

    // If image is removed, reset to default
    if (request.body.image === "" || request.body.image === null) {
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

    // Remove profile image from Cloudinary if it's not the default
    if (user.image && !user.image.includes("default")) {
      const publicId = user.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`users/${publicId}`);
    }

    await User.findByIdAndDelete(request.user.id);
    response
      .status(200)
      .json({ message: "You have successfully deleted your account." });
  } catch (err) {
    response.status(500).json({ error: "Server error" });
  }
}

async function getUserProfile(request, response) {
  try {
      const user = await User.findById(request.user.id).select("-password");

      if (!user) {
          return response.status(404).json({ message: "User not found" });
      }

      response.status(200).json(user);
  } catch (error) {
      console.error("Error fetching user profile:", error.message);
      response.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUserProfile
};