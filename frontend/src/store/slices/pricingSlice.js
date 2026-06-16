import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pricingAPI from '../../services/pricingAPI';

export const fetchPricingScenarios = createAsyncThunk(
  'pricing/fetchPricingScenarios',
  async (params, { rejectWithValue }) => {
    try {
      const response = await pricingAPI.getPricingScenarios(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pricing scenarios');
    }
  }
);

export const createPricingScenario = createAsyncThunk(
  'pricing/createPricingScenario',
  async (pricingData, { rejectWithValue }) => {
    try {
      const response = await pricingAPI.createPricingScenario(pricingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create pricing scenario');
    }
  }
);

export const updatePricingScenario = createAsyncThunk(
  'pricing/updatePricingScenario',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await pricingAPI.updatePricingScenario(id, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pricing scenario');
    }
  }
);

export const deletePricingScenario = createAsyncThunk(
  'pricing/deletePricingScenario',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pricingAPI.deletePricingScenario(id);
      return { id, message: response.data?.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete pricing scenario');
    }
  }
);

export const predictAIPricing = createAsyncThunk(
  'pricing/predictAIPricing',
  async (tenderId, { rejectWithValue }) => {
    try {
      const response = await pricingAPI.predictAIPricing(tenderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'AI prediction failed');
    }
  }
);

const initialState = {
  scenarios: [],
  loading: false,
  error: null,
  success: false,
  stats: {
    totalScenarios: 0,
    avgMargin: 0,
    avgWinProbability: 0,
    aiConfidence: 0,
    totalValue: 0
  }
};

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPricingScenarios.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPricingScenarios.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload.data || action.payload;
        state.scenarios = payloadData.pricing || [];
        
        // Calculate basic stats for the dashboard
        if (state.scenarios.length > 0) {
          state.stats.totalScenarios = state.scenarios.length;
          state.stats.avgMargin = state.scenarios.reduce((acc, curr) => acc + (curr.totals?.marginPercentage || 0), 0) / state.scenarios.length;
          state.stats.avgWinProbability = state.scenarios.reduce((acc, curr) => acc + (curr.winProbability || 0), 0) / state.scenarios.length;
          state.stats.totalValue = state.scenarios.reduce((acc, curr) => acc + (curr.totals?.price || 0), 0);
          state.stats.aiConfidence = 85; // Mock general AI confidence
        }
      })
      .addCase(fetchPricingScenarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createPricingScenario.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPricingScenario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.pricing) {
          state.scenarios.unshift(payloadData.pricing);
          state.stats.totalScenarios = state.scenarios.length;
          state.stats.totalValue += (payloadData.pricing.totals?.price || 0);
        }
      })
      .addCase(createPricingScenario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updatePricingScenario.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePricingScenario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const payloadData = action.payload.data || action.payload;
        if (payloadData.pricing) {
          const index = state.scenarios.findIndex(s => s._id === payloadData.pricing._id);
          if (index !== -1) {
            state.scenarios[index] = payloadData.pricing;
          }
        }
      })
      .addCase(updatePricingScenario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deletePricingScenario.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePricingScenario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.scenarios = state.scenarios.filter(s => s._id !== action.payload.id);
        state.stats.totalScenarios = state.scenarios.length;
      })
      .addCase(deletePricingScenario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess } = pricingSlice.actions;

export const selectPricingScenarios = (state) => state.pricing.scenarios;
export const selectPricingStats = (state) => state.pricing.stats;
export const selectPricingLoading = (state) => state.pricing.loading;

export default pricingSlice.reducer;
