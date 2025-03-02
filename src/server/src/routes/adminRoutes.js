const express = require("express");
const { getAllApplications } = require("../controllers/applicationController");
const router = express.Router();





router.get("/applications", getAllApplications);
// approve
// reject
// delete