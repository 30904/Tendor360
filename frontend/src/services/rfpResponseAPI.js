import api from './authAPI';

export const rfpResponseAPI = {
  // CRUD
  listRfpResponses: () => api.get('/rfp-responses'),
  getRfpResponse: (id) => api.get(`/rfp-responses/${id}`),
  createRfpResponse: (data) => api.post('/rfp-responses', data),
  updateRfpResponse: (id, data) => api.put(`/rfp-responses/${id}`, data),
  deleteRfpResponse: (id) => api.delete(`/rfp-responses/${id}`),

  // AI Pipeline
  extractRequirements: (id) => api.post(`/rfp-responses/${id}/extract`),
  generateSection: (id, sectionType) => api.post(`/rfp-responses/${id}/generate/${sectionType}`),
  generateAllSections: (id) => api.post(`/rfp-responses/${id}/generate-all`),

  // Section Management
  updateSection: (id, sectionId, data) => api.put(`/rfp-responses/${id}/sections/${sectionId}`, data),
  approveSection: (id, sectionId, comments) => api.post(`/rfp-responses/${id}/sections/${sectionId}/approve`, { comments }),

  // Validation & Submission
  validateResponse: (id) => api.post(`/rfp-responses/${id}/validate`),
  submitResponse: (id) => api.post(`/rfp-responses/${id}/submit`),
};
