import axios from 'axios';

const getBaseUrl = () => {
  const customUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (customUrl) {
    return customUrl.endsWith('/v1') ? customUrl : `${customUrl.replace(/\/$/, '')}/v1`;
  }
  return 'http://localhost:5000/api/v1';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 1. If backend responded with an error payload
    let message = error.response?.data?.message;

    // 2. If express-validator returned validation errors array
    if (!message && error.response?.data?.errors && Array.isArray(error.response.data.errors) && error.response.data.errors.length > 0) {
      const firstErr = error.response.data.errors[0];
      message = typeof firstErr === 'string' ? firstErr : firstErr.msg || firstErr.message;
    }

    // 3. Network or connection failure
    if (!message) {
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        message = 'Unable to connect to the backend server at http://localhost:5000. Please verify the backend is running.';
      } else {
        message = error.message || 'Authentication request failed. Please try again.';
      }
    }

    return Promise.reject({ ...error.response?.data, message });
  }
);

export default api;
