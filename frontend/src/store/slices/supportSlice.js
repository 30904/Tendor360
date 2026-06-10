import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supportAPI } from '../../services/supportAPI';
import { toast } from 'react-toastify';

// ==================== ASYNC THUNKS ====================

// Fetch tickets
export const fetchTickets = createAsyncThunk(
  'support/fetchTickets',
  async (params, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getTickets(params);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to fetch tickets';
      return rejectWithValue(typeof errorMessage === 'string' ? errorMessage : 'Failed to fetch tickets');
    }
  }
);

// Fetch single ticket
export const fetchTicket = createAsyncThunk(
  'support/fetchTicket',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getTicket(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch ticket');
    }
  }
);

// Create ticket
export const createTicket = createAsyncThunk(
  'support/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await supportAPI.createTicket(ticketData);
      const body = response.data;
      toast.success(body?.message || 'Support ticket created successfully');
      return body?.data || body;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket');
      return rejectWithValue(error.response?.data || 'Failed to create ticket');
    }
  }
);

// Update ticket
export const updateTicket = createAsyncThunk(
  'support/updateTicket',
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await supportAPI.updateTicket(id, ticketData);
      toast.success('Ticket updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update ticket');
      return rejectWithValue(error.response?.data || 'Failed to update ticket');
    }
  }
);

// Add message to ticket
export const addMessage = createAsyncThunk(
  'support/addMessage',
  async ({ id, messageData }, { rejectWithValue }) => {
    try {
      const response = await supportAPI.addMessage(id, messageData);
      toast.success('Message added successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add message');
      return rejectWithValue(error.response?.data || 'Failed to add message');
    }
  }
);

// Fetch ticket statistics
export const fetchTicketStats = createAsyncThunk(
  'support/fetchTicketStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getTicketStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch ticket statistics');
    }
  }
);

// Fetch FAQs
export const fetchFAQs = createAsyncThunk(
  'support/fetchFAQs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getFAQs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch FAQs');
    }
  }
);

// Fetch single FAQ
export const fetchFAQ = createAsyncThunk(
  'support/fetchFAQ',
  async (id, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getFAQ(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch FAQ');
    }
  }
);

// Create FAQ
export const createFAQ = createAsyncThunk(
  'support/createFAQ',
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await supportAPI.createFAQ(faqData);
      toast.success('FAQ created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create FAQ');
      return rejectWithValue(error.response?.data || 'Failed to create FAQ');
    }
  }
);

// Update FAQ
export const updateFAQ = createAsyncThunk(
  'support/updateFAQ',
  async ({ id, faqData }, { rejectWithValue }) => {
    try {
      const response = await supportAPI.updateFAQ(id, faqData);
      toast.success('FAQ updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update FAQ');
      return rejectWithValue(error.response?.data || 'Failed to update FAQ');
    }
  }
);

// Mark FAQ as helpful/not helpful
export const markFAQHelpful = createAsyncThunk(
  'support/markFAQHelpful',
  async ({ id, helpful }, { rejectWithValue }) => {
    try {
      const response = await supportAPI.markFAQHelpful(id, helpful);
      return { id, helpful };
    } catch (error) {
      toast.error('Failed to record feedback');
      return rejectWithValue(error.response?.data || 'Failed to record feedback');
    }
  }
);

// Fetch support dashboard
export const fetchSupportDashboard = createAsyncThunk(
  'support/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await supportAPI.getDashboard();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard');
    }
  }
);

// ==================== INITIAL STATE ====================

const initialState = {
  // Tickets
  tickets: [],
  currentTicket: null,
  ticketStats: null,
  
  // FAQs
  faqs: [],
  currentFAQ: null,
  
  // Dashboard
  dashboard: null,
  
  // Filters and pagination
  filters: {
    status: '',
    priority: '',
    category: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
    hasNext: false,
    hasPrev: false
  },
  
  // UI state - separate loading states to prevent conflicts
  loading: false,
  dashboardLoading: false,
  ticketsLoading: false,
  faqsLoading: false,
  error: null,
  success: null,
  
  // Modals
  modals: {
    showCreateTicket: false,
    showEditTicket: false,
    showTicketView: false,
    showCreateFAQ: false,
    showEditFAQ: false,
    showFAQView: false
  }
};

// ==================== SLICE ====================

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    // Clear messages
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        status: '',
        priority: '',
        category: '',
        search: ''
      };
      state.pagination.currentPage = 1;
    },
    
    // Set current page
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    // Set modal state
    setModal: (state, action) => {
      const { modal, show } = action.payload;
      state.modals[modal] = show;
    },
    
    // Set current ticket
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload;
    },
    
    // Set current FAQ
    setCurrentFAQ: (state, action) => {
      state.currentFAQ = action.payload;
    },
    
    // Update ticket in list
    updateTicketInList: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.tickets.findIndex(ticket => ticket._id === id);
      if (index !== -1) {
        state.tickets[index] = { ...state.tickets[index], ...updates };
      }
    },
    
    // Update FAQ in list
    updateFAQInList: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.faqs.findIndex(faq => faq._id === id);
      if (index !== -1) {
        state.faqs[index] = { ...state.faqs[index], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // ==================== TICKET THUNKS ====================
      
      // Fetch tickets
      .addCase(fetchTickets.pending, (state) => {
        state.ticketsLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.ticketsLoading = false;
        // console.log('🔍 Redux: fetchTickets fulfilled with payload:', action.payload);
        
        // Handle the actual API response structure: { success: true, data: { tickets: [...], pagination: {...} } }
        if (action.payload && action.payload.success && action.payload.data && Array.isArray(action.payload.data.tickets)) {
          state.tickets = action.payload.data.tickets;
          state.pagination = action.payload.data.pagination;
        } else if (action.payload && action.payload.data && Array.isArray(action.payload.data.tickets)) {
          // Fallback without success wrapper
          state.tickets = action.payload.data.tickets;
          state.pagination = action.payload.data.pagination;
        } else if (action.payload && Array.isArray(action.payload.tickets)) {
          // Direct tickets property
          state.tickets = action.payload.tickets;
          state.pagination = action.payload.pagination;
        } else if (action.payload && Array.isArray(action.payload)) {
          // Direct array response
          state.tickets = action.payload;
          state.pagination = null;
        } else {
          // console.warn('⚠️ Redux: Unexpected tickets response structure:', action.payload);
          state.tickets = [];
          state.pagination = null;
        }
        
        // console.log('🔍 Redux: Tickets state updated, count:', state.tickets.length);
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.ticketsLoading = false;
        state.error = action.payload;
        // console.error('❌ Redux: fetchTickets rejected with error:', action.payload);
      })
      
      // Fetch single ticket
      .addCase(fetchTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload.ticket;
      })
      .addCase(fetchTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.unshift(action.payload.ticket);
        state.modals.showCreateTicket = false;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update ticket
      .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload.ticket;
        
        // Update in tickets list
        const index = state.tickets.findIndex(ticket => ticket._id === updatedTicket._id);
        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
        
        // Update current ticket if it's the same
        if (state.currentTicket && state.currentTicket._id === updatedTicket._id) {
          state.currentTicket = updatedTicket;
        }
        
        state.modals.showEditTicket = false;
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add message
      .addCase(addMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMessage.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload.ticket;
        
        // Update in tickets list
        const index = state.tickets.findIndex(ticket => ticket._id === updatedTicket._id);
        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
        
        // Update current ticket if it's the same
        if (state.currentTicket && state.currentTicket._id === updatedTicket._id) {
          state.currentTicket = updatedTicket;
        }
      })
      .addCase(addMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch ticket statistics
      .addCase(fetchTicketStats.pending, (state) => {
        state.ticketsLoading = true;
        state.error = null;
      })
      .addCase(fetchTicketStats.fulfilled, (state, action) => {
        state.ticketsLoading = false;
        // console.log('🔍 Redux: fetchTicketStats fulfilled with payload:', action.payload);
        
        // Handle the actual API response structure: { success: true, data: { stats: {...} } }
        if (action.payload && action.payload.success && action.payload.data && action.payload.data.stats) {
          state.ticketStats = action.payload.data.stats;
        } else if (action.payload && action.payload.data && action.payload.data.stats) {
          // Fallback without success wrapper
          state.ticketStats = action.payload.data.stats;
        } else if (action.payload && action.payload.stats) {
          // Direct stats property
          state.ticketStats = action.payload.stats;
        } else if (action.payload && action.payload.data) {
          // Direct data property
          state.ticketStats = action.payload.data;
        } else if (action.payload) {
          // Direct payload
          state.ticketStats = action.payload;
        } else {
          // console.warn('⚠️ Redux: Unexpected ticketStats response structure:', action.payload);
          state.ticketStats = null;
        }
        
        // console.log('🔍 Redux: TicketStats state updated:', state.ticketStats);
      })
      .addCase(fetchTicketStats.rejected, (state, action) => {
        state.ticketsLoading = false;
        state.error = action.payload;
        // console.error('❌ Redux: fetchTicketStats rejected with error:', action.payload);
      })
      
      // ==================== FAQ THUNKS ====================
      
      // Fetch FAQs
      .addCase(fetchFAQs.pending, (state) => {
        state.faqsLoading = true;
        state.error = null;
      })
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.faqsLoading = false;
        // console.log('🔍 Redux: fetchFAQs fulfilled with payload:', action.payload);
        
        // Handle the actual API response structure: { success: true, data: { faqs: [...] } }
        if (action.payload && action.payload.success && action.payload.data && Array.isArray(action.payload.data.faqs)) {
          state.faqs = action.payload.data.faqs;
        } else if (action.payload && action.payload.data && Array.isArray(action.payload.data.faqs)) {
          // Fallback without success wrapper
          state.faqs = action.payload.data.faqs;
        } else if (action.payload && Array.isArray(action.payload.faqs)) {
          // Direct faqs property
          state.faqs = action.payload.faqs;
        } else if (action.payload && Array.isArray(action.payload)) {
          // Direct array response
          state.faqs = action.payload;
        } else {
          // console.warn('⚠️ Redux: Unexpected FAQ response structure:', action.payload);
          state.faqs = [];
        }
        
        // console.log('🔍 Redux: FAQs state updated, count:', state.faqs.length);
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.faqsLoading = false;
        state.error = action.payload;
        // console.error('❌ Redux: fetchFAQs rejected with error:', action.payload);
      })
      
      // Fetch single FAQ
      .addCase(fetchFAQ.pending, (state) => {
        state.faqsLoading = true;
        state.error = null;
      })
      .addCase(fetchFAQ.fulfilled, (state, action) => {
        state.faqsLoading = false;
        state.currentFAQ = action.payload.faq;
      })
      .addCase(fetchFAQ.rejected, (state, action) => {
        state.faqsLoading = false;
        state.error = action.payload;
      })
      
      // Create FAQ
      .addCase(createFAQ.pending, (state) => {
        state.faqsLoading = true;
        state.error = null;
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.faqsLoading = false;
        state.faqs.unshift(action.payload.faq);
        state.modals.showCreateFAQ = false;
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.faqsLoading = false;
        state.error = action.payload;
      })
      
      // Update FAQ
      .addCase(updateFAQ.pending, (state) => {
        state.faqsLoading = true;
        state.error = null;
      })
      .addCase(updateFAQ.fulfilled, (state, action) => {
        state.faqsLoading = false;
        const updatedFAQ = action.payload.faq;
        
        // Update in FAQs list
        const index = state.faqs.findIndex(faq => faq._id === updatedFAQ._id);
        if (index !== -1) {
          state.faqs[index] = updatedFAQ;
        }
        
        // Update current FAQ if it's the same
        if (state.currentFAQ && state.currentFAQ._id === updatedFAQ._id) {
          state.currentFAQ = updatedFAQ;
        }
        
        state.modals.showEditFAQ = false;
      })
      .addCase(updateFAQ.rejected, (state, action) => {
        state.faqsLoading = false;
        state.error = action.payload;
      })
      
      // Mark FAQ helpful
      .addCase(markFAQHelpful.fulfilled, (state, action) => {
        const { id, helpful } = action.payload;
        const faq = state.faqs.find(f => f._id === id);
        if (faq) {
          if (helpful) {
            faq.helpfulCount += 1;
          } else {
            faq.notHelpfulCount += 1;
          }
        }
        
        if (state.currentFAQ && state.currentFAQ._id === id) {
          if (helpful) {
            state.currentFAQ.helpfulCount += 1;
          } else {
            state.currentFAQ.notHelpfulCount += 1;
          }
        }
      })
      
      // ==================== DASHBOARD THUNKS ====================
      
      // Fetch dashboard
      .addCase(fetchSupportDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        // console.log('🔍 Redux: fetchSupportDashboard fulfilled with payload:', action.payload);
        
        // Handle the actual API response structure: { success: true, data: { dashboard: {...} } }
        if (action.payload && action.payload.success && action.payload.data && action.payload.data.dashboard) {
          state.dashboard = action.payload.data.dashboard;
        } else if (action.payload && action.payload.data && action.payload.data.dashboard) {
          // Fallback without success wrapper
          state.dashboard = action.payload.data.dashboard;
        } else if (action.payload && action.payload.dashboard) {
          // Direct dashboard property
          state.dashboard = action.payload.dashboard;
        } else if (action.payload && action.payload.data) {
          // Direct data property
          state.dashboard = action.payload.data;
        } else if (action.payload) {
          // Direct payload
          state.dashboard = action.payload;
        } else {
          // console.warn('⚠️ Redux: Unexpected dashboard response structure:', action.payload);
          state.dashboard = null;
        }
        
        // console.log('🔍 Redux: Dashboard state updated:', state.dashboard);
      })
      .addCase(fetchSupportDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
        // console.error('❌ Redux: fetchSupportDashboard rejected with error:', action.payload);
      });
  }
});

// ==================== EXPORTS ====================

export const {
  clearError,
  clearSuccess,
  setFilters,
  clearFilters,
  setCurrentPage,
  setModal,
  setCurrentTicket,
  setCurrentFAQ,
  updateTicketInList,
  updateFAQInList
} = supportSlice.actions;

export default supportSlice.reducer;
