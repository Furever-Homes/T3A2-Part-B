const { User } = require("../models/UserModel");

async function favouritePet(request, response) {
  try {
    const userId = request.authUserData.userId; // Extract user ID from JWT
    const { petId } = request.body; // Extract pet ID from request body

    const user = await User.findById(userId); // Find User in database
    // If user doesn't exist in database
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If pet is already favourited
    if (user.favourites.includes(petId)) {
      return response
        .status(400)
        .json({ success: false, message: "Pet already in favourites" });
    }

    // Add pet ID into user's list of favourites
    user.favourites.push(petId);
    await user.save();

    // Return success message
    return response.json({
      success: true,
      message: "Pet added to favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Error adding pet to favourites" });
  }
}

async function unFavouritePet(request, response) {
  try {
    const userId = request.authUserData.userId; // Extract user ID from JWT
    const { petId } = request.body; // Extract pet ID from request body

    const user = await User.findById(userId); // Find User in database
    // If user doesn't exist in database
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Filter out the petId from the favourites list
    user.favourites = user.favourites.filter((fav) => fav.toString() !== petId);

    await user.save();

    return response.json({
      success: true,
      message: "Pet removed from favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Error removing pet from favourites" });
  }
}

async function getFavourites(request, response) {
  try {
    const userId = request.authUserData.userId; // Extract user ID from JWT

    const user = await User.findById(userId).populate("favourites");
    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return response.json({ success: true, favourites: user.favourites });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ success: false, message: "Error fetching favourite pets" });
  }
}

module.exports = {
  favouritePet,
  unFavouritePet,
  getFavourites,
};
