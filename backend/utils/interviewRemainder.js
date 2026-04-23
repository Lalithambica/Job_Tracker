import cron from "node-cron";
import Interview from "../models/Interviews.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const startInterviewReminder = () => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // check every hour
  cron.schedule("0 * * * *", async () => {

    const now = new Date();

    const in24Hours = new Date();
    in24Hours.setHours(now.getHours() + 24);

    const interviews = await Interview.find({
      reminderSent: false
    }).populate("user");

    for (const interview of interviews) {

      const interviewTime = new Date(interview.time);

      const diff = interviewTime - now;

      const hoursUntilInterview = diff / (1000 * 60 * 60);

      if (hoursUntilInterview <= 24 && hoursUntilInterview > 23) {

        if (!interview.user) continue;

        await transporter.sendMail({
          to: interview.user.email,
          subject: "Interview Reminder (24 Hours)",
          text: `
Reminder: Your interview is tomorrow.

Company: ${interview.companyName}
Role: ${interview.role}
Round: ${interview.round}
Time: ${interviewTime.toLocaleString()}

Good luck!
          `
        });

        interview.reminderSent = true;
        await interview.save();

        console.log("Reminder sent for", interview.companyName);

      }

    }

  });

};