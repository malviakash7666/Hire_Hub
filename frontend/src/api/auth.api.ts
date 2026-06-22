import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api/auth`,
  withCredentials: true, // ✅ cookies automatically send hongi
});


// REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  // ❌ localStorage token / Authorization header nahi chahiye
  return config;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !requestUrl.includes("/refresh-token") &&
      !requestUrl.includes("/login") &&
      !requestUrl.includes("/register")
    ) {
      originalRequest._retry = true;

      try {
        // ✅ refreshToken cookie automatically backend ko jayegi
        await API.post("/refresh-token");

        // ✅ backend new accessToken cookie set karega
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: "job_poster" | "job_seeker";
};

type LoginPayload = {
  email: string;
  password: string;
};

// REGISTER
export const registerUser = (data: RegisterPayload) =>
  API.post("/register", data);

// LOGIN
export const loginUser = (data: LoginPayload) =>
  API.post("/login", data);

// GET ME
export const getMe = () => API.get("/me");

// REFRESH TOKEN
export const refreshToken = () => API.post("/refresh-token");

// LOGOUT
export const logoutUser = async () => {
  return await API.post("/logout");
};

export default API;