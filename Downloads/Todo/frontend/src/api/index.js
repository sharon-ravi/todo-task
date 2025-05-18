// frontend/src/api/index.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://todo-task-dom9.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;