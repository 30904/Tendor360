const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Main calendar routes
router.route('/events')
  .get(calendarController.getEvents)
  .post(calendarController.createEvent);

router.route('/events/:id')
  .get(calendarController.getEvent)
  .put(calendarController.updateEvent)
  .delete(calendarController.deleteEvent);

// Specialized calendar routes
router.get('/events/upcoming', calendarController.getUpcomingEvents);
router.get('/events/overdue', calendarController.getOverdueEvents);
router.get('/events/date-range', calendarController.getEventsByDateRange);
router.get('/stats', calendarController.getCalendarStats);

// Event management routes
router.put('/events/:id/complete', calendarController.markEventComplete);
router.post('/events/:id/attendees', calendarController.addAttendee);
router.put('/events/:id/attendees/:attendeeId/response', calendarController.updateAttendeeResponse);
router.post('/events/:id/comments', calendarController.addComment);

// Bulk operations
router.put('/events/bulk-update', calendarController.bulkUpdateEvents);
router.delete('/events/bulk-delete', calendarController.bulkDeleteEvents);

// Export functionality
router.get('/events/export', calendarController.exportEvents);

module.exports = router;
