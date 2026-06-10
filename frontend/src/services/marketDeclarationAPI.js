import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/market-declarations`,
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

const marketDeclarationAPI = {
  // Market Declaration CRUD operations
  getMarketDeclarations: async (params) => {
    try {
      const response = await api.get('/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMarketDeclarationById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createMarketDeclaration: async (declarationData) => {
    try {
      const response = await api.post('/', declarationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMarketDeclaration: async (id, declarationData) => {
    try {
      const response = await api.put(`/${id}`, declarationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMarketDeclaration: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Market Declaration statistics
  getMarketDeclarationStats: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Market Declaration actions
  publishMarketDeclaration: async (id) => {
    try {
      const response = await api.patch(`/${id}/publish`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  archiveMarketDeclaration: async (id) => {
    try {
      const response = await api.patch(`/${id}/archive`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reviewer management
  addReviewer: async (id, reviewerData) => {
    try {
      const response = await api.post(`/${id}/reviewers`, reviewerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default marketDeclarationAPI;
