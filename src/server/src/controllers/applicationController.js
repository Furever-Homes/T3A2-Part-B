const Application = require("../models/ApplicationModel");
const Pet = require("../models/PetModel");

async function submitApplication(request, response) {
    const { petId, message } = request.body;
    const existingApplication = await Application.findOne({user: request.user.id, pet: petId});

    if (existingApplication) {
        return response.status(400)
        .json({
            message: "You have already submitted an application for this pet"
        });
    }

    const newApplication = new Application({
        user: request.user.id,
        pet: petId,
        message
    });

    await newApplication.save();

    response.status(201)
    .json({
        message: "Application Submitted Successfully",
        application: newApplication
    })
}

// Get all open applications as an admin
async function getAllApplications (request, response) {
    if (!request.user.admin) {
        return response.status(403)
        .json({
            message: "Only administrators are authorised to perform this operation"
        })
    }
        const applications = await Application.find().populate("user", "name email").populate("pet", "name species");
        response.json(applications)
}

async function getUserApplications(request, response) {
    const applications = await Application.find({
        user: request.user.id
    })
        .populate("pet", "name breed status")
        .sort({ createdAt: -1 }); // Sorts by latest applications first

    response.statu(200).json(applications)
}



module.exports = {
    submitApplication,
    getAllApplications,
    getUserApplications
}