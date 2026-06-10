const CalendarEvent = require('../models/Calendar');
const { catchAsync } = require('../utils/errorHandler');

// Get all calendar events with filters and pagination
exports.getEvents = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    type,
    search,
    startDate,
    endDate,
    tenderId,
    category
  } = req.query;

  // Build filter object
  const filter = {
    companyId: req.companyId // Add company filtering
  };
  
  if (status && status !== 'all') filter.status = status;
  if (priority && priority !== 'all') filter.priority = priority;
  if (type && type !== 'all') filter.type = type;
  if (tenderId) filter.tenderId = tenderId;
  if (category) filter.category = category;
  
  if (startDate && endDate) {
    filter.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }
  
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Get user's events (created by user or where user is attendee)
  const userId = req.user._id;
  filter.$or = [
    { createdBy: userId },
    { 'attendees.userId': userId }
  ];

  // Execute query with pagination
  const skip = (page - 1) * limit;
  const events = await CalendarEvent.find(filter)
    .populate('createdBy', 'name email')
    .populate('attendees.userId', 'name email')
    .populate('tenderId', 'title organization')
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await CalendarEvent.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

// Get single event by ID
exports.getEvent = catchAsync(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('attendees.userId', 'name email')
    .populate('tenderId', 'title organization')
    .populate('comments.user', 'name email');

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if user has access to this event
  const userId = req.user._id;
  if (event.createdBy._id.toString() !== userId.toString() && 
      !event.attendees.some(a => a.userId._id.toString() === userId.toString())) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

// Create new event
exports.createEvent = catchAsync(async (req, res) => {
  const eventData = {
    ...req.body,
    createdBy: req.user._id
  };

  const event = await CalendarEvent.create(eventData);
  
  await event.populate('createdBy', 'name email');
  await event.populate('attendees.userId', 'name email');

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: event
  });
});

// Update event
exports.updateEvent = catchAsync(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if user can edit this event
  const userId = req.user._id;
  if (event.createdBy.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only event creator can edit this event'
    });
  }

  const updatedEvent = await CalendarEvent.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      updatedBy: userId
    },
    { new: true, runValidators: true }
  )
    .populate('createdBy', 'name email')
    .populate('attendees.userId', 'name email')
    .populate('tenderId', 'title organization');

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: updatedEvent
  });
});

// Delete event
exports.deleteEvent = catchAsync(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if user can delete this event
  const userId = req.user._id;
  if (event.createdBy.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only event creator can delete this event'
    });
  }

  await CalendarEvent.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});

// Get upcoming events
exports.getUpcomingEvents = catchAsync(async (req, res) => {
  const { days = 7 } = req.query;
  const userId = req.user._id;

  const events = await CalendarEvent.getUpcomingEvents(parseInt(days))
    .populate('createdBy', 'name email')
    .populate('attendees.userId', 'name email')
    .populate('tenderId', 'title organization');

  // Filter events for current user
  const userEvents = events.filter(event => 
    event.createdBy._id.toString() === userId.toString() ||
    event.attendees.some(a => a.userId._id.toString() === userId.toString())
  );

  res.status(200).json({
    success: true,
    data: userEvents
  });
});

// Get overdue events
exports.getOverdueEvents = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const events = await CalendarEvent.getOverdueEvents()
    .populate('createdBy', 'name email')
    .populate('attendees.userId', 'name email')
    .populate('tenderId', 'title organization');

  // Filter events for current user
  const userEvents = events.filter(event => 
    event.createdBy._id.toString() === userId.toString() ||
    event.attendees.some(a => a.userId._id.toString() === userId.toString())
  );

  res.status(200).json({
    success: true,
    data: userEvents
  });
});

// Get events by date range
exports.getEventsByDateRange = catchAsync(async (req, res) => {
  const { startDate, endDate } = req.query;
  const userId = req.user._id;

  if (!startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    });
  }

  const events = await CalendarEvent.getEventsByDateRange(
    new Date(startDate),
    new Date(endDate)
  )
    .populate('createdBy', 'name email')
    .populate('attendees.userId', 'name email')
    .populate('tenderId', 'title organization');

  // Filter events for current user
  const userEvents = events.filter(event => 
    event.createdBy._id.toString() === userId.toString() ||
    event.attendees.some(a => a.userId._id.toString() === userId.toString())
  );

  res.status(200).json({
    success: true,
    data: userEvents
  });
});

// Get calendar statistics
exports.getCalendarStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const stats = await CalendarEvent.getCalendarStats(userId);

  // Get additional stats
  const totalEvents = await CalendarEvent.countDocuments({
    $or: [
      { createdBy: userId },
      { 'attendees.userId': userId }
    ]
  });

  const upcomingEvents = await CalendarEvent.countDocuments({
    $or: [
      { createdBy: userId },
      { 'attendees.userId': userId }
    ],
    date: { $gte: new Date() },
    status: { $nin: ['COMPLETED', 'CANCELLED'] }
  });

  const overdueEvents = await CalendarEvent.countDocuments({
    $or: [
      { createdBy: userId },
      { 'attendees.userId': userId }
    ],
    date: { $lt: new Date() },
    status: { $nin: ['COMPLETED', 'CANCELLED'] }
  });

  const highPriorityEvents = await CalendarEvent.countDocuments({
    $or: [
      { createdBy: userId },
      { 'attendees.userId': userId }
    ],
    priority: 'HIGH',
    status: { $nin: ['COMPLETED', 'CANCELLED'] }
  });

  res.status(200).json({
    success: true,
    data: {
      statusBreakdown: stats,
      totalEvents,
      upcomingEvents,
      overdueEvents,
      highPriorityEvents
    }
  });
});

// Mark event as complete
exports.markEventComplete = catchAsync(async (req, res) => {
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if user can mark this event as complete
  const userId = req.user._id;
  if (event.createdBy.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only event creator can mark this event as complete'
    });
  }

  event.status = 'COMPLETED';
  await event.save();

  await event.populate('createdBy', 'name email');
  await event.populate('attendees.userId', 'name email');

  res.status(200).json({
    success: true,
    message: 'Event marked as complete',
    data: event
  });
});

// Add attendee to event
exports.addAttendee = catchAsync(async (req, res) => {
  const { userId, name, email } = req.body;
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if user can add attendees
  const currentUserId = req.user._id;
  if (event.createdBy.toString() !== currentUserId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Only event creator can add attendees'
    });
  }

  await event.addAttendee(userId, name, email);
  
  await event.populate('createdBy', 'name email');
  await event.populate('attendees.userId', 'name email');

  res.status(200).json({
    success: true,
    message: 'Attendee added successfully',
    data: event
  });
});

// Update attendee response
exports.updateAttendeeResponse = catchAsync(async (req, res) => {
  const { response } = req.body;
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  const userId = req.user._id;
  await event.updateAttendeeResponse(userId, response);
  
  await event.populate('createdBy', 'name email');
  await event.populate('attendees.userId', 'name email');

  res.status(200).json({
    success: true,
    message: 'Response updated successfully',
    data: event
  });
});

// Add comment to event
exports.addComment = catchAsync(async (req, res) => {
  const { text } = req.body;
  const event = await CalendarEvent.findById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found'
    });
  }

  // Check if user has access to this event
  const userId = req.user._id;
  if (event.createdBy.toString() !== userId.toString() && 
      !event.attendees.some(a => a.userId.toString() === userId.toString())) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  event.comments.push({
    text,
    user: userId
  });

  await event.save();
  
  await event.populate('createdBy', 'name email');
  await event.populate('attendees.userId', 'name email');
  await event.populate('comments.user', 'name email');

  res.status(200).json({
    success: true,
    message: 'Comment added successfully',
    data: event
  });
});

// Bulk update events
exports.bulkUpdateEvents = catchAsync(async (req, res) => {
  const { eventIds, updateData } = req.body;
  const userId = req.user._id;

  // Verify user owns all events
  const events = await CalendarEvent.find({
    _id: { $in: eventIds },
    createdBy: userId
  });

  if (events.length !== eventIds.length) {
    return res.status(403).json({
      success: false,
      message: 'You can only update events you created'
    });
  }

  const result = await CalendarEvent.updateMany(
    { _id: { $in: eventIds } },
    { ...updateData, updatedBy: userId }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} events updated successfully`
  });
});

// Bulk delete events
exports.bulkDeleteEvents = catchAsync(async (req, res) => {
  const { eventIds } = req.body;
  const userId = req.user._id;

  // Verify user owns all events
  const events = await CalendarEvent.find({
    _id: { $in: eventIds },
    createdBy: userId
  });

  if (events.length !== eventIds.length) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete events you created'
    });
  }

  const result = await CalendarEvent.deleteMany({
    _id: { $in: eventIds }
  });

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} events deleted successfully`
  });
});

// Export events
exports.exportEvents = catchAsync(async (req, res) => {
  const { format = 'csv', ...filters } = req.query;
  const userId = req.user._id;

  // Build filter object
  const filter = { ...filters };
  filter.$or = [
    { createdBy: userId },
    { 'attendees.userId': userId }
  ];

  const events = await CalendarEvent.find(filter)
    .populate('createdBy', 'name email')
    .populate('tenderId', 'title organization')
    .sort({ date: 1 });

  if (format === 'csv') {
    // Generate CSV
    const csvData = events.map(event => ({
      Title: event.title,
      Description: event.description,
      Date: event.date.toISOString().split('T')[0],
      Time: event.time,
      Type: event.type,
      Priority: event.priority,
      Status: event.status,
      Location: event.location,
      Category: event.category,
      CreatedBy: event.createdBy?.name || '',
      Tender: event.tenderId?.title || ''
    }));

    // Convert to CSV string
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value || ''}"`).join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar-events.csv');
    res.send(csvString);
  } else {
    res.status(200).json({
      success: true,
      data: events
    });
  }
});
