const express = require("express");

const router = express.Router();

//localhost:5000/api/auth/register
router.post("/register", () => {
    console.log("This is a register screen")
});

//localhost:5000/api/auth/login
router.post("/login", () => {
    console.log("This is a login screen")
});

module.exports = router;
