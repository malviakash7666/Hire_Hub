import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./src/modules/user/auth.routes.js";
import jobRoutes from "./src/modules/jobPost/jobPost.routes.js";
import applicationRoutes from "./src/modules/jobApplication/jobApplication.routes.js";
import companyRoutes from "./src/modules/companypage/company.routes.js";

import dotenv from "dotenv";

dotenv.config();

// ✅ check env loaded
console.log("ENV CHECK 👉", process.env.FRONTEND_URL);

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

  console.log("Origin:", origin);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/job-post", jobRoutes);
// Job application endpoints (match frontend baseURL)
app.use("/api/v1/job-applications", applicationRoutes);
// Provide backward-compatible path used by frontend: /api/v1/jobs
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/company", companyRoutes);


export default app;