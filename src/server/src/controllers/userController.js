const { User } = require("../models/UserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");



async function registerUser(request, response) {
  const { name, password, email } = request.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    response.status(400).json({
      message: "Email address already in use.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    password: hashedPassword,
    email,
  });

  response.status(201).json({
    message: "User registered successfully.",
  });
}

async function loginUser(request, response) {
  const { email, password } = request.body;

  const user = await User.findOne({ email });
  if (!user) {
    return response.status(400).json({
      message: "User with that email does not exist.",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return response.status(400).json({
      message: "Invalid Password.",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  response.json({ token });
}

// Update user details function required

module.exports = {
  registerUser,
  loginUser,
};
