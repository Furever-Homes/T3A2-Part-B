const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
        },
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Pet", 
        required: true 
        },
    status: { 
        type: String, 
        enum: ["Pending", "Approved", "Rejected"], 
        default: "Pending" 
        },
    message: { 
        type: String, 
        default: "No message provided"
    }
}, { timestamps: true });

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = {
    Application
}