import axios from "axios";

/* ================= TYPES ================= */

export type JobStatus = "Open" | "Closed" | "Paused";

export type JobType =
  | "Full-Time"
  | "Part-Time"
  | "Internship"
  | "Contract"
  | "Remote";

export type ExperienceLevel = "Fresher" | "Junior" | "Mid" | "Senior";

export interface JobPost {
  id: string;
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills?: string[];
  requirements?: string | null;
  responsibilities?: string | null;
  deadline?: string | null;
  status: JobStatus;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateJobPostPayload {
  title: string;
  description: string;
  companyName: string;
  location: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills?: string[];
  requirements?: string;
  responsibilities?: string;
  deadline?: string;
  status?: JobStatus;
}

export interface UpdateJobPostPayload {
  title?: string;
  description?: string;
  companyName?: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skills?: string[];
  requirements?: string;
  responsibilities?: string;
  deadline?: string;
  status?: JobStatus;
}

export interface UpdateJobStatusPayload {
  status: JobStatus;
}

export interface GetJobsParams {
  search?: string;
  status?: JobStatus;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  location?: string;
  companyName?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

/* ================= AXIOS INSTANCE ================= */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const jobPostAPI = axios.create({
  baseURL: `${BACKEND_URL}/api/job-post`,
  withCredentials: true,
});



jobPostAPI.interceptors.request.use((config) => {
  // ✅ httpOnly cookies automatically send hongi
  return config;
});

/* ================= API METHODS ================= */

// CREATE JOB
export const createJobPost = (data: CreateJobPostPayload) =>
  jobPostAPI.post("/", data).then((res) => res.data);

// GET ALL JOBS (private/admin/client panel)
export const getAllJobPosts = (params?: GetJobsParams) =>
  jobPostAPI.get("/", { params }).then((res) => res.data);

// GET PUBLIC JOBS
export const getPublicJobPosts = (params?: Omit<GetJobsParams, "status">) =>
  jobPostAPI.get("/public", { params }).then((res) => res.data);

// GET MY POSTED JOBS
export const getMyJobPosts = (params?: {
  status?: JobStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}) => jobPostAPI.get("/my/jobs", { params }).then((res) => res.data);

// GET SINGLE JOB
export const getSingleJobPost = (id: string) =>
  jobPostAPI.get(`/${id}`).then((res) => res.data);

// UPDATE JOB
export const updateJobPost = (id: string, data: UpdateJobPostPayload) =>
  jobPostAPI.put(`/${id}`, data).then((res) => res.data);

// DELETE JOB
export const deleteJobPost = (id: string) =>
  jobPostAPI.delete(`/${id}`).then((res) => res.data);

// UPDATE STATUS
export const updateJobPostStatus = (
  id: string,
  data: UpdateJobStatusPayload
) => jobPostAPI.patch(`/${id}/status`, data).then((res) => res.data);

// ACTIVATE JOB
export const activateJobPost = (id: string) =>
  jobPostAPI.patch(`/${id}/activate`).then((res) => res.data);

// DEACTIVATE / PAUSE JOB
export const deactivateJobPost = (id: string) =>
  jobPostAPI.patch(`/${id}/deactivate`).then((res) => res.data);

// CLOSE JOB
export const closeJobPost = (id: string) =>
  jobPostAPI.patch(`/${id}/close`).then((res) => res.data);

// BULK IMPORT JOBS
export const bulkImportJobPosts = (csvData: string) =>
  jobPostAPI.post("/bulk-import", { csvData }).then((res) => res.data);

export default jobPostAPI;
