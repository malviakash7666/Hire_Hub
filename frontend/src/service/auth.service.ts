import axios from "axios";

/* ================= TYPES ================= */

export type UserRole = "job_poster" | "job_seeker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "admin">;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSuccessResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface GetMeResponse {
  success: boolean;
  user: User;
}

export interface RefreshTokenResponse {
  success: boolean;
  user?: User;
}

/* ================= AXIOS INSTANCE ================= */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const authAPI = axios.create({
  baseURL: `${BACKEND_URL}/api/auth`,
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */

authAPI.interceptors.request.use((config) => {
  // ✅ token cookie automatically send hogi
  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */

authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      throw error;
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/register") &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // ✅ refresh token cookie backend ko jayegi
        await authAPI.post<RefreshTokenResponse>("/refresh-token");

        // ✅ backend new access token cookie set karega
        return authAPI(originalRequest);
      } catch (refreshError) {
        throw refreshError;
      }
    }

    throw error;
  }
);

/* ================= API METHODS ================= */

// REGISTER
export const registerUser = async (data: RegisterPayload) => {
  const res = await authAPI.post<AuthSuccessResponse>("/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data: LoginPayload) => {
  const res = await authAPI.post<AuthSuccessResponse>("/login", data);
  return res.data;
};

// LOGOUT
export const logoutUser = async () => {
  const res = await authAPI.post<AuthSuccessResponse>("/logout");
  return res.data;
};

// GET ME
export const getMe = async () => {
  const res = await authAPI.get<GetMeResponse>("/me");
  return res.data;
};

// REFRESH TOKEN
export const refreshAccessToken = async () => {
  const res = await authAPI.post<RefreshTokenResponse>("/refresh-token");
  return res.data;
};

export default authAPI;