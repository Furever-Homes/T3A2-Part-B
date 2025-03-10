function getCloudinaryPublicId(imageUrl) {
  if (!imageUrl) return null; // If no image

  const parts = imageUrl.split("/");
  const filename = parts.pop(); // Get file name
  const publicId = filename.split(".")[0]; // Remove file extension

  // Ensure image was from users or pets folder
  const folder = parts.pop();
  if (folder === "users" || folder === "pets") {
    return `${folder}/${publicId}`;
  }

  return publicId; // If no valid folder, return only the public ID
}

module.exports = { getCloudinaryPublicId };
