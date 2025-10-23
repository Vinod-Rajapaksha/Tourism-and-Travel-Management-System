
import axios from 'axios';
import { handleLogout } from '../context/authHelpers';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// global response handler: if 401 -> logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // token invalid/expired - centralized logout
      handleLogout();
      // optional: show message
      window.alert('Session expired or unauthorized. Please login again.');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
