import db from "../../models/index.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import {getAccessCookieOptions} from '../../utils/setCokies.js'
import {getCookieOptions} from '../../utils/setCokies.js'

const { JobApplication, Job, User } = db;

// ─── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Helper: Upload buffer to Cloudinary ─────────────────────────────────────
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// ─── Helper: Delete file from Cloudinary ─────────────────────────────────────
const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
};

/**
 * Apply for a job (with optional resume upload)
 * POST /api/v1/job-applications
 * Content-Type: multipart/form-data
 *
 * Body fields:
 *   jobId, fullName, email, phone (optional), coverLetter (optional)
 * File field:
 *   resume  →  accepts PDF or image (jpg/jpeg/png/webp)
 *
 * Required ENV variables:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
export const applyForJob = async (req, res) => {
  try {
    const { jobId, fullName, email, phone, coverLetter } = req.body;
    const applicantId = req.user?.userId;

    // ── Auth check ──────────────────────────────────────────────────────────
    if (!applicantId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    // ── Role check ──────────────────────────────────────────────────────────
    if (req.user.role !== "job_seeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can apply for jobs",
      });
    }

    // ── Required fields ─────────────────────────────────────────────────────
    if (!jobId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "jobId, fullName, and email are required",
      });
    }

    // ── Job existence ────────────────────────────────────────────────────────
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // ── Duplicate application ────────────────────────────────────────────────
    const existingApplication = await JobApplication.findOne({
      where: { jobId, applicantId },
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // ── Resume upload (optional) ─────────────────────────────────────────────
    let resumeData = {};

    if (req.file) {
      const file = req.file;
      const isPdf = file.mimetype === "application/pdf";
      const isImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.mimetype
      );

      if (!isPdf && !isImage) {
        return res.status(400).json({
          success: false,
          message: "Resume must be a PDF or an image (jpg, jpeg, png, webp)",
        });
      }

      // Max size: 5 MB
      const MAX_BYTES = 5 * 1024 * 1024;
      if (file.size > MAX_BYTES) {
        return res.status(400).json({
          success: false,
          message: "Resume file size must be under 5 MB",
        });
      }

      const uploadOptions = {
        folder: "job_applications/resumes",
        resource_type: isPdf ? "raw" : "image",   // "raw" for PDF, "image" for images
        public_id: `resume_${applicantId}_${jobId}_${Date.now()}`,
        // For PDFs, force download when accessed via the URL
        ...(isPdf && { format: "pdf" }),
      };

      const uploadResult = await uploadToCloudinary(file.buffer, uploadOptions);

      resumeData = {
        resumeUrl: uploadResult.secure_url,
        resumePublicId: uploadResult.public_id,
        resumeOriginalName: file.originalname,
        resumeResourceType: uploadResult.resource_type,
        resumeFormat: uploadResult.format,
        resumeBytes: uploadResult.bytes,
      };
    }

    // ── Create application ───────────────────────────────────────────────────
    const application = await JobApplication.create({
      jobId,
      applicantId,
      fullName,
      email,
      phone,
      coverLetter,
      status: "Applied",
      ...resumeData,
    });

    return res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("applyForJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

/**
 * Get logged-in user's applications
 * GET /api/v1/job-applications/my
 */
export const getMyApplications = async (req, res) => {
  try {
    const applicantId = req.user?.userId;

    if (!applicantId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    if (req.user.role !== "job_seeker") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can view their applications",
      });
    }

    const applications = await JobApplication.findAll({
      where: { applicantId },
      include: [{ model: Job, as: "job" }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("getMyApplications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};

/**
 * Get all applications for a specific job (owner / admin only)
 * GET /api/v1/job-applications/job/:jobId
 */
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const isOwner = job.createdBy === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view applications for this job",
      });
    }

    const applications = await JobApplication.findAll({
      where: { jobId },
      include: [
        { model: User, as: "applicant", attributes: ["id", "name", "email"] },
        { model: Job, as: "job" },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("getApplicationsByJob error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job applications",
      error: error.message,
    });
  }
};

/**
 * Get single application by id
 * GET /api/v1/job-applications/:id
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByPk(id, {
      include: [
        { model: User, as: "applicant", attributes: ["id", "name", "email"] },
        { model: Job, as: "job" },
      ],
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const isApplicant = application.applicantId === req.user.userId;
    const isOwner = application.job.createdBy === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isApplicant && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this application",
      });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("getApplicationById error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch application",
      error: error.message,
    });
  }
};

/**
 * Update application status (owner / admin only)
 * PATCH /api/v1/job-applications/:id/status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Applied", "Reviewed", "Shortlisted", "Rejected", "Hired"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const application = await JobApplication.findByPk(id, {
      include: [{ model: Job, as: "job" }],
    });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const isOwner = application.job.createdBy === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this application",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    });
  }
};

/**
 * Delete application + remove resume from Cloudinary
 * DELETE /api/v1/job-applications/:id
 */
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findByPk(id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // ── Only the applicant or admin can delete ───────────────────────────────
    const isApplicant = application.applicantId === req.user.userId;
    const isAdmin = req.user.role === "admin";

    if (!isApplicant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this application",
      });
    }

    // ── Remove resume from Cloudinary if it exists ───────────────────────────
    if (application.resumePublicId) {
      await deleteFromCloudinary(
        application.resumePublicId,
        application.resumeResourceType || "raw"
      );
    }

    await application.destroy();

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("deleteApplication error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete application",
      error: error.message,
    });
  }
};


/**
 * Get all job applications (admin only)
 * GET /api/v1/job-applications
 */
export const getAllApplications = async (req, res) => {
  try {
    // ── Only admin can view all applications ───────────────────────────────
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can view all job applications",
      });
    }

    const applications = await JobApplication.findAll({
      include: [
        {
          model: User,
          as: "applicant",
          attributes: ["id", "name", "email"],
        },
        {
          model: Job,
          as: "job",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("getAllApplications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all job applications",
      error: error.message,
    });
  }
};

