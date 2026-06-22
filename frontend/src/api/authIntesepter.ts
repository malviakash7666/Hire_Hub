import axios, { AxiosError } from "axios";
import type {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

type RetryableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export type UserRole = "client" | "writer" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api/auth`,
  withCredentials: true, // ✅ cookies automatically send hongi
});

// REQUEST INTERCEPTOR
API.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url || "";

    const isRefreshCall = requestUrl.includes("/refresh-token");
    const isLoginCall = requestUrl.includes("/login");
    const isRegisterCall = requestUrl.includes("/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshCall &&
      !isLoginCall &&
      !isRegisterCall
    ) {
      originalRequest._retry = true;

      try {
        // ✅ refresh token cookie automatically backend ko jayegi
        await API.post<RefreshResponse>("/refresh-token");

        // ✅ retry original request after backend sets new access token cookie
        return API(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// REGISTER
export const registerUser = async (
  data: RegisterPayload
): Promise<AxiosResponse<AuthResponse>> => {
  return await API.post<AuthResponse>("/register", data);
};

// LOGIN
export const loginUser = async (
  data: LoginPayload
): Promise<AxiosResponse<AuthResponse>> => {
  return await API.post<AuthResponse>("/login", data);
};

// GET ME
export const getMe = () =>
  API.get<{ success: boolean; user: AuthUser }>("/me");

// REFRESH TOKEN
export const refreshToken = async (): Promise<
  AxiosResponse<RefreshResponse>
> => {
  return await API.post<RefreshResponse>("/refresh-token");
};

// LOGOUT
export const logoutUser = async (): Promise<
  AxiosResponse<{ success: boolean; message: string }>
> => {
  return await API.post<{ success: boolean; message: string }>("/logout");
};

export default API;