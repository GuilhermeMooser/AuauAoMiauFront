import {getViteApiUrl} from "@/config/runtimeEnv";
import {getAuth} from "@/utils/auth";
import axios, {isAxiosError} from "axios";

export const api = axios.create({
  baseURL: getViteApiUrl(),
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes("/auth/v1/login");

    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

//  api.interceptors.request.use(
//   (config) => {
//     const auth = getAuth();
//     if (auth) {
//       config.headers.Authorization = `Bearer ${auth.token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Response interceptor for error handling
