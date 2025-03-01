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


module.exports = {
    submitApplication
}