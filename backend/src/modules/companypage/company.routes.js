import express from "express";

import {
  createCompanyProfile,
  getAllCompanyProfiles,
  getSingleCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
} from "./company.controller.js";

import { protect } from "../../middleware/auth.midleware.js";

const router = express.Router();

/**
 * CREATE COMPANY PROFILE
 */
router.post(
  "/",
  protect,
  createCompanyProfile
);

/**
 * GET ALL COMPANY PROFILES
 */
router.get(
  "/",
  getAllCompanyProfiles
);

/**
 * GET SINGLE COMPANY PROFILE
 */
router.get(
  "/:id",
  getSingleCompanyProfile
);

/**
 * UPDATE COMPANY PROFILE
 */
router.put(
  "/:id",
  protect,
  updateCompanyProfile
);

/**
 * DELETE COMPANY PROFILE
 */
router.delete(
  "/:id",
  protect,
  deleteCompanyProfile
);

export default router;