const { Pet } = require("../models/PetModel");

// Get all pets
async function getAllPets(request, response) {
    try {
        const pets = await Pet.find({
            status: "Available"
        });
        response.json(pets);
    } catch (error) {
        response
        .status(500)
        .json({
            message: error.message
        });
    }
}

// Get a specific pet

// Create a pet

// Update existing pet details

// Remove a pet

module.exports = {
    getAllPets,
    // getPet,
    // createPet,
    // updatePet,
    // deletePet
}