import Application from "../models/application.js";
import Interview from "../models/Interviews.js"

export const createApplication = async (req, res) => {
  const application = await Application.create({
    user: req.user._id,
    companyName: req.body.companyName,
    role: req.body.role,
    appliedDate: req.body.appliedDate,
    jobLink: req.body.jobLink,
    resume: req.file ? `/uploads/${req.file.filename}` : "",
  });

  res.status(201).json(application);
};

export const getApplications = async (req, res) => {
  const applications = await Application.find({
    user: req.user._id
  });

  res.json(applications);
};

export const updateApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  if (application.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const updated = await Application.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};



export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    console.log("Deleting interviews for:", application._id);

    await Interview.deleteMany({ application: application._id });

    console.log("Deleting application");

    await application.deleteOne();

    res.json({ message: "Application and related interviews deleted" });

  } catch (error) {
    console.log("DELETE APPLICATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};