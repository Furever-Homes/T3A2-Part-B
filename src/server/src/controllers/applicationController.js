const { Application } = require("../models/ApplicationModel");

async function submitApplication(request, response) {
  const { petId, message } = request.body;
  const existingApplication = await Application.findOne({
    user: request.user.id,
    pet: petId,
  });

  if (existingApplication) {
    return response.status(400).json({
      message: "You have already submitted an application for this pet",
    });
  }

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
}

// Get all open applications as an admin
async function getAllApplications(request, response) {
  if (!request.user.admin) {
    return response.status(403).json({
      message: "Only administrators are authorised to perform this operation",
    });
  }
  const applications = await Application.find()
    .populate("user", "name email")
    .populate("pet", "name species");
  response.json(applications);
}

async function getUserApplications(request, response) {
  const applications = await Application.find({
    user: request.user.id,
  })
    .populate("pet", "name breed status")
    .sort({ createdAt: -1 }); // Sorts by latest applications first

  response.statu(200).json(applications);
}

async function deleteUserApplication(request, response) {
  try {
    const applicationId = request.params.id;

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
    const applicationId = request.params.id;

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
    const applicationId = request.params.id;

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
    const { applicationId } = request.params;

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
  deleteApplicationByAdmin,
};
