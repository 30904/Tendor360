import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rfpResponseAPI } from '../../services/rfpResponseAPI';

export const fetchRfpResponses = createAsyncThunk(
  'rfpResponse/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.listRfpResponses();
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRfpResponse = createAsyncThunk(
  'rfpResponse/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.getRfpResponse(id);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRfpResponse = createAsyncThunk(
  'rfpResponse/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.createRfpResponse(data);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRfpResponseMetadata = createAsyncThunk(
  'rfpResponse/updateMetadata',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.updateRfpResponse(id, data);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRfpResponse = createAsyncThunk(
  'rfpResponse/delete',
  async (id, { rejectWithValue }) => {
    try {
      await rfpResponseAPI.deleteRfpResponse(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const extractRequirements = createAsyncThunk(
  'rfpResponse/extract',
  async (id, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.extractRequirements(id);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateSection = createAsyncThunk(
  'rfpResponse/generateSection',
  async ({ id, sectionType }, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.generateSection(id, sectionType);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateAllSections = createAsyncThunk(
  'rfpResponse/generateAll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.generateAllSections(id);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateSection = createAsyncThunk(
  'rfpResponse/updateSection',
  async ({ id, sectionId, data }, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.updateSection(id, sectionId, data);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approveSection = createAsyncThunk(
  'rfpResponse/approveSection',
  async ({ id, sectionId, comments }, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.approveSection(id, sectionId, comments);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const validateResponse = createAsyncThunk(
  'rfpResponse/validate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.validateResponse(id);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitResponse = createAsyncThunk(
  'rfpResponse/submit',
  async (id, { rejectWithValue }) => {
    try {
      const response = await rfpResponseAPI.submitResponse(id);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const rfpResponseSlice = createSlice({
  name: 'rfpResponse',
  initialState: {
    items: [],
    currentResponse: null,
    loading: false,
    aiProcessing: false,
    error: null,
  },
  reducers: {
    clearCurrentResponse: (state) => {
      state.currentResponse = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchRfpResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRfpResponses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.rfpResponses || [];
      })
      .addCase(fetchRfpResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch RFP responses';
      })

      // Fetch One
      .addCase(fetchRfpResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRfpResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResponse = action.payload.rfpResponse;
      })
      .addCase(fetchRfpResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch RFP response';
      })

      // Create
      .addCase(createRfpResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRfpResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload.rfpResponse);
        state.currentResponse = action.payload.rfpResponse;
      })
      .addCase(createRfpResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create RFP response';
      })

      // Update Metadata
      .addCase(updateRfpResponseMetadata.fulfilled, (state, action) => {
        if (state.currentResponse && state.currentResponse._id === action.payload.rfpResponse._id) {
          state.currentResponse.metadata = action.payload.rfpResponse.metadata;
        }
        const idx = state.items.findIndex(r => r._id === action.payload.rfpResponse._id);
        if (idx !== -1) {
          state.items[idx].metadata = action.payload.rfpResponse.metadata;
        }
      })

      // Delete
      .addCase(deleteRfpResponse.fulfilled, (state, action) => {
        state.items = state.items.filter(r => r._id !== action.payload);
        if (state.currentResponse && state.currentResponse._id === action.payload) {
          state.currentResponse = null;
        }
      })

      // Phase 1: Extract
      .addCase(extractRequirements.pending, (state) => {
        state.aiProcessing = true;
        state.error = null;
      })
      .addCase(extractRequirements.fulfilled, (state, action) => {
        state.aiProcessing = false;
        if (state.currentResponse) {
          state.currentResponse.extractedRequirements = action.payload.requirements;
          state.currentResponse.metadata.status = 'IN_PROGRESS';
        }
      })
      .addCase(extractRequirements.rejected, (state, action) => {
        state.aiProcessing = false;
        state.error = action.payload?.message || 'Failed to extract requirements';
      })

      // Phase 2: Generate Section
      .addCase(generateSection.pending, (state) => {
        state.aiProcessing = true;
        state.error = null;
      })
      .addCase(generateSection.fulfilled, (state, action) => {
        state.aiProcessing = false;
        if (state.currentResponse) {
          const sectionIdx = state.currentResponse.sections.findIndex(s => s._id === action.payload.section._id);
          if (sectionIdx !== -1) {
            state.currentResponse.sections[sectionIdx] = action.payload.section;
          }
        }
      })
      .addCase(generateSection.rejected, (state, action) => {
        state.aiProcessing = false;
        state.error = action.payload?.message || 'Failed to generate section';
      })

      // Phase 2: Generate All
      .addCase(generateAllSections.pending, (state) => {
        state.aiProcessing = true;
        state.error = null;
      })
      .addCase(generateAllSections.fulfilled, (state, action) => {
        state.aiProcessing = false;
        if (state.currentResponse && action.payload.rfpResponse) {
          state.currentResponse = action.payload.rfpResponse;
        }
      })
      .addCase(generateAllSections.rejected, (state, action) => {
        state.aiProcessing = false;
        state.error = action.payload?.message || 'Failed to generate all sections';
      })

      // Update Section
      .addCase(updateSection.fulfilled, (state, action) => {
        if (state.currentResponse) {
          const sectionIdx = state.currentResponse.sections.findIndex(s => s._id === action.payload.section._id);
          if (sectionIdx !== -1) {
            state.currentResponse.sections[sectionIdx] = action.payload.section;
          }
        }
      })

      // Approve Section
      .addCase(approveSection.fulfilled, (state, action) => {
        if (state.currentResponse) {
          const sectionIdx = state.currentResponse.sections.findIndex(s => s._id === action.payload.section._id);
          if (sectionIdx !== -1) {
            state.currentResponse.sections[sectionIdx] = action.payload.section;
          }
        }
      })

      // Validate Response
      .addCase(validateResponse.fulfilled, (state, action) => {
        if (state.currentResponse) {
          state.currentResponse.complianceAudit = action.payload.complianceAudit;
        }
      })

      // Submit
      .addCase(submitResponse.fulfilled, (state, action) => {
        if (state.currentResponse) {
          state.currentResponse.metadata.status = 'SUBMITTED';
        }
        const idx = state.items.findIndex(r => r._id === action.payload.rfpResponse._id);
        if (idx !== -1) {
          state.items[idx].metadata.status = 'SUBMITTED';
        }
      });
  }
});

export const { clearCurrentResponse, clearError } = rfpResponseSlice.actions;

export default rfpResponseSlice.reducer;
