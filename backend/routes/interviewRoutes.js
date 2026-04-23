import express from "express";
import {
  createInterview,
  getInterviews,
  updateInterview,
  deleteInterview
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createInterview)
  .get(protect, getInterviews);

router.route("/:id")
  .put(protect, updateInterview)   // 🔥 THIS IS IMPORTANT
  .delete(protect, deleteInterview);

export default router;