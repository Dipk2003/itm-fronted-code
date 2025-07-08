import axios from 'axios';
import API_CONFIG from './api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const authHeaders = API_CONFIG.getAuthHeaders();
    config.headers = { ...config.headers, ...authHeaders };
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data
      });
    }
    
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expired or invalid
          localStorage.removeItem('vendorToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access denied');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
