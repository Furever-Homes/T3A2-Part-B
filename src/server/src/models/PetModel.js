const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    animalType: {
      type: String,
      enum: ["Cat", "Dog", "Other"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Adopted"],
      default: "Available",
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      enum: ["Melbourne", "Sydney", "Brisbane", "Perth", "Canberra"],
      required: true,
    },
    image: {
      type: String,
      default: function () {
        if (!this.image) {
          return {
            Dog: process.env.CLOUDINARY_DEFAULT_DOG,
            Cat: process.env.CLOUDINARY_DEFAULT_CAT,
            Other: process.env.CLOUDINARY_DEFAULT_OTHER,
          }[this.animalType] || process.env.CLOUDINARY_DEFAULT_OTHER;
        }
        return this.image;
      },
    },
  },
  { timestamps: true }
);

const Pet = mongoose.model("Pet", PetSchema);
module.exports = {
    Pet
};
