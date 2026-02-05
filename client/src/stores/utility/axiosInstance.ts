import { socket } from '@/services/socket';
import axios from 'axios';

const api = axios.create({
  // VITE_SERVER_URL is used on production, fallback to '/api' for local development

  baseURL: import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL + '/api'
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 Unauthorized, clear local storage and redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      socket.disconnect();
      // Lazy import to avoid circular dependency
      const { router } = await import('@/router');
      router.push({ name: 'Login' }).catch(() => {
        // Ignore navigation errors
      });
    }
    return Promise.reject(error);
  }
);

export default api;
