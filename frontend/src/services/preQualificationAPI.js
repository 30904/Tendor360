import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api/pre-qualification',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Retry original request
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const preQualificationAPI = {
  // --- Vendor Management ---
  createVendor: (vendorData) => api.post('/', vendorData),
  getVendors: (params) => api.get('/', { params }),
  getVendorById: (id) => api.get(`/${id}`),
  updateVendor: (id, vendorData) => api.put(`/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/${id}`),
  approveVendor: (id, approvalData) => api.post(`/${id}/approve`, approvalData),
  rejectVendor: (id, rejectionData) => api.post(`/${id}/reject`, rejectionData),
  getVendorStats: () => api.get('/stats'),

  // --- Audit Management ---
  createAudit: (auditData) => api.post('/audits', auditData),
  getAudits: (params) => api.get('/audits', { params }),
  getAuditById: (id) => api.get(`/audits/${id}`),
  updateAudit: (id, auditData) => api.put(`/audits/${id}`, auditData),
  deleteAudit: (id) => api.delete(`/audits/${id}`),
  getAuditStats: () => api.get('/audits/stats'),

  // --- Dashboard ---
  getDashboardStats: () => api.get('/dashboard'),
};

export default preQualificationAPI;