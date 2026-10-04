import axios from 'axios';

// Vite reads the live server link from VITE_API_URL when deployed,
// and falls back to localhost only when developing on your machine.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('openforge_token') || sessionStorage.getItem('openforge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;