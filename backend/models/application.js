import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    resume: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied"
    },
    appliedDate: { type: Date, required: true },
    jobLink: { type: String, required: true },

    location: String,
    jd: String,
    interviewLink: String,
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
