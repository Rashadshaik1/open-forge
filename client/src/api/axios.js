import axios from 'axios';

// Vite reads the live server link from VITE_API_URL when deployed,
// and falls back to localhost only when developing on your machine.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Check all potential token keys saved across login implementations
    const token =
      localStorage.getItem('openforge_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('jwt') ||
      sessionStorage.getItem('openforge_token') ||
      sessionStorage.getItem('token');

    if (token) {
      const cleanToken = token.replace(/^"(.*)"$/, '$1').trim();
      config.headers.Authorization = cleanToken.startsWith('Bearer ')
        ? cleanToken
        : `Bearer ${cleanToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Automatically handle 401s if token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API 401 Unauthorized]: Token is missing, expired, or rejected.');
    }
    return Promise.reject(error);
  }
);

export default api;