const { Pet } = require("../models/PetModel");
const { User } = require("../models/UserModel");
const { Application } = require("../models/ApplicationModel");
const cloudinary = require("../utils/cloudinaryConfig");
const Joi = require("joi");

// Validation schema for Pet
const petSchema = Joi.object({
  name: Joi.string().required(),
  animalType: Joi.string().valid("Dog", "Cat", "Other").required(),
  age: Joi.number().required(),
  activityLevel: Joi.string().valid("Low", "Medium", "High").required(),
  status: Joi.string().valid("Available", "Adopted"),
  description: Joi.string().allow(""),
  location: Joi.string().required(),
  image: Joi.string().allow(null, ""),
});

// Get all available pets (with optional filtering)
async function getAllPets(request, response) {
  try {
    const { animalType, location } = request.query;
    let filter = { status: "Available" };

    if (animalType) filter.animalType = animalType;
    if (location) filter.location = location;

    const pets = await Pet.find(filter);
    response.json(pets);
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

// Get a specific pet
async function getPet(request, response) {
  try {
    const pet = await Pet.findById(request.params.petId);
    if (!pet) return response.status(404).json({ error: "Pet not found" });
    response.status(200).json(pet);
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

// Create a new pet
async function createPet(request, response) {
  try {
    const { error } = petSchema.validate(request.body);
    if (error)
      return response.status(400).json({ error: error.details[0].message });

    // Use Cloudinary image from middleware, or default image
    const imageUrl = request.file ? request.file.path : null;

    const pet = new Pet({ ...request.body, image: imageUrl });
    await pet.save();
    response.status(201).json(pet);
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

// Update an existing pet
async function updatePet(request, response) {
  try {
    const pet = await Pet.findById(request.params.petId);
    if (!pet) return response.status(404).json({ error: "Pet not found" });

    // If an image is uploaded, use the new Cloudinary URL, else continue using linked image
    let newImage = request.file ? request.file.path : pet.image;

    // If image is removed, reset to Cloudinary default
    if (request.body.image === "" || request.body.image === null) {
      newImage =
        {
          Dog: process.env.CLOUDINARY_DEFAULT_DOG,
          Cat: process.env.CLOUDINARY_DEFAULT_CAT,
          Other: process.env.CLOUDINARY_DEFAULT_OTHER,
        }[pet.animalType] || process.env.CLOUDINARY_DEFAULT_OTHER;
    }

    Object.assign(pet, request.body, { image: newImage });
    await pet.save();
    response.status(200).json(pet);
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

// Delete a pet
async function deletePet(request, response) {
  try {
    const pet = await Pet.findById(request.params.petId);
    if (!pet) return response.status(404).json({ error: "Pet not found." });

    const defaultImages = [
      process.env.CLOUDINARY_DEFAULT_DOG,
      process.env.CLOUDINARY_DEFAULT_CAT,
      process.env.CLOUDINARY_DEFAULT_OTHER,
    ];

    if (pet.image && !defaultImages.includes(pet.image)) {
      const publicId = cloudinary.utils.extractPublicId(pet.image);
      await cloudinary.uploader.destroy(publicId);
    }

    await User.updateMany(
      { favourites: pet._id },
      { $pull: { favourites: pet._id } }
    );

    await Application.deleteMany({ pet: pet._id });

    await Pet.findByIdAndDelete(request.params.petId);

    response.status(200).json({ message: "Pet deleted successfully." });
  } catch (error) {
    response.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getAllPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
};
