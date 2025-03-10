const multer = require("multer");
const cloudinary = require("../utils/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (request, file) => ({
    folder: request.originalUrl.toLowerCase().includes("user") ? "users" : "pets",
    allowed_formats: ["jpg", "png", "jpeg"],
    resource_type: "image",
    transformation: [
      { width: 750, height: 500, crop: "pad", gravity: "auto" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  }),
});

const upload = multer({ storage });

module.exports = upload;