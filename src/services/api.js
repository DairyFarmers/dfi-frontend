import { AUTH_ENDPOINTS } from '@/constants';
import axios from 'axios';

// axios instance with custom config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for cookies
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token using cookie
        await axios.post(
          `${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
          {},
          { withCredentials: true }
        );

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export { api }; 