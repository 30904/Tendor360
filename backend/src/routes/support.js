const express = require('express');
const { requireAuth, requireRoles } = require('../middlewares/auth');
const { supportTicketUpload, mapUploadedFiles } = require('../middlewares/supportTicketUpload');
const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');
const router = express.Router();

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  console.log('🏥 Support health check requested');
  res.json({
    success: true,
    message: 'Support service is running',
    timestamp: new Date().toISOString()
  });
});

// Test models endpoint (no auth required)
router.get('/test-models', async (req, res) => {
  try {
    console.log('🧪 Testing models...');
    
    // Test User model
    const userCount = await require('../models/User').countDocuments();
    console.log('🧪 User count:', userCount);
    
    // Test FAQ model
    const faqCount = await require('../models/FAQ').countDocuments();
    console.log('🧪 FAQ count:', faqCount);
    
    // Test SupportTicket model
    const ticketCount = await require('../models/SupportTicket').countDocuments();
    console.log('🧪 Ticket count:', ticketCount);
    
    res.json({
      success: true,
      message: 'Models test completed',
      counts: {
        users: userCount,
        faqs: faqCount,
        tickets: ticketCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Models test error:', error);
    res.status(500).json({
      success: false,
      error: 'Models test failed',
      message: error.message
    });
  }
});

// Seeding endpoint for testing (no auth required in development)
router.post('/seed', async (req, res) => {
  try {
    console.log('🌱 Manual seeding requested');
    console.log('🌱 Request body:', req.body);
    console.log('🌱 NODE_ENV:', process.env.NODE_ENV);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('🌱 Production environment detected, blocking seeding');
      return res.status(403).json({
        success: false,
        error: 'Seeding not allowed in production'
      });
    }
    
    const { forceRefresh = false } = req.body;
    console.log('🌱 Force refresh requested:', forceRefresh);
    
    // Import and run the seeder
    console.log('🌱 Importing seeder...');
    const { seedSupportData } = require('../seed/supportSeed');
    console.log('🌱 Seeder imported successfully');
    
    console.log('🌱 Starting seeding process...');
    await seedSupportData(forceRefresh);
    console.log('🌱 Seeding process completed');
    
    res.json({
      success: true,
      message: 'Support data seeded successfully',
      forceRefresh,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Seeding error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Seeding failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ==================== SUPPORT TICKETS ====================

// Get all tickets (with filtering and pagination)
router.get('/tickets', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Tickets request received from user:', req.user._id, 'with roles:', req.user.roles);
    
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      category,
      assignedTo,
      createdBy,
      search,
      sortBy = 'lastActivity',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isDeleted: false };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (createdBy) query.createdBy = createdBy;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Check if user is admin or support staff
    const isAdmin = req.user.roles && req.user.roles.includes('ADMIN');
    const isSupportStaff = req.user.roles && req.user.roles.includes('SUPPORT_STAFF');
    
    console.log('🔍 User permissions:', { isAdmin, isSupportStaff, userId: req.user._id });
    
    if (!isAdmin && !isSupportStaff) {
      // Regular users can only see their own tickets
      query.$or = [
        { createdBy: req.user._id },
        { assignedTo: req.user._id }
      ];
      console.log('🔍 Regular user query:', query);
    } else {
      console.log('🔍 Staff user - can see all tickets');
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [tickets, total] = await Promise.all([
      SupportTicket.find(query)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      SupportTicket.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    console.log('✅ Tickets fetched successfully:', { count: tickets.length, total, page });

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalTickets: total,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tickets',
      message: error.message
    });
  }
});

// Get ticket by ID
router.get('/tickets/:id', requireAuth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email')
      .populate('relatedTenders', 'title organization')
      .populate('relatedDocuments', 'name type');

    if (!ticket || ticket.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check access permissions
    const isAdmin = req.user.roles.includes('ADMIN');
    const isSupportStaff = req.user.roles.includes('SUPPORT_STAFF');
    const isOwner = ticket.createdBy._id.toString() === req.user._id.toString();
    const isAssigned = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();

    if (!isAdmin && !isSupportStaff && !isOwner && !isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { ticket }
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticket',
      message: error.message
    });
  }
});

// Create new ticket (optional file attachments via multipart field "attachments")
router.post('/tickets', requireAuth, (req, res, next) => {
  supportTicketUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: 'Upload failed',
        message: err.message || 'Invalid attachment'
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      priority,
      tags,
      relatedTenders,
      relatedDocuments
    } = req.body;

    const parsedTags = (() => {
      if (!tags) return [];
      if (Array.isArray(tags)) return tags;
      try {
        const parsed = JSON.parse(tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return String(tags)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    })();

    const attachments = mapUploadedFiles(req.files);

    const ticket = new SupportTicket({
      title,
      description,
      category,
      subcategory,
      priority,
      tags: parsedTags,
      relatedTenders: relatedTenders || [],
      relatedDocuments: relatedDocuments || [],
      createdBy: req.user._id,
      companyId: req.companyId || req.user.companyId
    });

    await ticket.save();

    await ticket.addMessage(req.user._id, description, false, attachments);

    const populatedTicket = await SupportTicket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email');

    res.status(201).json({
      success: true,
      data: { ticket: populatedTicket },
      message: attachments.length
        ? `Support ticket created with ${attachments.length} attachment(s)`
        : 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create ticket',
      message: error.message
    });
  }
});

// Update ticket
router.put('/tickets/:id', requireAuth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket || ticket.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.roles.includes('ADMIN');
    const isSupportStaff = req.user.roles.includes('SUPPORT_STAFF');
    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isSupportStaff && !isOwner && !isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Update fields
    const updateFields = ['title', 'description', 'category', 'subcategory', 'priority', 'tags'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    // Only admin/support staff can update status and assignment
    if (isAdmin || isSupportStaff) {
      if (req.body.status) {
        await ticket.updateStatus(req.body.status, req.user._id);
      }
      if (req.body.assignedTo !== undefined) {
        ticket.assignedTo = req.body.assignedTo;
      }
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      data: { ticket: updatedTicket },
      message: 'Ticket updated successfully'
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket',
      message: error.message
    });
  }
});

// Add message to ticket
router.post('/tickets/:id/messages', requireAuth, async (req, res) => {
  try {
    const { message, isInternal = false } = req.body;
    
    const ticket = await SupportTicket.findById(req.params.id);
    
    if (!ticket || ticket.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check permissions
    const isAdmin = req.user.roles.includes('ADMIN');
    const isSupportStaff = req.user.roles.includes('SUPPORT_STAFF');
    const isOwner = ticket.createdBy.toString() === req.user._id.toString();
    const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();

    if (!isAdmin && !isSupportStaff && !isOwner && !isAssigned) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Only staff can add internal messages
    if (isInternal && !isAdmin && !isSupportStaff) {
      return res.status(403).json({
        success: false,
        error: 'Only support staff can add internal messages'
      });
    }

    await ticket.addMessage(req.user._id, message, isInternal);

    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name email');

    res.json({
      success: true,
      data: { ticket: updatedTicket },
      message: 'Message added successfully'
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add message',
      message: error.message
    });
  }
});

// Get ticket statistics overview
router.get('/tickets/stats/overview', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Stats overview request received from user:', req.user._id, 'with roles:', req.user.roles);
    const stats = await SupportTicket.getTicketStats();
    console.log('✅ Stats overview data fetched successfully:', stats);
    
    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('❌ Error fetching ticket stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticket statistics',
      message: error.message
    });
  }
});

// ==================== FAQ MANAGEMENT ====================

// Get all FAQs
router.get('/faqs', requireAuth, async (req, res) => {
  try {
    console.log('🔍 FAQs request received from user:', req.user._id, 'with roles:', req.user.roles);
    
    const {
      category,
      subcategory,
      search,
      limit
    } = req.query;

    // Build query
    const query = { isDeleted: false };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Check if user is admin or support staff
    const isAdmin = req.user.roles && req.user.roles.includes('ADMIN');
    const isSupportStaff = req.user.roles && req.user.roles.includes('SUPPORT_STAFF');
    
    console.log('🔍 User permissions for FAQs:', { isAdmin, isSupportStaff, userId: req.user._id });

    // Execute query
    const faqs = await FAQ.find(query)
      .populate('createdBy', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 100);

    console.log('✅ FAQs fetched successfully:', { count: faqs.length });

    res.json({
      success: true,
      data: { faqs }
    });
  } catch (error) {
    console.error('❌ Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs',
      message: error.message
    });
  }
});

// Get FAQ by ID
router.get('/faqs/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!faq || faq.isDeleted || !faq.isPublished) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }

    // Increment view count
    await faq.incrementViewCount();

    res.json({
      success: true,
      data: { faq }
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ',
      message: error.message
    });
  }
});

// Create FAQ (Admin/Support staff only)
router.post('/faqs', requireAuth, requireRoles('ADMIN', 'SUPPORT_STAFF'), async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
      subcategory,
      tags,
      priority
    } = req.body;

    const faq = new FAQ({
      question,
      answer,
      category,
      subcategory,
      tags,
      priority,
      createdBy: req.user._id
    });

    await faq.save();

    const populatedFAQ = await FAQ.findById(faq._id)
      .populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      data: { faq: populatedFAQ },
      message: 'FAQ created successfully'
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create FAQ',
      message: error.message
    });
  }
});

// Update FAQ (Admin/Support staff only)
router.put('/faqs/:id', requireAuth, requireRoles('ADMIN', 'SUPPORT_STAFF'), async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq || faq.isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }

    const updateFields = ['question', 'answer', 'category', 'subcategory', 'tags', 'priority', 'isPublished'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        faq[field] = req.body[field];
      }
    });

    faq.lastUpdatedBy = req.user._id;
    await faq.save();

    const updatedFAQ = await FAQ.findById(faq._id)
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name');

    res.json({
      success: true,
      data: { faq: updatedFAQ },
      message: 'FAQ updated successfully'
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update FAQ',
      message: error.message
    });
  }
});

// Mark FAQ as helpful/not helpful
router.post('/faqs/:id/feedback', async (req, res) => {
  try {
    const { helpful } = req.body;
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq || faq.isDeleted || !faq.isPublished) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }

    if (helpful) {
      await faq.markHelpful();
    } else {
      await faq.markNotHelpful();
    }

    res.json({
      success: true,
      message: 'Feedback recorded successfully'
    });
  } catch (error) {
    console.error('Error recording feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record feedback',
      message: error.message
    });
  }
});

// ==================== SUPPORT DASHBOARD ====================

// Get support dashboard data
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    console.log('🔍 Dashboard request received from user:', req.user._id, 'with roles:', req.user.roles);
    
    const [allTickets, stats] = await Promise.all([
      SupportTicket.find({ isDeleted: false })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ lastActivity: -1 })
        .limit(10),
      SupportTicket.getTicketStats()
    ]);

    console.log('✅ Dashboard data fetched successfully:', {
      ticketsCount: allTickets.length,
      stats: stats
    });

    res.json({
      success: true,
      data: {
        tickets: allTickets,
        stats
      }
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data',
      message: error.message
    });
  }
});

module.exports = router;
