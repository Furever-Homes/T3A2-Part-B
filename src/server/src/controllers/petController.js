const { Pet } = require("../models/PetModel");
const Joi = require("joi");

// Validation schema for Pet
const petSchema = Joi.object({
    name: Joi.string().required(),
    animalType: Joi.string().required(),
    breed: Joi.string().required(),
    birthday: Joi.date().required(),
    activityLevel: Joi.string().valid("Low", "Medium", "High").required(),
    status: Joi.string().valid("Available", "Adopted"),
    description: Joi.string().allow(""),
    location: Joi.string().required(),
    image: Joi.string().required()
});

// Function to get all available pets in the database
// GET /api/pets
async function getAllPets(request, response) {
    try {
        const pets = await Pet.find({ status: "Available" });
        response.json(pets);
    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
}

// Get a specific pet (by ID)
// GET /api/pets/:id
async function getPet(request, response) {
    try {
        const pet = await Pet.findById(request.params.id);
        if (!pet) return response.status(404).json({ error: "Pet not found" });
        response.status(200).json(pet);
    } catch (err) {
        response.status(500).json({ error: "Server error" });
    }
}

// Create a pet

// Update existing pet details

// Remove a pet

module.exports = {
    getAllPets,
    getPet,
    // createPet,
    // updatePet,
    // deletePet
};