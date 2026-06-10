import api from './authAPI';

// Support API service
export const supportAPI = {
  // ==================== TICKET MANAGEMENT ====================
  
  // Get all tickets with filtering and pagination
  getTickets: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.category) queryParams.append('category', params.category);
    if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
    if (params.createdBy) queryParams.append('createdBy', params.createdBy);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/support/tickets?${queryString}` : '/support/tickets';
    
    return api.get(url);
  },

  // Get ticket by ID
  getTicket: (id) => {
    return api.get(`/support/tickets/${id}`);
  },

  // Create new ticket (JSON or FormData with optional attachments)
  createTicket: (ticketData) => {
    if (ticketData instanceof FormData) {
      return api.post('/support/tickets', ticketData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/support/tickets', ticketData);
  },

  // Update ticket
  updateTicket: (id, ticketData) => {
    return api.put(`/support/tickets/${id}`, ticketData);
  },

  // Add message to ticket
  addMessage: (id, messageData) => {
    return api.post(`/support/tickets/${id}/messages`, messageData);
  },

  // Get ticket statistics
  getTicketStats: () => {
    // console.log('🚀 Frontend: Fetching ticket stats...');
    return api.get('/support/tickets/stats/overview');
  },

  // ==================== FAQ MANAGEMENT ====================
  
  // Get all FAQs
  getFAQs: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.category) queryParams.append('category', params.category);
    if (params.subcategory) queryParams.append('subcategory', params.subcategory);
    if (params.search) queryParams.append('search', params.search);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/support/faqs?${queryString}` : '/support/faqs';
    
    return api.get(url);
  },

  // Get FAQ by ID
  getFAQ: (id) => {
    return api.get(`/support/faqs/${id}`);
  },

  // Create FAQ (Admin/Support staff only)
  createFAQ: (faqData) => {
    return api.post('/support/faqs', faqData);
  },

  // Update FAQ (Admin/Support staff only)
  updateFAQ: (id, faqData) => {
    return api.put(`/support/faqs/${id}`, faqData);
  },

  // Mark FAQ as helpful/not helpful
  markFAQHelpful: (id, helpful) => {
    return api.post(`/support/faqs/${id}/feedback`, { helpful });
  },

  // ==================== SUPPORT DASHBOARD ====================
  
  // Get support dashboard data
  getDashboard: () => {
    // console.log('🚀 Frontend: Fetching dashboard data...');
    return api.get('/support/dashboard');
  },

  // ==================== UTILITY FUNCTIONS ====================
  
  // Get ticket priority color
  getPriorityColor: (priority) => {
    const colors = {
      'LOW': 'success',
      'MEDIUM': 'info',
      'HIGH': 'warning',
      'URGENT': 'danger',
      'CRITICAL': 'dark'
    };
    return colors[priority] || 'secondary';
  },

  // Get ticket status color
  getStatusColor: (status) => {
    const colors = {
      'OPEN': 'primary',
      'IN_PROGRESS': 'info',
      'WAITING_FOR_CUSTOMER': 'warning',
      'RESOLVED': 'success',
      'CLOSED': 'secondary',
      'CANCELLED': 'danger'
    };
    return colors[status] || 'secondary';
  },

  // Get ticket category icon
  getCategoryIcon: (category) => {
    const icons = {
      'TECHNICAL': 'bi-tools',
      'BILLING': 'bi-credit-card',
      'FEATURE_REQUEST': 'bi-lightbulb',
      'BUG_REPORT': 'bi-bug',
      'GENERAL': 'bi-question-circle',
      'TRAINING': 'bi-mortarboard',
      'INTEGRATION': 'bi-plug'
    };
    return icons[category] || 'bi-question-circle';
  },

  // Format ticket age
  formatTicketAge: (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  },

  // Get SLA status color
  getSLAStatusColor: (slaStatus) => {
    const colors = {
      'ON_TRACK': 'success',
      'WARNING': 'warning',
      'BREACHED': 'danger',
      'NO_SLA': 'secondary'
    };
    return colors[slaStatus] || 'secondary';
  }
};

export default supportAPI;
