import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import tenderAPI from '../../services/tenderAPI'
import { toast } from 'react-toastify'

// Async thunks
export const fetchTenders = createAsyncThunk(
  'tenders/fetchTenders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { filters = {}, pagination = {}, sorting = {} } = params
      const queryParams = { ...filters, ...pagination, ...sorting }
      const response = await tenderAPI.getTenders(queryParams)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tenders')
    }
  }
)

export const fetchTenderStats = createAsyncThunk(
  'tenders/fetchTenderStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tenderAPI.getTenderStats()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tender stats')
    }
  }
)

// Remove this thunk as we don't have getPipelineStats in our API

export const createTender = createAsyncThunk(
  'tenders/createTender',
  async (tenderData, { rejectWithValue }) => {
    try {
      const response = await tenderAPI.createTender(tenderData)
      toast.success('Tender created successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create tender')
      return rejectWithValue(error.response?.data?.message || 'Failed to create tender')
    }
  }
)

export const updateTender = createAsyncThunk(
  'tenders/updateTender',
  async ({ id, tenderData }, { rejectWithValue }) => {
    try {
      const response = await tenderAPI.updateTender(id, tenderData)
      toast.success('Tender updated successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update tender')
      return rejectWithValue(error.response?.data?.message || 'Failed to update tender')
    }
  }
)

export const deleteTender = createAsyncThunk(
  'tenders/deleteTender',
  async (id, { rejectWithValue }) => {
    try {
      await tenderAPI.deleteTender(id)
      toast.success('Tender deleted successfully!')
      return id
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete tender')
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tender')
    }
  }
)

export const addNote = createAsyncThunk(
  'tenders/addNote',
  async ({ id, noteContent }, { rejectWithValue }) => {
    try {
      const response = await tenderAPI.addNote(id, noteContent)
      toast.success('Note added successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add note')
      return rejectWithValue(error.response?.data?.message || 'Failed to add note')
    }
  }
)

export const updatePipelineStage = createAsyncThunk(
  'tenders/updatePipelineStage',
  async ({ id, pipelineStage }, { rejectWithValue }) => {
    try {
      const response = await tenderAPI.updatePipelineStage(id, pipelineStage)
      toast.success('Pipeline stage updated successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pipeline stage')
      return rejectWithValue(error.response?.data?.message || 'Failed to update pipeline stage')
    }
  }
)

// Remove this thunk as we don't have assignTender in our API

// Remove this thunk as we don't have exportTenders in our API

const initialState = {
  tenders: [],
  stats: {
    totalTenders: 0,
    totalValue: 0,
    avgProbability: 0,
    upcomingDeadlines: 0
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  },
  loading: false,
  error: null
}

const tenderSlice = createSlice({
  name: 'tenders',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tenders
      .addCase(fetchTenders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTenders.fulfilled, (state, action) => {
        state.loading = false
        state.tenders = action.payload.tenders
        state.pagination = action.payload.pagination
      })
      .addCase(fetchTenders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch tender stats
      .addCase(fetchTenderStats.fulfilled, (state, action) => {
        state.stats = action.payload.overview
      })
      
      // Create tender
      .addCase(createTender.fulfilled, (state, action) => {
        state.tenders.unshift(action.payload.tender)
        state.stats.totalTenders += 1
      })
      
      // Update tender
      .addCase(updateTender.fulfilled, (state, action) => {
        const index = state.tenders.findIndex(t => t.id === action.payload.tender.id)
        if (index !== -1) {
          state.tenders[index] = action.payload.tender
        }
      })
      
      // Delete tender
      .addCase(deleteTender.fulfilled, (state, action) => {
        state.tenders = state.tenders.filter(t => t.id !== action.payload)
        state.stats.totalTenders = Math.max(0, state.stats.totalTenders - 1)
      })
      
      // Add note
      .addCase(addNote.fulfilled, (state, action) => {
        const index = state.tenders.findIndex(t => t.id === action.payload.tender.id)
        if (index !== -1) {
          state.tenders[index] = action.payload.tender
        }
      })
      
      // Update pipeline stage
      .addCase(updatePipelineStage.fulfilled, (state, action) => {
        const index = state.tenders.findIndex(t => t.id === action.payload.tender.id)
        if (index !== -1) {
          state.tenders[index] = action.payload.tender
        }
      })
  }
})

export const { 
  setCurrentPage, 
  clearError 
} = tenderSlice.actions

export default tenderSlice.reducer
