import axios from "axios";
import { config } from "../config";

const api = axios.create({
  baseURL: config.apiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (respose) => respose,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location("/login");
    }
    return Promise.reject(error);
  },
);

export default api;