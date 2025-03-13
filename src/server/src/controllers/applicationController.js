const { Application } = require("../models/ApplicationModel");
const { Pet } = require("../models/PetModel");

async function submitApplication(request, response) {
  try {
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
// /api/admin/applications?status=xxx
// /api/admin/applications?location=xxx&animalType=xxx&status=xxx
async function getAllApplications(request, response) {
  try {
    const { location, animalType, status } = request.query;

    let applications = await Application.find()
      .populate("user", "name email image") // Include user image
      .populate("pet", "name image animalType age activityLevel status location"); // Include all pet properties

    if (location || animalType || status) {
      applications = applications.filter(app => {
        if (!app.pet) return false;
        if (location && app.pet.location !== location) return false;
        if (animalType && app.pet.animalType !== animalType) return false;
        if (status && app.status !== status) return false;
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
      // Ensure user data exists in the request
      if (!request.authUserData || !request.authUserData.userId) {
          return response.status(401).json({ message: "Unauthorised: User not found" });
      }
      const userId = request.authUserData.userId; // Extract user ID 

      // Fetch applications submitted by the user and populate pet details
      const applications = await Application.find({ user: userId })
          .populate("pet", "name status location image")
          .sort({ createdAt: -1 });

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

    if (!application.user.equals(request.authUserData.userId)) {
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

    // Find the application from URL and populate pet details
    const application = await Application.findById(applicationId).populate("pet");
    if (!application) {
      return response.status(404).json({ message: "Application not found" });
    }

    // Check if application is already processed
    if (application.status !== "Pending") {
      return response.status(400).json({ message: "Application has already been processed" });
    }

    // Approve application
    application.status = "Approved";
    await application.save();

    let petName = "Pet"; 
    if (application.pet && application.pet._id) {
      petName = application.pet.name; // Get pet name

      // Update pet status to "Adopted"
      await Pet.findByIdAndUpdate(application.pet._id, { status: "Adopted" });
    }

    response.status(200).json({
      message: `Application has been successfully approved. ${petName} has found their Furever Home!`,
      application,
    });
  } catch (error) {
    console.error("Error approving application:", error.message);
    response.status(500).json({
      message: "Error occurred while approving application",
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
