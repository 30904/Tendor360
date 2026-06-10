import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/roles`,
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

// Role Management API functions
export const roleAPI = {
  // Get all roles with filtering and pagination
  getRoles: async (params = {}) => {
    try {
      const response = await api.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Get role by ID
  getRoleById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  },

  // Create new role
  createRole: async (roleData) => {
    try {
      const response = await api.post('/', roleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update role
  updateRole: async (id, roleData) => {
    try {
      const response = await api.put(`/${id}`, roleData);
      return response.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Delete role
  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  // Copy role
  copyRole: async (id, copyData) => {
    try {
      const response = await api.post(`/${id}/copy`, copyData);
      return response.data;
    } catch (error) {
      console.error('Error copying role:', error);
      throw error;
    }
  },

  // Get role statistics
  getRoleStats: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching role stats:', error);
      throw error;
    }
  },

  // Get available permissions
  getPermissions: async () => {
    try {
      const response = await api.get('/permissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  }
};

export default roleAPI;
