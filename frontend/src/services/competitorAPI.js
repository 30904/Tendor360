import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/competitors`,
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        if (refreshResponse.data.success) {
          localStorage.setItem('accessToken', refreshResponse.data.data.accessToken);
          // Retry the original request
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const competitorAPI = {
  // Competitor CRUD operations
  getCompetitors: async (params) => {
    try {
      const response = await api.get('/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompetitorById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCompetitor: async (competitorData) => {
    try {
      const response = await api.post('/', competitorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCompetitor: async (id, competitorData) => {
    try {
      const response = await api.put(`/${id}`, competitorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCompetitor: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Competitor statistics
  getCompetitorStats: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Intelligence management
  addIntelligenceNote: async (id, noteData) => {
    try {
      const response = await api.post(`/${id}/intelligence`, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Win/Loss Analysis
  getWinLossAnalysis: async (id, params) => {
    try {
      const response = await api.get(`/${id}/win-loss-analysis`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createWinLossAnalysis: async (id, analysisData) => {
    try {
      const response = await api.post(`/${id}/win-loss-analysis`, analysisData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default competitorAPI;
