import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/sources-watchlists`,
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

// Sources & Watchlists Management API functions
export const sourcesWatchlistsAPI = {
  // ==================== STATISTICS ====================
  
  // Get sources and watchlists statistics
  getStats: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching sources watchlists stats:', error);
      throw error;
    }
  },

  // ==================== TENDER SOURCES ====================
  
  // Get all tender sources with filtering and pagination
  getTenderSources: async (params = {}) => {
    try {
      const response = await api.get('/sources', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tender sources:', error);
      throw error;
    }
  },

  // Get tender source by ID
  getTenderSourceById: async (id) => {
    try {
      const response = await api.get(`/sources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tender source:', error);
      throw error;
    }
  },

  // Create new tender source
  createTenderSource: async (sourceData) => {
    try {
      const response = await api.post('/sources', sourceData);
      return response.data;
    } catch (error) {
      console.error('Error creating tender source:', error);
      throw error;
    }
  },

  // Update tender source
  updateTenderSource: async (id, sourceData) => {
    try {
      const response = await api.put(`/sources/${id}`, sourceData);
      return response.data;
    } catch (error) {
      console.error('Error updating tender source:', error);
      throw error;
    }
  },

  // Delete tender source
  deleteTenderSource: async (id) => {
    try {
      const response = await api.delete(`/sources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting tender source:', error);
      throw error;
    }
  },

  // Sync tender source
  syncTenderSource: async (id) => {
    try {
      const response = await api.post(`/sources/${id}/sync`);
      return response.data;
    } catch (error) {
      console.error('Error syncing tender source:', error);
      throw error;
    }
  },

  // ==================== WATCHLISTS ====================
  
  // Get all watchlists with filtering and pagination
  getWatchlists: async (params = {}) => {
    try {
      const response = await api.get('/watchlists', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      throw error;
    }
  },

  // Get watchlist by ID
  getWatchlistById: async (id) => {
    try {
      const response = await api.get(`/watchlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      throw error;
    }
  },

  // Create new watchlist
  createWatchlist: async (watchlistData) => {
    try {
      const response = await api.post('/watchlists', watchlistData);
      return response.data;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      throw error;
    }
  },

  // Update watchlist
  updateWatchlist: async (id, watchlistData) => {
    try {
      const response = await api.put(`/watchlists/${id}`, watchlistData);
      return response.data;
    } catch (error) {
      console.error('Error updating watchlist:', error);
      throw error;
    }
  },

  // Delete watchlist
  deleteWatchlist: async (id) => {
    try {
      const response = await api.delete(`/watchlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting watchlist:', error);
      throw error;
    }
  },

  // Run watchlist
  runWatchlist: async (id) => {
    try {
      const response = await api.post(`/watchlists/${id}/run`);
      return response.data;
    } catch (error) {
      console.error('Error running watchlist:', error);
      throw error;
    }
  },

  // ==================== UTILITIES ====================
  
  // Add note to source or watchlist
  addNote: async (type, id, noteData) => {
    try {
      const response = await api.post(`/${type}/${id}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  }
};

export default sourcesWatchlistsAPI;
