import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

class DocumentService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/documents`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
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

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.warn('Authentication failed for document service');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Don't redirect immediately, let the component handle it
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all documents
   */
  async getDocuments(page = 1, limit = 10, search = '', filters = {}) {
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (filters.fileType) params.fileType = filters.fileType;
      if (filters.category) params.category = filters.category;
      
      const response = await this.api.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(documentId) {
    try {
      const response = await this.api.get(`/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  /**
   * Upload a new document
   */
  async uploadDocument(formData) {
    try {
      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Update document metadata
   */
  async updateDocument(documentId, updateData) {
    try {
      const response = await this.api.put(`/${documentId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId) {
    try {
      const response = await this.api.delete(`/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Download document
   */
  async downloadDocument(documentId) {
    try {
      const response = await this.api.get(`/${documentId}/download`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats() {
    try {
      const response = await this.api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting document stats:', error);
      throw error;
    }
  }
}

export default new DocumentService();
