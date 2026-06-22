import axios from "axios";

/* ================= TYPES ================= */

export type JobApplicationStatus =
  | "Applied"
  | "Reviewed"
  | "Shortlisted"
  | "Rejected"
  | "Hired";

export interface Applicant {
  id: string;
  name: string;
  email: string;
}

export interface Job {
  id: string;
  title?: string;
  description?: string;
  companyName?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  resumeUrl?: string | null;
  coverLetter?: string | null;
  status: JobApplicationStatus;
  applicant?: Applicant;
  job?: Job;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplyForJobPayload {
  jobId: string;
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  coverLetter?: string;
}

export interface UpdateJobApplicationStatusPayload {
  status: JobApplicationStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
  error?: string;
}

/* ================= AXIOS INSTANCE ================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const jobApplicationAPI = axios.create({
  baseURL: `${BACKEND_URL}/api/v1/job-applications`,
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

jobApplicationAPI.interceptors.request.use((config) => {
  // ✅ cookies automatically send hongi
  return config;
});

/* ================= API METHODS ================= */

export const applyForJob = (data: ApplyForJobPayload) =>
  jobApplicationAPI
    .post<ApiResponse<JobApplication>>("/", data)
    .then((res) => res.data);

export const getMyApplications = () =>
  jobApplicationAPI
    .get<ApiResponse<JobApplication[]>>("/my")
    .then((res) => res.data);

export const getApplicationsByJob = (jobId: string) =>
  jobApplicationAPI
    .get<ApiResponse<JobApplication[]>>(`/job/${jobId}`)
    .then((res) => res.data);

    // GET ALL APPLICATIONS
export const getAllApplications = () =>
  jobApplicationAPI.get("/get/all").then((res) => res.data);
export const getApplicationById = (id: string) =>
  jobApplicationAPI
    .get<ApiResponse<JobApplication>>(`/${id}`)
    .then((res) => res.data);

export const updateApplicationStatus = (
  id: string,
  data: UpdateJobApplicationStatusPayload
) =>
  jobApplicationAPI
    .patch<ApiResponse<JobApplication>>(`/${id}/status`, data)
    .then((res) => res.data);

export const deleteApplication = (id: string) =>
  jobApplicationAPI
    .delete<ApiResponse<null>>(`/${id}`)
    .then((res) => res.data);

export default jobApplicationAPI;