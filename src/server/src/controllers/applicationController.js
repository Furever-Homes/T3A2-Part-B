const { Application } = require("../models/ApplicationModel");

async function submitApplication(request, response) {
  try {

      console.log("✅ Request received at submitApplication");
      console.log("✅ User in request:", request.authUserData.userId); // Debugging
      console.log("✅ Request params:", request.params);
      console.log("✅ Request body:", request.body);

      const { message } = request.body; 
      const { petId } = request.params; 

      // Check if the user has already applied for this pet
      const existingApplication = await Application.findOne({
          user: request.authUserData.userId,
          pet: petId,
      });

      if (existingApplication) {
          return response.status(400).json({
              message: "You have already submitted an application for this pet",
          });
      }

      // Create and save the new application
      const newApplication = new Application({
          user: request.authUserData.userId,
          pet: petId,
          message,
      });

      await newApplication.save();

      response.status(201).json({
          message: "Application Submitted Successfully",
          application: newApplication,
      });

  } catch (error) {
      response.status(500).json({
          message: "An error occurred while submitting your application",
          error: error.message,
      });
  }
}

// Get all open applications as an admin, with option to filter by Location or animalType
// /api/admin/applications
// /api/admin/applications?location=xxx
// /api/admin/applications?animalType=xxx
// /api/admin/applications?location=xxx&animalType=xxx
async function getAllApplications(request, response) {
  try {
    const { location, animalType } = request.query;

    // Find applications and populate user and pet
    let applications = await Application.find()
      .populate("user", "name email")
      .populate("pet", "name location animalType");

    // Apply filtering using JavaScript's `.filter()` method
    if (location || animalType) {
      applications = applications.filter(app => {
        if (!app.pet) return false; // Ensure app has a valid pet reference
        if (location && app.pet.location !== location) return false;
        if (animalType && app.pet.animalType !== animalType) return false;
        return true;
      });
    }

    response.status(200).json(applications);
  } catch (error) {
    response.status(500).json({ message: "Error fetching applications", error: error.message });
  }
}

async function getUserApplications(request, response) {
    try {
        const applications = await Application.find({
            user: request.authUserData.id,
        })
        .populate("pet", "name breed status")
        .sort({ createdAt: -1 }); // Sorts by latest applications first

        response.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching user applications:", error.message);
        response.status(500).json({
            message: "An error occurred while retrieving applications",
            error: error.message,
        });
    }
}

async function deleteUserApplication(request, response) {
  try {
    const applicationId = request.params.applicationId;

    const application = await Application.findById(applicationId);

    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== request.user.id) {
      return response
        .status(403)
        .json({
          message: "You are not authorised to delete this application.",
        });
    }

    await Application.findByIdAndDelete(applicationId);

    response.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error deleting application", error: error.message });
  }
}

async function approveApplication(request, response) {
  try {
    const applicationId = request.params.applicationId;

    const application = await Application.findById(applicationId);
    if (!application) {
      return response.status(404).json({
        message: "Application not found",
      });
    }
    if (application.status !== "Pending") {
      return response.status(400).json({
        message: "Application has already been processed",
      });
    }

    application.status = "Approved";
    await application.save();

    response.status(200).json({
      message: "Application approved successfully",
      application,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error occured while approving application",
      error: error.message,
    });
  }
}

async function rejectApplication(request, response) {
  try {
    const applicationId = request.params.applicationId;

    const application = await Application.findById(applicationId);
    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "Pending") {
      return response
        .status(400)
        .json({ message: "Application has already been processed" });
    }

    application.status = "Rejected";
    await application.save();

    response
      .status(200)
      .json({ message: "Application rejected successfully", application });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error rejecting application", error: error.message });
  }
}

async function deleteApplicationByAdmin(request, response) {
  try {
    const applicationId = request.params.applicationId;

    const application = await Application.findByIdAndDelete(applicationId);
    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }

    response
      .status(200)
      .json({ message: "Application deleted successfully by admin" });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Error deleting application", error: error.message });
  }
}

module.exports = {
  submitApplication,
  getAllApplications,
  getUserApplications,
  deleteUserApplication,
  approveApplication,
  rejectApplication,
  deleteApplicationByAdmin
}
