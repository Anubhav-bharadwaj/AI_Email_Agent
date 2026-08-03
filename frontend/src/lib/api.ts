import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock interceptor to simulate network delay for development
api.interceptors.request.use(async (config) => {
  // Uncomment the following line to simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return config;
});

export default api;
