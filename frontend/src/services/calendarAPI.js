import api from './authAPI';

// Calendar API service
export const calendarAPI = {
  // Get all events with filters and pagination
  getEvents: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.priority) queryParams.append('priority', params.priority);
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    const url = queryString ? `/calendar/events?${queryString}` : '/calendar/events';
    
    return api.get(url);
  },

  // Get event by ID
  getEvent: (id) => {
    return api.get(`/calendar/events/${id}`);
  },

  // Create new event
  createEvent: (eventData) => {
    return api.post('/calendar/events', eventData);
  },

  // Update event
  updateEvent: (id, eventData) => {
    return api.put(`/calendar/events/${id}`, eventData);
  },

  // Delete event
  deleteEvent: (id) => {
    return api.delete(`/calendar/events/${id}`);
  },

  // Get events for a specific date range
  getEventsByDateRange: (startDate, endDate) => {
    return api.get('/calendar/events/date-range', {
      params: { startDate, endDate }
    });
  },

  // Get upcoming events
  getUpcomingEvents: (days = 7) => {
    return api.get('/calendar/events/upcoming', {
      params: { days }
    });
  },

  // Get overdue events
  getOverdueEvents: () => {
    return api.get('/calendar/events/overdue');
  },

  // Get events by status
  getEventsByStatus: (status) => {
    return api.get('/calendar/events/status', {
      params: { status }
    });
  },

  // Get events by priority
  getEventsByPriority: (priority) => {
    return api.get('/calendar/events/priority', {
      params: { priority }
    });
  },

  // Get events by type
  getEventsByType: (type) => {
    return api.get('/calendar/events/type', {
      params: { type }
    });
  },

  // Search events
  searchEvents: (query) => {
    return api.get('/calendar/events/search', {
      params: { q: query }
    });
  },

  // Get calendar statistics
  getCalendarStats: () => {
    return api.get('/calendar/stats');
  },

  // Bulk update events
  bulkUpdateEvents: (eventIds, updateData) => {
    return api.put('/calendar/events/bulk-update', {
      eventIds,
      updateData
    });
  },

  // Bulk delete events
  bulkDeleteEvents: (eventIds) => {
    return api.delete('/calendar/events/bulk-delete', {
      data: { eventIds }
    });
  },

  // Export events
  exportEvents: (format = 'csv', filters = {}) => {
    return api.get('/calendar/events/export', {
      params: { format, ...filters },
      responseType: 'blob'
    });
  },

  // Import events
  importEvents: (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add options to form data
    Object.keys(options).forEach(key => {
      formData.append(key, options[key]);
    });
    
    return api.post('/calendar/events/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get recurring event templates
  getRecurringTemplates: () => {
    return api.get('/calendar/events/recurring-templates');
  },

  // Create recurring event
  createRecurringEvent: (templateData) => {
    return api.post('/calendar/events/recurring', templateData);
  },

  // Get event reminders
  getEventReminders: (eventId) => {
    return api.get(`/calendar/events/${eventId}/reminders`);
  },

  // Set event reminder
  setEventReminder: (eventId, reminderData) => {
    return api.post(`/calendar/events/${eventId}/reminders`, reminderData);
  },

  // Update event reminder
  updateEventReminder: (eventId, reminderId, reminderData) => {
    return api.put(`/calendar/events/${eventId}/reminders/${reminderId}`, reminderData);
  },

  // Delete event reminder
  deleteEventReminder: (eventId, reminderId) => {
    return api.delete(`/calendar/events/${eventId}/reminders/${reminderId}`);
  },

  // Get event attendees
  getEventAttendees: (eventId) => {
    return api.get(`/calendar/events/${eventId}/attendees`);
  },

  // Add event attendee
  addEventAttendee: (eventId, attendeeData) => {
    return api.post(`/calendar/events/${eventId}/attendees`, attendeeData);
  },

  // Remove event attendee
  removeEventAttendee: (eventId, attendeeId) => {
    return api.delete(`/calendar/events/${eventId}/attendees/${attendeeId}`);
  },

  // Update attendee response
  updateAttendeeResponse: (eventId, attendeeId, response) => {
    return api.put(`/calendar/events/${eventId}/attendees/${attendeeId}/response`, {
      response
    });
  },

  // Get event comments
  getEventComments: (eventId) => {
    return api.get(`/calendar/events/${eventId}/comments`);
  },

  // Add event comment
  addEventComment: (eventId, commentData) => {
    return api.post(`/calendar/events/${eventId}/comments`, commentData);
  },

  // Update event comment
  updateEventComment: (eventId, commentId, commentData) => {
    return api.put(`/calendar/events/${eventId}/comments/${commentId}`, commentData);
  },

  // Delete event comment
  deleteEventComment: (eventId, commentId) => {
    return api.delete(`/calendar/events/${eventId}/comments/${commentId}`);
  },

  // Get event attachments
  getEventAttachments: (eventId) => {
    return api.get(`/calendar/events/${eventId}/attachments`);
  },

  // Upload event attachment
  uploadEventAttachment: (eventId, file, description = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    
    return api.post(`/calendar/events/${eventId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete event attachment
  deleteEventAttachment: (eventId, attachmentId) => {
    return api.delete(`/calendar/events/${eventId}/attachments/${attachmentId}`);
  },

  // Get event history
  getEventHistory: (eventId) => {
    return api.get(`/calendar/events/${eventId}/history`);
  },

  // Restore event from history
  restoreEvent: (eventId, historyId) => {
    return api.post(`/calendar/events/${eventId}/restore`, {
      historyId
    });
  },

  // Get calendar settings
  getCalendarSettings: () => {
    return api.get('/calendar/settings');
  },

  // Update calendar settings
  updateCalendarSettings: (settings) => {
    return api.put('/calendar/settings', settings);
  },

  // Get user calendar preferences
  getUserPreferences: () => {
    return api.get('/calendar/preferences');
  },

  // Update user calendar preferences
  updateUserPreferences: (preferences) => {
    return api.put('/calendar/preferences', preferences);
  },

  // Sync with external calendar
  syncExternalCalendar: (provider, credentials) => {
    return api.post('/calendar/sync', {
      provider,
      credentials
    });
  },

  // Get sync status
  getSyncStatus: (provider) => {
    return api.get('/calendar/sync/status', {
      params: { provider }
    });
  },

  // Disconnect external calendar
  disconnectExternalCalendar: (provider) => {
    return api.delete('/calendar/sync', {
      params: { provider }
    });
  }
};
