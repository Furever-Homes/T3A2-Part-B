const { Application } = require("../models/ApplicationModel");

async function submitApplication(request, response) {
  try {
      const { message } = request.body; 
      const { petId } = request.params.petId; 

      // Check if the user has already applied for this pet
      const existingApplication = await Application.findOne({
          user: request.user.id,
          pet: petId,
      });

      if (existingApplication) {
          return response.status(400).json({
              message: "You have already submitted an application for this pet",
          });
      }

      // Create and save the new application
      const newApplication = new Application({
          user: request.user.id,
          pet: petId,
          message,
      });

      await newApplication.save();

      response.status(201).json({
          message: "Application Submitted Successfully",
          application: newApplication,
      });

  } catch (error) {
      console.error("Error submitting application:", error.message);
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
    if (!request.user.admin) {
        return response.status(403).json({
            message: "Only administrators are authorised to perform this action"
        });
    }

    try {
        const { location, animalType } = request.query;
        
        let applicationsQuery = Application.find()
            .populate("user", "name email")
            .populate({
                path: "pet",
                select: "name breed location animalType",
            });

        // Apply filtering only if there are filters
        if (location || animalType) {
            applicationsQuery = applicationsQuery.populate({
                path: "pet",
                select: "name breed location animalType",
                match: {
                    ...(location && { location }),
                    ...(animalType && { animalType }),
                }
            });
        }

        const applications = await applicationsQuery;

        response.json(applications);
    } catch (error) {
        response.status(500).json({ message: "Error fetching applications", error: error.message });
    }
}

async function getUserApplications(request, response) {
    try {
        const applications = await Application.find({
            user: request.user.id,
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
    const { applicationId } = request.params.applicationId;

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
