const express = require("express");
const { getAllApplications } = require("../controllers/applicationController");
const { adminMiddleware } = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


adminMiddleware


router.get("/applications", authMiddleware, adminMiddleware,  getAllApplications);
// approve
// reject
// delete