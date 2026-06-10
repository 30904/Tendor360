import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dashboardAPI from '../../services/dashboardAPI'

// Async thunks
export const fetchDashboardOverview = createAsyncThunk(
  'dashboard/fetchOverview',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getOverview()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard overview')
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getStats()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats')
    }
  }
)

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.getRecentActivities(limit)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent activities')
    }
  }
)

export const refreshDashboard = createAsyncThunk(
  'dashboard/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardAPI.refreshDashboard()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh dashboard')
    }
  }
)

const initialState = {
  // Overview data
  kpiData: [],
  activeTenders: [],
  upcomingDeadlines: [],
  lastUpdated: null,
  
  // Statistics
  statusCounts: [],
  valueByStatus: [],
  tendersByMonth: [],
  
  // Recent activities
  recentTenders: [],
  recentDocuments: [],
  recentEvaluations: [],
  
  // Loading states
  overviewLoading: false,
  statsLoading: false,
  activitiesLoading: false,
  refreshLoading: false,
  
  // Error states
  overviewError: null,
  statsError: null,
  activitiesError: null,
  refreshError: null,
  
  // UI state
  isRefreshing: false
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardErrors: (state) => {
      state.overviewError = null
      state.statsError = null
      state.activitiesError = null
      state.refreshError = null
    },
    
    setDashboardLoading: (state, action) => {
      const { type, loading } = action.payload
      switch (type) {
        case 'overview':
          state.overviewLoading = loading
          break
        case 'stats':
          state.statsLoading = loading
          break
        case 'activities':
          state.activitiesLoading = loading
          break
        case 'refresh':
          state.refreshLoading = loading
          break
        default:
          break
      }
    },
    
    resetDashboard: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    // Fetch Overview
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.overviewLoading = true
        state.overviewError = null
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.overviewLoading = false
        state.kpiData = action.payload.kpiData
        state.activeTenders = action.payload.activeTenders
        state.upcomingDeadlines = action.payload.upcomingDeadlines
        state.lastUpdated = action.payload.lastUpdated
      })
      .addCase(fetchDashboardOverview.rejected, (state, action) => {
        state.overviewLoading = false
        state.overviewError = action.payload
      })
    
    // Fetch Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true
        state.statsError = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false
        state.statusCounts = action.payload.statusCounts
        state.valueByStatus = action.payload.valueByStatus
        state.tendersByMonth = action.payload.tendersByMonth
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false
        state.statsError = action.payload
      })
    
    // Fetch Activities
    builder
      .addCase(fetchRecentActivities.pending, (state) => {
        state.activitiesLoading = true
        state.activitiesError = null
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.activitiesLoading = false
        state.recentTenders = action.payload.recentTenders
        state.recentDocuments = action.payload.recentDocuments
        state.recentEvaluations = action.payload.recentEvaluations
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.activitiesLoading = false
        state.activitiesError = action.payload
      })
    
    // Refresh Dashboard
    builder
      .addCase(refreshDashboard.pending, (state) => {
        state.refreshLoading = true
        state.isRefreshing = true
        state.refreshError = null
      })
      .addCase(refreshDashboard.fulfilled, (state, action) => {
        state.refreshLoading = false
        state.isRefreshing = false
        
        // Update all data
        if (action.payload.overview) {
          state.kpiData = action.payload.overview.data.kpiData
          state.activeTenders = action.payload.overview.data.activeTenders
          state.upcomingDeadlines = action.payload.overview.data.upcomingDeadlines
          state.lastUpdated = action.payload.overview.data.lastUpdated
        }
        
        if (action.payload.stats) {
          state.statusCounts = action.payload.stats.data.statusCounts
          state.valueByStatus = action.payload.stats.data.valueByStatus
          state.tendersByMonth = action.payload.stats.data.tendersByMonth
        }
        
        if (action.payload.activities) {
          state.recentTenders = action.payload.activities.data.recentTenders
          state.recentDocuments = action.payload.activities.data.recentDocuments
          state.recentEvaluations = action.payload.activities.data.recentEvaluations
        }
      })
      .addCase(refreshDashboard.rejected, (state, action) => {
        state.refreshLoading = false
        state.isRefreshing = false
        state.refreshError = action.payload
      })
  }
})

export const { 
  clearDashboardErrors, 
  setDashboardLoading, 
  resetDashboard 
} = dashboardSlice.actions

export default dashboardSlice.reducer
