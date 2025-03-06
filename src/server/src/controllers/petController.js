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

// Get all available pets in the database with optional filtering
// GET /api/pets?animalType=Dog&location=Sydney
async function getAllPets(request, response) {
    try {
        const { animalType, location } = request.query; // Get query parameters

        // Filter pets by Available status
        let filter = { status: "Available" };

        // If route includes animalType query, add to filter
        if (animalType) {
            filter.animalType = animalType;
        }

        // If route includes location query, add to filter
        if (location) {
            filter.location = location;
        }

        // Fetch pets based on the filter/s
        const pets = await Pet.find(filter);
        response.json(pets);
    } catch (error) {
        response.status(500).json({ error: error.message });
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
// POST /api/pets
async function createPet(request, response) {
    try {
        const { error } = petSchema.validate(request.body);
        if (error) return response.status(400).json({ error: error.details[0].message });

        const pet = new Pet(request.body);
        await pet.save();
        response.status(201).json(pet);
    } catch (err) {
        response.status(500).json({ error: "Server error" });
    }
}

// Update existing pet details
// PUT /api/pets/:id
async function updatePet(request, response) {
    try {
        const { error } = petSchema.validate(request.body);
        if (error) return response.status(400).json({ error: error.details[0].message });

        const pet = await Pet.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if (!pet) return response.status(404).json({ error: "Pet not found" });

        response.status(200).json(pet);
    } catch (err) {
        response.status(500).json({ error: "Server error" });
    }
}

// Delete a pet
// DELETE /api/pets/:id
async function deletePet(request, response) {
    try {
        const pet = await Pet.findByIdAndDelete(request.params.id);
        if (!pet) return response.status(404).json({ error: "Pet not found" });

        response.status(200).json({ message: "Pet deleted successfully" });
    } catch (err) {
        response.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    getAllPets,
    getPet,
    createPet,
    updatePet,
    deletePet
};