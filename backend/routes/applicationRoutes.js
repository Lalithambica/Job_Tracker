import express from "express";
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.route("/")
  .post(protect, upload.single("resume"), createApplication)
  .get(protect, getApplications);

  router.route("/:id")
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

export default router;