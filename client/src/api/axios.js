// Base Axios instance.
// withCredentials:true is required so the HTTP-only auth cookie is automatically sent with every cross-origin request.

import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies cross-origin
  timeout: 30000, // 30s — file uploads to Cloudinary can be slow
});

/* ───────────────────── Response interceptor ───────────────────── */
// Centralised error handling so individual components don't repeat themselves.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 globally — redirect to login if not already there
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      // Don't toast on /me probes (they're expected to 401 when logged out) and don't toast on auth pages where the user is already logging in.
      const silentPaths = ["/login", "/register", "/forgot-password"];
      if (!silentPaths.some((p) => path.startsWith(p))) {
        console.error("Session expired. Please log in again.");
      }
    }

    // Surface server validation messages
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    error.userMessage = message; // attach for components to use easily
    return Promise.reject(error);
  },
);

export default api;
