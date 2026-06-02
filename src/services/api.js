import axios from "axios";
import { getToken, logout } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  withCredentials: true,                    // ← Very Important for Sanctum
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
  error.response?.status === 401 &&
  !error.config?.url?.includes("/auth/login") &&
  !error.config?.url?.includes("/auth/admin/login")
) {
  logout();
}
    return Promise.reject(error);
  }
);

export default api;