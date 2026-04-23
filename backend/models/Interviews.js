import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    round: String,
    time: { type: Date, required: true },

    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
