import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/regulatory-compliance`,
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

const regulatoryComplianceAPI = {
  // Statistics
  getStats: async () => {
    try {
      const response = await api.get('/stats/overview');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Regulatory Declarations
  getDeclarations: async (params) => {
    try {
      const response = await api.get('/declarations', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDeclaration: async (declarationData) => {
    try {
      const response = await api.post('/declarations', declarationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDeclaration: async (id, declarationData) => {
    try {
      const response = await api.put(`/declarations/${id}`, declarationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDeclaration: async (id) => {
    try {
      const response = await api.delete(`/declarations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Certificates
  getCertificates: async (params) => {
    try {
      const response = await api.get('/certificates', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCertificate: async (certificateData) => {
    try {
      const response = await api.post('/certificates', certificateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCertificate: async (id, certificateData) => {
    try {
      const response = await api.put(`/certificates/${id}`, certificateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCertificate: async (id) => {
    try {
      const response = await api.delete(`/certificates/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vendors
  getVendors: async (params) => {
    try {
      const response = await api.get('/vendors', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/vendors', vendorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateVendor: async (id, vendorData) => {
    try {
      const response = await api.put(`/vendors/${id}`, vendorData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteVendor: async (id) => {
    try {
      const response = await api.delete(`/vendors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default regulatoryComplianceAPI;
