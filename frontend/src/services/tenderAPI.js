import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/tenders`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        const { accessToken } = refreshResponse.data.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Tender Management API functions
export const tenderAPI = {
  // Get all tenders with filtering and pagination
  getTenders: async (params = {}) => {
    try {
      const response = await api.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tenders:', error);
      throw error;
    }
  },

  // Get tender by ID
  getTenderById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tender:', error);
      throw error;
    }
  },

  // Create new tender
  createTender: async (tenderData) => {
    try {
      const response = await api.post('/', tenderData);
      return response.data;
    } catch (error) {
      console.error('Error creating tender:', error);
      throw error;
    }
  },

  // Update tender
  updateTender: async (id, tenderData) => {
    try {
      const response = await api.put(`/${id}`, tenderData);
      return response.data;
    } catch (error) {
      console.error('Error updating tender:', error);
      throw error;
    }
  },

  // Delete tender
  deleteTender: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tender:', error);
      throw error;
    }
  },

  // Get tender statistics
  getTenderStats: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching tender stats:', error);
      throw error;
    }
  },

  // Add note to tender
  addTenderNote: async (id, noteData) => {
    try {
      const response = await api.post(`/${id}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding tender note:', error);
      throw error;
    }
  },

  // Update pipeline stage
  updatePipelineStage: async (id, stageData) => {
    try {
      const response = await api.patch(`/${id}/pipeline-stage`, stageData);
      return response.data;
    } catch (error) {
      console.error('Error updating pipeline stage:', error);
      throw error;
    }
  }
};

export default tenderAPI;