import jwt from "jsonwebtoken";
import db from "../../models/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.utils.js";
import {getAccessCookieOptions} from '../../utils/setCokies.js'
import {getCookieOptions} from '../../utils/setCokies.js'
import crypto from "crypto";
const { User } = db;

/* ── Only these roles can self-register (admin is excluded intentionally) ── */
const SELF_REGISTER_ROLES = ["job_poster", "job_seeker"];

/* ── All valid roles (used for internal checks) ── */
const ALL_ROLES = ["job_poster", "job_seeker", "admin"];



/* ── Shared safe user payload (never expose password) ── */
const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// ─────────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    name = name?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    role = role?.trim().toLowerCase();

    // Required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    // Only allow self-registration for job_poster and job_seeker
    if (!SELF_REGISTER_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles for registration: ${SELF_REGISTER_ROLES.join(", ")}`,
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    const newUser = await User.create({ name, email, password, role });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, getCookieOptions());
    res.cookie("accessToken", accessToken, getAccessCookieOptions());

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      accessToken,
      user: safeUser(newUser),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // Sequelize validation errors (e.g. unique constraint, format)
    if (error.name === "SequelizeValidationError") {
      return res.status(422).json({
        success: false,
        message: error.errors?.[0]?.message || "Validation error",
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });

    // Use a generic message to avoid user enumeration
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, getCookieOptions());
    res.cookie("accessToken", accessToken, getAccessCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ─────────────────────────────────────────────
// FORGOT PASSWORD
// ─────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    email = email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ where: { email } });

    // Same response for security
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If this email exists, a password reset link has been sent.",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token + expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Frontend URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    console.log("RESET URL:", resetUrl);

    // TODO: Send email here

    return res.status(200).json({
      success: true,
      message:
        "If this email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during forgot password",
    });
  }
};
// ─────────────────────────────────────────────
// RESET PASSWORD
// ─────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    let { password } = req.body;

    password = password?.trim();

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // Expiry check
    if (new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Reset token expired",
      });
    }

    // Update password
    user.password = password;

    // Clear reset fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during password reset",
    });
  }
};
// ─────────────────────────────────────────────
// GET ME (requires auth middleware)
// ─────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
export const logoutUser = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    };

    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

// ─────────────────────────────────────────────
// REFRESH ACCESS TOKEN
// ─────────────────────────────────────────────
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found. Please log in again.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      // Expired or tampered token
      return res.status(401).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Session expired. Please log in again."
            : "Invalid refresh token. Please log in again.",
      });
    }

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.cookie("accessToken", newAccessToken, getAccessCookieOptions());

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: safeUser(user),
    });
  } catch (error) {
    console.error("REFRESH TOKEN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during token refresh",
    });
  }
};