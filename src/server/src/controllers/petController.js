const { Pet } = require("../models/PetModel");
const { User } = require("../models/UserModel");
const { Application } = require("../models/ApplicationModel");
const cloudinary = require("../utils/cloudinaryConfig");
const { getCloudinaryPublicId } = require("../utils/cloudinaryPublicId");
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
    response.status(200).json(pets);
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
    const imageUrl = request.file ? request.file.path : undefined;

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

    const defaultImages = [
      process.env.CLOUDINARY_DEFAULT_DOG,
      process.env.CLOUDINARY_DEFAULT_CAT,
      process.env.CLOUDINARY_DEFAULT_OTHER,
    ];

    let newImage = pet.image; // Keep the existing image by default

    // If new image is uploaded
    if (request.file) {
      newImage = request.file.path; // Assign new file to newImage

      // Delete previous Cloudinary image if it's not a default one
      if (pet.image && !defaultImages.includes(pet.image)) {
        const publicId = getCloudinaryPublicId(pet.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    // If image is reset (image: "" or null)
    if ("image" in request.body && (request.body.image === "" || request.body.image === null)) {
      // Delete previous Cloudinary image if it's not a default one
      if (pet.image && !defaultImages.includes(pet.image)) {
        const publicId = getCloudinaryPublicId(pet.image);
        await cloudinary.uploader.destroy(publicId);
      }

      // Set the default image based on pet type
      newImage = {
        Dog: process.env.CLOUDINARY_DEFAULT_DOG,
        Cat: process.env.CLOUDINARY_DEFAULT_CAT,
        Other: process.env.CLOUDINARY_DEFAULT_OTHER,
      }[pet.animalType] || process.env.CLOUDINARY_DEFAULT_OTHER;
    }

    // Update pet details
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
      const publicId = getCloudinaryPublicId(pet.image);
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
