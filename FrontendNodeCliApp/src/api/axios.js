import axios from "axios";
import { config } from "../config";

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s from normal API requests
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // --------------------------------
        // Refresh is already happening
        // --------------------------------
        if (isRefreshing) {
          console.log("Refresh already running. Waiting...");

          const newToken = await refreshPromise;

          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return api(originalRequest);
        }

        // --------------------------------
        // Start refresh
        // --------------------------------
        isRefreshing = true;

        console.log("Refreshing access token...");

        refreshPromise = api
          .post("/auth/refresh")
          .then((response) => response.data.token);

        // NOW we can use await
        const newToken = await refreshPromise;

        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default api;