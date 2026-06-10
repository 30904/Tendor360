import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5025/api';

class AIService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/ai`,
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
          console.warn('Authentication failed, redirecting to login');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Don't redirect immediately, let the component handle it
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Start AI analysis of a document
   */
  async analyzeDocument(documentId, analysisType = 'full') {
    try {
      const response = await this.api.post('/analyze', {
        documentId,
        analysisType
      });
      return response.data;
    } catch (error) {
      console.error('Error starting document analysis:', error);
      throw error;
    }
  }

  /**
   * Get analysis results by ID
   */
  async getAnalysisResults(analysisId) {
    try {
      const response = await this.api.get(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting analysis results:', error);
      throw error;
    }
  }

  /**
   * Get all analyses for a document
   */
  async getDocumentAnalyses(documentId, page = 1, limit = 10) {
    if (!documentId || documentId === 'null' || documentId === 'undefined') {
      return Promise.reject(new Error('A valid document ID is required'));
    }
    try {
      const response = await this.api.get(`/document/${documentId}/analyses`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting document analyses:', error);
      throw error;
    }
  }

  /**
   * Get AI analysis statistics
   */
  async getAnalysisStats(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await this.api.get('/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Error getting analysis stats:', error);
      throw error;
    }
  }

  /**
   * Provide feedback on analysis quality
   */
  async provideFeedback(analysisId, feedback) {
    try {
      const response = await this.api.post(`/analysis/${analysisId}/feedback`, feedback);
      return response.data;
    } catch (error) {
      console.error('Error providing feedback:', error);
      throw error;
    }
  }

  /**
   * Delete an analysis
   */
  async deleteAnalysis(analysisId) {
    try {
      const response = await this.api.delete(`/analysis/${analysisId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  /**
   * Legacy AI tender matching (for backward compatibility)
   */
  async matchTender(tenderData) {
    try {
      const response = await this.api.post('/match-tender', tenderData);
      return response.data;
    } catch (error) {
      console.error('Error matching tender:', error);
      throw error;
    }
  }

  /**
   * Legacy AI document suggestions (for backward compatibility)
   */
  async suggestDocuments(tenderData) {
    try {
      const response = await this.api.post('/suggest-documents', tenderData);
      return response.data;
    } catch (error) {
      console.error('Error suggesting documents:', error);
      throw error;
    }
  }
}

export default new AIService();
