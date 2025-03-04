require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { dbConnect, dbDisconnect } = require("./database");
const { User } = require("../models/UserModel");
const { Pet } = require("../models/PetModel");

const PASSWORD = "abc123";


async function seed() {
    await dbConnect();
    console.log("Connected to the Database. Dropping existing data...");

    // Hash passwords
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    // Create Users
    const user1 = new User({
        name: "John Doe",
        email: "johndoe@example.com",
        password: hashedPassword,
        admin: false,
        favourites: []
    });

    const user2 = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        admin: true,
        favourites: []
    });

    await user1.save();
    await user2.save();
    console.log("Users seeded!");

    // Create Pets
    const pet1 = new Pet({
        name: "Buddy",
        animalType: "Dog",
        breed: "Golden Retriever",
        birthday: new Date(2019, 5, 15),
        activityLevel: "High",
        status: "Available",
        description: "A friendly and energetic dog.",
        location: "Sydney",
        image: "buddy.jpg"
    });

    const pet2 = new Pet({
        name: "Mittens",
        animalType: "Cat",
        breed: "Siamese",
        birthday: new Date(2021, 3, 22),
        activityLevel: "Medium",
        status: "Available",
        description: "A curious and playful kitten.",
        location: "Melbourne",
        image: "mittens.jpg"
    });

    await pet1.save();
    await pet2.save();
    console.log("Pets seeded!");

    // Assign Favourites
    user1.favourites.push(pet1._id);
    await user1.save();
    console.log("User favorites updated!");

    console.log("Seeding complete. Disconnecting...");
    await dbDisconnect();
    console.log("Disconnected from Database!");
}

// Run the seeding function
seed().catch(error => {
    console.error("Error seeding database:", error);
    dbDisconnect();
});
