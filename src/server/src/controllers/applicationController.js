const Application = require("../models/ApplicationModel");
const Pet = require("../models/PetModel")

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

async function getAllApplications (request, response) {
    if (!request.user.admin) {
        return response.status(403)
        .json({
            message: "Only administrators are authorised to perform this operation"
        });
        
        const applications = await Application.find().populate("user", "name email").populate("pet", "name species");
        response.json(applications)
    }
}

module.exports = {
    submitApplication
}