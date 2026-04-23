import Application from "../models/application.js";
import Interview from "../models/Interviews.js";

export const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create({
      user: req.user._id,
      application: req.body.application,
      companyName: req.body.companyName,
      role: req.body.role,
      round: req.body.round,
      time: req.body.time,
    });

    res.status(201).json(interview);
  } catch (error) {
    console.log("CREATE INTERVIEW ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInterviews = async (req, res) => {
  const interviews = await Interview.find({
    user: req.user._id
  });

  res.json(interviews);
};

export const deleteInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  if (interview.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await interview.deleteOne();

  res.json({ message: "Interview deleted" });
};

export const updateInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  if (interview.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  interview.companyName = req.body.companyName || interview.companyName;
  interview.role = req.body.role || interview.role;
  interview.round = req.body.round || interview.round;
  interview.time = req.body.time || interview.time;

  const updatedInterview = await interview.save();

  res.json(updatedInterview);
};