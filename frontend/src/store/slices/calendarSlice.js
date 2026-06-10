import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { calendarAPI } from '../../services/calendarAPI';

// Async thunks
export const fetchCalendarEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await calendarAPI.getEvents();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await calendarAPI.createEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await calendarAPI.updateEvent(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await calendarAPI.deleteEvent(eventId);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete event');
    }
  }
);

// Initial state
const initialState = {
  events: [],
  loading: false,
  error: null,
  success: null,
  filters: {
    status: 'all',
    priority: 'all',
    type: 'all',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  }
};

// Calendar slice
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        status: 'all',
        priority: 'all',
        type: 'all',
        search: ''
      };
    }
  },
  extraReducers: (builder) => {
    // Fetch events
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.events || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
        state.success = 'Event created successfully';
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.success = 'Event updated successfully';
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event._id !== action.payload);
        state.success = 'Event deleted successfully';
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setFilters,
  setCurrentPage,
  resetFilters
} = calendarSlice.actions;

// Export selectors
export const selectCalendarEvents = (state) => state.calendar.events;
export const selectCalendarLoading = (state) => state.calendar.loading;
export const selectCalendarError = (state) => state.calendar.error;
export const selectCalendarSuccess = (state) => state.calendar.success;
export const selectCalendarFilters = (state) => state.calendar.filters;
export const selectCalendarPagination = (state) => state.calendar.pagination;

// Export reducer
export default calendarSlice.reducer;
