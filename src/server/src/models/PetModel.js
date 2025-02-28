const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    animalType: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    activityLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },
    status: {
        type: String,
        enum: ["Available", "Adopted"],
        default: "Available"
    },
    description: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Pet = mongoose.model("Pet", PetSchema);

module.exports = {
    Pet
}