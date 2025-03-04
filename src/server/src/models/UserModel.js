const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"        
    }],
    admin: {
        type: Boolean,
        default: false,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    User
}