import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  refreshAccessToken,
} from "./auth.controller.js";
import { protect } from "../../middleware/auth.midleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
router.post("/refresh-token", refreshAccessToken);

export default router;