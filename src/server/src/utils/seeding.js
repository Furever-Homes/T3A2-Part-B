require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { dbConnect, dbDisconnect } = require("./database");
const { User } = require("../models/UserModel");
const { Pet } = require("../models/PetModel");
const { Application } = require("../models/ApplicationModel");

const PASSWORD = "abc123";

async function seed() {
  await dbConnect();
  console.log("Connected to the Database...");

  // Hash passwords
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

   // Create Users
   const user1 = new User({
    name: "John Doe",
    email: "johndoe@example.com",
    password: hashedPassword,
    image: null,
    admin: false,
    favourites: [],
  });

  const user2 = new User({
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: hashedPassword,
    image: null,
    admin: false,
    favourites: [],
  });

  const user3 = new User({
    name: "Alex Brown",
    email: "alexbrown@example.com",
    password: hashedPassword,
    image: null,
    admin: false,
    favourites: [],
  });

  const adminUser = new User({
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    image: null,
    admin: true,
    favourites: [],
  });

  await user1.save();
  await user2.save();
  await user3.save();
  await adminUser.save();
  console.log("Users seeded!");

  // Create Pets
  const pets = [
    new Pet({
      name: "Buddy",
      animalType: "Dog",
      age: 5,
      activityLevel: "High",
      status: "Available",
      description: "A friendly and energetic dog.",
      location: "Sydney",
      image: null,
    }),
    new Pet({
      name: "Mittens",
      animalType: "Cat",
      age: 3,
      activityLevel: "Medium",
      status: "Available",
      description: "A curious and playful kitten.",
      location: "Melbourne",
      image: null,
    }),
    new Pet({
      name: "Charlie",
      animalType: "Dog",
      age: 4,
      activityLevel: "High",
      status: "Available",
      description: "Loves to play fetch!",
      location: "Brisbane",
      image: null,
    }),
    new Pet({
      name: "Luna",
      animalType: "Cat",
      age: 2,
      activityLevel: "Low",
      status: "Available",
      description: "Enjoys sleeping all day.",
      location: "Perth",
      image: null,
    }),
    new Pet({
      name: "Max",
      animalType: "Dog",
      age: 3,
      activityLevel: "Medium",
      status: "Available",
      description: "Curious and energetic.",
      location: "Canberra",
      image: null,
    }),
    new Pet({
      name: "Oscar",
      animalType: "Cat",
      age: 5,
      activityLevel: "Medium",
      status: "Available",
      description: "A big fluffy cat!",
      location: "Melbourne",
      image: null,
    }),
    new Pet({
      name: "Rocky",
      animalType: "Dog",
      age: 4,
      activityLevel: "High",
      status: "Available",
      description: "Very protective.",
      location: "Perth",
      image: null,
    }),
    new Pet({
      name: "Daisy",
      animalType: "Cat",
      age: 3,
      activityLevel: "Low",
      status: "Available",
      description: "A sweet and gentle cat.",
      location: "Canberra",
      image: null,
    }),
    new Pet({
      name: "Slytherin",
      animalType: "Other",
      age: 2,
      activityLevel: "Low",
      status: "Available",
      description: "Loves to slide around!",
      location: "Sydney",
      image: null,
    }),
  ];

  await Pet.insertMany(pets);
  console.log("Pets seeded!");

  // Assign Favourites
  user1.favourites.push(pets[0]._id, pets[2]._id);
  user2.favourites.push(pets[1]._id, pets[4]._id);
  user3.favourites.push(pets[3]._id, pets[5]._id);

  await user1.save();
  await user2.save();
  await user3.save();
  console.log("User favorites updated!");

  // Create Adoption Applications
  const applications = [
    new Application({
      user: user1._id,
      pet: pets[0]._id,
      status: "Pending",
      message: "Looking for a playful companion!",
    }),
    new Application({
      user: user2._id,
      pet: pets[1]._id,
      status: "Approved",
      message: "Excited to adopt Mittens!",
    }),
    new Application({
      user: user3._id,
      pet: pets[3]._id,
      status: "Rejected",
      message: "Would love Luna in my home.",
    }),
    new Application({
      user: user1._id,
      pet: pets[5]._id,
      status: "Pending",
      message: "Bella would be a great fit for our family!",
    }),
    new Application({
      user: user2._id,
      pet: pets[7]._id,
      status: "Pending",
      message: "Would love to adopt Coco!",
    }),
  ];

  await Application.insertMany(applications);
  console.log("Applications seeded!");

  console.log("Seeding complete. Disconnecting...");
  await dbDisconnect();
  console.log("Disconnected from Database!");
}

// Run the seeding function
seed().catch((error) => {
  console.error("Error seeding database:", error);
  dbDisconnect();
});