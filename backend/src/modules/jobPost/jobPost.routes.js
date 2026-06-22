import express from "express";

import { protect } from "../../middleware/auth.midleware.js";
import {
  createJob,
  getAllJobs,
  getPublicJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
  activateJob,
  deactivateJob,
  closeJob,
  bulkImportJobs,
} from "./jobPost.controller.js";

const router = express.Router();

router.post("/", protect, createJob);
router.post("/bulk-import", protect, bulkImportJobs);
router.get("/", protect, getAllJobs);
router.get("/public", getPublicJobs);
router.get("/my/jobs", protect, getMyJobs);
router.get("/:id", getJobById);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);
router.patch("/:id/status", protect, updateJobStatus);
router.patch("/:id/activate", protect, activateJob);
router.patch("/:id/deactivate", protect, deactivateJob);
router.patch("/:id/close", protect, closeJob);

export default router;