const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { requireAuth } = require('../middlewares/auth');

// Apply authentication middleware to all routes
router.use(requireAuth);

// Main calendar routes
router.route('/events')
  .get(calendarController.getEvents)
  .post(calendarController.createEvent);

// Static /events/* routes must be registered before /events/:id
router.get('/events/upcoming', calendarController.getUpcomingEvents);
router.get('/events/overdue', calendarController.getOverdueEvents);
router.get('/events/date-range', calendarController.getEventsByDateRange);
router.get('/events/export', calendarController.exportEvents);
router.put('/events/bulk-update', calendarController.bulkUpdateEvents);
router.delete('/events/bulk-delete', calendarController.bulkDeleteEvents);

router.route('/events/:id')
  .get(calendarController.getEvent)
  .put(calendarController.updateEvent)
  .delete(calendarController.deleteEvent);

// Event management routes
router.put('/events/:id/complete', calendarController.markEventComplete);
router.post('/events/:id/attendees', calendarController.addAttendee);
router.put('/events/:id/attendees/:attendeeId/response', calendarController.updateAttendeeResponse);
router.post('/events/:id/comments', calendarController.addComment);

router.get('/stats', calendarController.getCalendarStats);

module.exports = router;
