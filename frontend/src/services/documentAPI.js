import api from './authAPI';

// Document API service
export const documentAPI = {
  // Get all documents with filters and pagination
  getDocuments: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.type) queryParams.append('type', params.type);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/documents?${queryString}` : '/documents';
    
    return api.get(url);
  },

  // Get document by ID
  getDocument: (id) => {
    return api.get(`/documents/${id}`);
  },

  // Upload document
  uploadDocument: (formData, onUploadProgress) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
  },

  // Process document with AI
  processDocumentAI: (id) => {
    return api.post(`/documents/${id}/process-ai`);
  },

  // Create tender record from extracted document
  createTenderRecord: (id) => {
    return api.post(`/documents/${id}/create-tender`);
  },

  // Update document metadata
  updateDocument: (id, data) => {
    return api.put(`/documents/${id}`, data);
  },

  // Add comment to document
  addComment: (id, text) => {
    return api.post(`/documents/${id}/comments`, { text });
  },

  // Delete document
  deleteDocument: (id) => {
    return api.delete(`/documents/${id}`);
  },

  // Get document statistics
  getDocumentStats: () => {
    return api.get('/documents/stats');
  },

  // Download document
  downloadDocument: (id) => {
    return api.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
  },

  // Preview document (if supported)
  previewDocument: (id) => {
    return api.get(`/documents/${id}/preview`);
  }
};

// Document type options
export const DOCUMENT_TYPES = [
  { value: 'TENDER_DOCUMENT', label: 'Tender Document', icon: '📋' },
  { value: 'CONTRACT', label: 'Contract', icon: '📄' },
  { value: 'SPECIFICATION', label: 'Specification', icon: '📝' },
  { value: 'DRAWING', label: 'Drawing', icon: '📐' },
  { value: 'REPORT', label: 'Report', icon: '📊' },
  { value: 'OTHER', label: 'Other', icon: '📁' }
];

// Document priority options
export const DOCUMENT_PRIORITIES = [
  { value: 'LOW', label: 'Low', color: 'success' },
  { value: 'MEDIUM', label: 'Medium', color: 'warning' },
  { value: 'HIGH', label: 'High', color: 'danger' },
  { value: 'URGENT', label: 'Urgent', color: 'dark' }
];

// Document status options
export const DOCUMENT_STATUSES = [
  { value: 'UPLOADED', label: 'Uploaded', color: 'secondary' },
  { value: 'PROCESSING', label: 'Processing', color: 'info' },
  { value: 'EXTRACTED', label: 'Extracted', color: 'primary' },
  { value: 'REVIEWED', label: 'Reviewed', color: 'warning' },
  { value: 'APPROVED', label: 'Approved', color: 'success' },
  { value: 'REJECTED', label: 'Rejected', color: 'danger' },
  { value: 'ARCHIVED', label: 'Archived', color: 'dark' }
];

// File type icons
export const getFileIcon = (mimeType, fileName) => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || fileName?.endsWith('.doc') || fileName?.endsWith('.docx')) return '📝';
  if (mimeType.includes('excel') || fileName?.endsWith('.xls') || fileName?.endsWith('.xlsx')) return '📊';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('text')) return '📄';
  return '📁';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get status color
export const getStatusColor = (status) => {
  const statusColors = {
    'UPLOADED': 'secondary',
    'PROCESSING': 'info',
    'EXTRACTED': 'primary',
    'REVIEWED': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger',
    'ARCHIVED': 'dark'
  };
  
  return statusColors[status] || 'secondary';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const priorityColors = {
    'LOW': 'success',
    'MEDIUM': 'warning',
    'HIGH': 'danger',
    'URGENT': 'dark'
  };
  
  return priorityColors[priority] || 'secondary';
};
