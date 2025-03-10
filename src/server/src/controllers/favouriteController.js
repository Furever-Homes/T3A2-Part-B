const { User } = require("../models/UserModel");
const { Pet } = require("../models/PetModel")

// Favourite a Pet
async function favouritePet(request, response) {
  try {
    const userId = request.authUserData.userId;
    const petId = request.params.petId;

    const petExists = await Pet.findById(petId);
    if (!petExists) {
      return response.status(404).json({ success: false, message: "Pet not found" });
    }

    // Check if pet already exists in favourites
    const user = await User.findById(userId);
    if (user.favourites.includes(petId)) {
      return response.status(400).json({ success: false, message: "Pet is already in favourites" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: petId } },
      { new: true }
    );

    return response.json({
      success: true,
      message: "Pet added to favourites",
      favourites: updatedUser.favourites,
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Error adding pet to favourites" });
  }
}

// Unfavourite a Pet
async function unFavouritePet(request, response) {
  try {
    const userId = request.authUserData.userId;
    const petId = request.params.petId;

    const petExists = await Pet.findById(petId);
    if (!petExists) {
      return response.status(404).json({ success: false, message: "Pet not found" });
    }

    // Check if pet doesn't exist in favourites
    const user = await User.findById(userId);
    if (!user.favourites.includes(petId)) {
      return response.status(400).json({ success: false, message: "Pet is not in favourites" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: petId } },
      { new: true }
    );

    return response.json({
      success: true,
      message: "Pet removed from favourites",
      favourites: updatedUser.favourites,
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Error removing pet from favourites" });
  }
}

// Get Favourites
async function getFavourites(request, response) {
  try {
    const userId = request.authUserData.userId;

    const user = await User.findById(userId).populate("favourites");

    return response.json({ success: true, favourites: user.favourites });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Error fetching favourite pets",
    });
  }
}

module.exports = {
  favouritePet,
  unFavouritePet,
  getFavourites,
};