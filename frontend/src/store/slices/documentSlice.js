import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentAPI } from '../../services/documentAPI';

// Async thunks
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await documentAPI.getDocuments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch documents');
    }
  }
);

export const fetchDocument = createAsyncThunk(
  'documents/fetchDocument',
  async (id, { rejectWithValue }) => {
    try {
      const response = await documentAPI.getDocument(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch document');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await documentAPI.uploadDocument(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload document');
    }
  }
);

export const processDocumentAI = createAsyncThunk(
  'documents/processDocumentAI',
  async (id, { rejectWithValue }) => {
    try {
      const response = await documentAPI.processDocumentAI(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to process document');
    }
  }
);

export const createTenderRecord = createAsyncThunk(
  'documents/createTenderRecord',
  async (id, { rejectWithValue }) => {
    try {
      const response = await documentAPI.createTenderRecord(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create tender record');
    }
  }
);

export const updateDocument = createAsyncThunk(
  'documents/updateDocument',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await documentAPI.updateDocument(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update document');
    }
  }
);

export const addComment = createAsyncThunk(
  'documents/addComment',
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const response = await documentAPI.addComment(id, text);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add comment');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id, { rejectWithValue }) => {
    try {
      await documentAPI.deleteDocument(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete document');
    }
  }
);

export const fetchDocumentStats = createAsyncThunk(
  'documents/fetchDocumentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await documentAPI.getDocumentStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch document stats');
    }
  }
);

const initialState = {
  documents: [],
  currentDocument: null,
  stats: null,
  filters: {
    status: '',
    type: '',
    priority: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalDocuments: 0,
    hasNext: false,
    hasPrev: false
  },
  loading: false,
  error: null,
  success: null,
  uploadProgress: 0,
  processingDocuments: []
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    addProcessingDocument: (state, action) => {
      state.processingDocuments.push(action.payload);
    },
    removeProcessingDocument: (state, action) => {
      state.processingDocuments = state.processingDocuments.filter(
        id => id !== action.payload
      );
    },
    updateDocumentStatus: (state, action) => {
      const { id, status, aiExtraction } = action.payload;
      const document = state.documents.find(doc => doc._id === id);
      if (document) {
        document.status = status;
        if (aiExtraction) {
          document.aiExtraction = aiExtraction;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Document
      .addCase(fetchDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDocument = action.payload.document;
      })
      .addCase(fetchDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.uploadProgress = 0;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload.document);
        state.success = 'Document uploaded successfully';
        state.uploadProgress = 100;
        
        // Auto-process tender documents
        if (action.payload.document.type === 'TENDER_DOCUMENT') {
          state.processingDocuments.push(action.payload.document._id);
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      
      // Process Document AI
      .addCase(processDocumentAI.pending, (state, action) => {
        const documentId = action.meta.arg;
        state.processingDocuments.push(documentId);
        state.error = null;
      })
      .addCase(processDocumentAI.fulfilled, (state, action) => {
        const documentId = action.meta.arg;
        state.processingDocuments = state.processingDocuments.filter(id => id !== documentId);
        state.success = 'AI processing started successfully';
      })
      .addCase(processDocumentAI.rejected, (state, action) => {
        const documentId = action.meta.arg;
        state.processingDocuments = state.processingDocuments.filter(id => id !== documentId);
        state.error = action.payload;
      })
      
      // Create Tender Record
      .addCase(createTenderRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenderRecord.fulfilled, (state, action) => {
        state.loading = false;
        const { document, tender } = action.payload;
        
        // Update document in list
        const docIndex = state.documents.findIndex(d => d._id === document._id);
        if (docIndex !== -1) {
          state.documents[docIndex] = document;
        }
        
        state.success = 'Tender record created successfully';
      })
      .addCase(createTenderRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Document
      .addCase(updateDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDoc = action.payload.document;
        
        // Update in documents list
        const docIndex = state.documents.findIndex(d => d._id === updatedDoc._id);
        if (docIndex !== -1) {
          state.documents[docIndex] = updatedDoc;
        }
        
        // Update current document if it's the same
        if (state.currentDocument && state.currentDocument._id === updatedDoc._id) {
          state.currentDocument = updatedDoc;
        }
        
        state.success = 'Document updated successfully';
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDoc = action.payload.document;
        
        // Update in documents list
        const docIndex = state.documents.findIndex(d => d._id === updatedDoc._id);
        if (docIndex !== -1) {
          state.documents[docIndex] = updatedDoc;
        }
        
        // Update current document if it's the same
        if (state.currentDocument && state.currentDocument._id === updatedDoc._id) {
          state.currentDocument = updatedDoc;
        }
        
        state.success = 'Comment added successfully';
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Document
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        
        // Remove from documents list
        state.documents = state.documents.filter(d => d._id !== deletedId);
        
        // Clear current document if it's the deleted one
        if (state.currentDocument && state.currentDocument._id === deletedId) {
          state.currentDocument = null;
        }
        
        state.success = 'Document deleted successfully';
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Document Stats
      .addCase(fetchDocumentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchDocumentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setCurrentPage,
  clearError,
  clearSuccess,
  setUploadProgress,
  addProcessingDocument,
  removeProcessingDocument,
  updateDocumentStatus
} = documentSlice.actions;

export default documentSlice.reducer;
