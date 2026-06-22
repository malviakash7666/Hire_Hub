import express from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getAllApplications,
} from "./jobApplication.controller.js";

import { protect } from "../../middleware/auth.midleware.js";

const router = express.Router();

router.post("/", protect, applyForJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicationsByJob);
router.get("/:id", protect, getApplicationById);
router.patch("/:id/status", protect, updateApplicationStatus);
router.delete("/:id", protect, deleteApplication);
router.get("/get/all",protect, getAllApplications);

export default router;