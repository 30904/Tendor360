import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import evaluationAPI from '../../services/evaluationAPI';

// Async thunks
export const fetchEvaluations = createAsyncThunk(
  'evaluation/fetchEvaluations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.getEvaluations(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluations');
    }
  }
);

export const fetchEvaluation = createAsyncThunk(
  'evaluation/fetchEvaluation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.getEvaluation(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluation');
    }
  }
);

export const predictAIScore = createAsyncThunk(
  'evaluation/predictAIScore',
  async (tenderId, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.predictAIScore(tenderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'AI prediction failed');
    }
  }
);

export const createEvaluation = createAsyncThunk(
  'evaluation/createEvaluation',
  async (evaluationData, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.createEvaluation(evaluationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create evaluation');
    }
  }
);

export const updateEvaluation = createAsyncThunk(
  'evaluation/updateEvaluation',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.updateEvaluation(id, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update evaluation');
    }
  }
);

export const deleteEvaluation = createAsyncThunk(
  'evaluation/deleteEvaluation',
  async (id, { rejectWithValue }) => {
    try {
      await evaluationAPI.deleteEvaluation(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete evaluation');
    }
  }
);

export const submitForReview = createAsyncThunk(
  'evaluation/submitForReview',
  async ({ id, reviewers }, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.submitForReview(id, { reviewers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit evaluation');
    }
  }
);

export const reviewEvaluation = createAsyncThunk(
  'evaluation/reviewEvaluation',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.reviewEvaluation(id, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to review evaluation');
    }
  }
);

export const makeDecision = createAsyncThunk(
  'evaluation/makeDecision',
  async ({ id, decisionData }, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.makeDecision(id, decisionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to make decision');
    }
  }
);

export const fetchEvaluationStats = createAsyncThunk(
  'evaluation/fetchEvaluationStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.getEvaluationStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluation stats');
    }
  }
);

export const fetchQuickDecisions = createAsyncThunk(
  'evaluation/fetchQuickDecisions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.getQuickDecisions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quick decisions');
    }
  }
);

export const fetchEvaluationTemplates = createAsyncThunk(
  'evaluation/fetchEvaluationTemplates',
  async (params, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.getEvaluationTemplates(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch evaluation templates');
    }
  }
);

export const createEvaluationTemplate = createAsyncThunk(
  'evaluation/createEvaluationTemplate',
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await evaluationAPI.createEvaluationTemplate(templateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create evaluation template');
    }
  }
);

// Initial state
const initialState = {
  evaluations: [],
  currentEvaluation: null,
  evaluationTemplates: [],
  stats: {
    overview: {},
    categoryScores: {}
  },
  quickDecisions: {
    recentEvaluations: [],
    pendingDecisions: [],
    urgentEvaluations: []
  },
  filters: {
    status: '',
    decision: '',
    evaluationType: '',
    tenderId: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20
  },
  loading: false,
  error: null,
  success: false
};

// Slice
const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        decision: '',
        evaluationType: '',
        tenderId: ''
      };
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1;
    },
    resetState: (state) => {
      state.evaluations = [];
      state.currentEvaluation = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch evaluations
      .addCase(fetchEvaluations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluations.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        state.evaluations = payloadData.docs || payloadData.evaluations || [];
        state.pagination = {
          currentPage: payloadData.page || 1,
          totalPages: payloadData.totalPages || 1,
          totalItems: payloadData.totalDocs || payloadData.total || 0,
          pageSize: payloadData.limit || 20
        };
      })
      .addCase(fetchEvaluations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single evaluation
      .addCase(fetchEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvaluation = action.payload.evaluation;
      })
      .addCase(fetchEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create evaluation
      .addCase(createEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.evaluation) {
          state.evaluations.unshift(payloadData.evaluation);
        }
        state.success = true;
      })
      .addCase(createEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update evaluation
      .addCase(updateEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.evaluation) {
          const index = state.evaluations.findIndex(e => e._id === payloadData.evaluation._id);
          if (index !== -1) {
            state.evaluations[index] = payloadData.evaluation;
          }
          if (state.currentEvaluation?._id === payloadData.evaluation._id) {
            state.currentEvaluation = payloadData.evaluation;
          }
        }
        state.success = true;
      })
      .addCase(updateEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete evaluation
      .addCase(deleteEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        state.evaluations = state.evaluations.filter(e => e._id !== action.payload);
        if (state.currentEvaluation?._id === action.payload) {
          state.currentEvaluation = null;
        }
        state.success = true;
      })
      .addCase(deleteEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit for review
      .addCase(submitForReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForReview.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.evaluation) {
          const index = state.evaluations.findIndex(e => e._id === payloadData.evaluation._id);
          if (index !== -1) {
            state.evaluations[index] = payloadData.evaluation;
          }
          if (state.currentEvaluation?._id === payloadData.evaluation._id) {
            state.currentEvaluation = payloadData.evaluation;
          }
        }
        state.success = true;
      })
      .addCase(submitForReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Review evaluation
      .addCase(reviewEvaluation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewEvaluation.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.evaluation) {
          const index = state.evaluations.findIndex(e => e._id === payloadData.evaluation._id);
          if (index !== -1) {
            state.evaluations[index] = payloadData.evaluation;
          }
          if (state.currentEvaluation?._id === payloadData.evaluation._id) {
            state.currentEvaluation = payloadData.evaluation;
          }
        }
        state.success = true;
      })
      .addCase(reviewEvaluation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Make decision
      .addCase(makeDecision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeDecision.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.evaluation) {
          const index = state.evaluations.findIndex(e => e._id === payloadData.evaluation._id);
          if (index !== -1) {
            state.evaluations[index] = payloadData.evaluation;
          }
          if (state.currentEvaluation?._id === payloadData.evaluation._id) {
            state.currentEvaluation = payloadData.evaluation;
          }
        }
        state.success = true;
      })
      .addCase(makeDecision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch stats
      .addCase(fetchEvaluationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Fetch quick decisions
      .addCase(fetchQuickDecisions.fulfilled, (state, action) => {
        state.quickDecisions = action.payload;
      })

      // Fetch templates
      .addCase(fetchEvaluationTemplates.fulfilled, (state, action) => {
        state.evaluationTemplates = action.payload.templates;
      })

      // Create template
      .addCase(createEvaluationTemplate.fulfilled, (state, action) => {
        state.evaluationTemplates.unshift(action.payload.template);
        state.success = true;
      });
  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  resetState
} = evaluationSlice.actions;

// Export selectors
export const selectEvaluations = (state) => state.evaluation.evaluations;
export const selectCurrentEvaluation = (state) => state.evaluation.currentEvaluation;
export const selectEvaluationTemplates = (state) => state.evaluation.evaluationTemplates;
export const selectEvaluationStats = (state) => state.evaluation.stats;
export const selectQuickDecisions = (state) => state.evaluation.quickDecisions;
export const selectEvaluationFilters = (state) => state.evaluation.filters;
export const selectEvaluationPagination = (state) => state.evaluation.pagination;
export const selectEvaluationLoading = (state) => state.evaluation.loading;
export const selectEvaluationError = (state) => state.evaluation.error;
export const selectEvaluationSuccess = (state) => state.evaluation.success;

// Export reducer
export default evaluationSlice.reducer;
