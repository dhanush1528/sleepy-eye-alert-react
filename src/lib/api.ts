
import axios from 'axios';

// Create an axios instance with baseURL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Roboflow API for Drowsiness Detection
export const RoboflowAPI = {
  // Detect drowsiness from image data
  detectDrowsiness: async (imageData: string) => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/drosiness-detection/3",
        params: {
          api_key: "315aOgfnEMnRwYmSo03L"
        },
        data: imageData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error in drowsiness detection API:", error);
      throw error;
    }
  }
};

// Detection API
export const DetectionAPI = {
  // Send detection status to backend
  saveDetection: async (status: string, timestamp: Date) => {
    return api.post('/detect', { status, timestamp });
  },
};

// Logs API
export const LogsAPI = {
  // Get detection logs with optional filters
  getLogs: async (filters: { startDate?: string; endDate?: string; status?: string }) => {
    return api.get('/logs', { params: filters });
  },
  
  // Download logs as CSV
  downloadLogs: async (filters: { startDate?: string; endDate?: string; status?: string }) => {
    return api.get('/logs/download', { 
      params: filters,
      responseType: 'blob',
    });
  },
};

// Auth API
export const AuthAPI = {
  // Login user
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Register user
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Settings API
export const SettingsAPI = {
  // Get user settings
  getSettings: async () => {
    return api.get('/settings');
  },
  
  // Update user settings
  updateSettings: async (settings: any) => {
    return api.put('/settings', settings);
  },
};
