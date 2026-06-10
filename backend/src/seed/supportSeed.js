const FAQ = require('../models/FAQ');
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const mongoose = require('mongoose');

const seedFAQs = async (forceRefresh = false) => {
  try {
    console.log('🌱 Seeding FAQs...');
    console.log('🌱 Force refresh:', forceRefresh);
    
    // Check database connection
    console.log('🌱 Database connection status:', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected. Status: ' + mongoose.connection.readyState);
    }

    const faqData = [
      {
        question: 'How do I create a new tender?',
        answer: 'To create a new tender, navigate to the Tender Intelligence page and click the "New Tender" button. Fill in the required information including title, description, deadline, and estimated value. You can also upload related documents during creation.',
        category: 'FEATURES',
        subcategory: 'Tender Management',
        tags: ['tender', 'create', 'new', 'management'],
        priority: 8
      },
      {
        question: 'How does the AI document processing work?',
        answer: 'Our AI system automatically extracts key information from uploaded documents including tender details, deadlines, requirements, and estimated values. The system uses advanced OCR and NLP to convert documents into structured data that can be used to create tender records.',
        category: 'TECHNICAL',
        subcategory: 'AI Features',
        tags: ['AI', 'document', 'processing', 'OCR', 'NLP'],
        priority: 9
      },
      {
        question: 'Can I export tender data?',
        answer: 'Yes, you can export tender data in multiple formats including CSV, Excel, and PDF. Use the export functionality in the Tender Intelligence page or Reporting & Analytics section. You can also schedule automated exports.',
        category: 'FEATURES',
        subcategory: 'Data Export',
        tags: ['export', 'data', 'CSV', 'Excel', 'PDF'],
        priority: 7
      },
      {
        question: 'How do I evaluate tender opportunities?',
        answer: 'Use the Qualification & Evaluation section to assess tender opportunities. The system provides AI-powered scoring, customizable evaluation matrices, and quick decision frameworks. You can set criteria weights and get recommendations.',
        category: 'FEATURES',
        subcategory: 'Evaluation',
        tags: ['evaluation', 'scoring', 'AI', 'decision', 'matrix'],
        priority: 8
      },
      {
        question: 'What file formats are supported for document uploads?',
        answer: 'We support PDF, Word documents (.doc, .docx), Excel files (.xls, .xlsx), and image files (PNG, JPG, JPEG). For best results with AI processing, we recommend using PDF format.',
        category: 'TECHNICAL',
        subcategory: 'File Support',
        tags: ['upload', 'file', 'format', 'PDF', 'Word', 'Excel'],
        priority: 6
      },
      {
        question: 'How do I manage user permissions?',
        answer: 'User permissions are managed in the Admin & Config section (Admin only). You can create roles, assign permissions, and manage user access levels. Each role has specific capabilities and restrictions.',
        category: 'TRAINING',
        subcategory: 'User Management',
        tags: ['permissions', 'roles', 'admin', 'users', 'access'],
        priority: 7
      },
      {
        question: 'Can I integrate with external systems?',
        answer: 'Yes, we provide API endpoints for integration with external systems. You can sync tender data, export information, and automate workflows. Contact our support team for API documentation and integration assistance.',
        category: 'INTEGRATION',
        subcategory: 'API',
        tags: ['integration', 'API', 'external', 'sync', 'automation'],
        priority: 8
      },
      {
        question: 'How do I track tender deadlines?',
        answer: 'Use the Tender Calendar to track deadlines and important dates. The system sends automated reminders and notifications. You can also set custom alerts for specific tender milestones.',
        category: 'FEATURES',
        subcategory: 'Calendar',
        tags: ['deadlines', 'calendar', 'reminders', 'notifications', 'tracking'],
        priority: 7
      },
      {
        question: 'What reporting options are available?',
        answer: 'We offer comprehensive reporting including performance analytics, win/loss analysis, pipeline tracking, and custom reports. Reports can be generated on-demand or scheduled for automatic delivery.',
        category: 'FEATURES',
        subcategory: 'Reporting',
        tags: ['reports', 'analytics', 'performance', 'pipeline', 'custom'],
        priority: 7
      },
      {
        question: 'How do I get technical support?',
        answer: 'For technical support, create a support ticket through the Help & Support section, use the AI chatbot, or email support@tender360.com. Our team typically responds within 24 hours.',
        category: 'GENERAL',
        subcategory: 'Support',
        tags: ['support', 'help', 'ticket', 'chatbot', 'contact'],
        priority: 9
      },
      {
        question: 'What are the system requirements?',
        answer: 'Our platform works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest browser versions for optimal performance. Mobile devices are also supported.',
        category: 'TECHNICAL',
        subcategory: 'System Requirements',
        tags: ['browser', 'mobile', 'requirements', 'performance'],
        priority: 6
      },
      {
        question: 'How do I reset my password?',
        answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email. The reset link expires after 24 hours.',
        category: 'GENERAL',
        subcategory: 'Account Management',
        tags: ['password', 'reset', 'security', 'login'],
        priority: 8
      }
    ];
    
    if (forceRefresh) {
      console.log('🔄 Force refresh: Clearing existing FAQs...');
      await FAQ.deleteMany({});
      console.log('🔄 Existing FAQs cleared');
    } else {
      const existingFAQs = await FAQ.countDocuments();
      console.log('🌱 Existing FAQs count:', existingFAQs);
      if (existingFAQs > 0) {
        console.log('✅ FAQs already exist, skipping...');
        return;
      }
    }

    console.log('🌱 FAQ data array length:', faqData.length);
    console.log('🌱 FAQ data sample:', faqData[0]);

    // Get a default user for creating FAQs - try multiple approaches
    console.log('🌱 Looking for default user...');
    let defaultUser = await User.findOne({ roles: { $in: ['ADMIN'] } });
    console.log('🌱 User with ADMIN role (array):', defaultUser ? 'Found' : 'Not found');
    
    if (!defaultUser) {
      defaultUser = await User.findOne({ roles: 'ADMIN' });
      console.log('🌱 User with ADMIN role (string):', defaultUser ? 'Found' : 'Not found');
    }
    if (!defaultUser) {
      defaultUser = await User.findOne(); // Get any user
      console.log('🌱 Any user found:', defaultUser ? 'Found' : 'Not found');
    }
    
    if (!defaultUser) {
      console.log('⚠️ No users found, creating a default admin user...');
      // Create a default admin user if none exists
      defaultUser = new User({
        name: 'System Administrator',
        email: 'admin@tender360.com',
        password: 'admin123',
        roles: ['ADMIN'],
        isActive: true
      });
      console.log('🌱 Default user object created:', defaultUser);
      await defaultUser.save();
      console.log('✅ Created default admin user with ID:', defaultUser._id);
    } else {
      console.log('✅ Using existing user:', defaultUser._id, defaultUser.name, defaultUser.roles);
    }

    const faqs = faqData.map(faq => ({
      ...faq,
      companyId: defaultUser.companyId,
      createdBy: defaultUser._id
    }));
    console.log('🌱 FAQs with user IDs prepared, count:', faqs.length);

    console.log('🌱 Inserting FAQs into database...');
    const result = await FAQ.insertMany(faqs);
    console.log('🌱 FAQ insertion result:', result.length, 'FAQs inserted');
    console.log(`✅ Created ${faqs.length} FAQs`);
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    console.error('❌ Error stack:', error.stack);
    throw error; // Re-throw to be caught by the main function
  }
};

const seedSampleTickets = async (forceRefresh = false) => {
  try {
    console.log('🌱 Seeding sample support tickets...');
    console.log('🌱 Force refresh:', forceRefresh);
    
    // Check database connection
    console.log('🌱 Database connection status:', mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected. Status: ' + mongoose.connection.readyState);
    }
    
    if (forceRefresh) {
      console.log('🔄 Force refresh: Clearing existing tickets...');
      await SupportTicket.deleteMany({});
      console.log('🔄 Existing tickets cleared');
    } else {
      const existingTickets = await SupportTicket.countDocuments();
      console.log('🌱 Existing tickets count:', existingTickets);
      if (existingTickets > 0) {
        console.log('✅ Support tickets already exist, skipping...');
        return;
      }
    }

    console.log('🌱 Looking for user for tickets...');
    let defaultUser = await User.findOne({ roles: { $in: ['ADMIN'] } });
    console.log('🌱 User with ADMIN role (array):', defaultUser ? 'Found' : 'Not found');
    
    if (!defaultUser) {
      defaultUser = await User.findOne({ roles: 'ADMIN' });
      console.log('🌱 User with ADMIN role (string):', defaultUser ? 'Found' : 'Not found');
    }
    if (!defaultUser) {
      defaultUser = await User.findOne(); // Get any user
      console.log('🌱 Any user found:', defaultUser ? 'Found' : 'Not found');
    }
    
    if (!defaultUser) {
      console.log('⚠️ No users found, cannot create tickets');
      return;
    }

    console.log('🌱 Using user for tickets:', defaultUser._id, defaultUser.name);

    const sampleTickets = [
      {
        title: 'Need help with document upload',
        description: 'I\'m trying to upload a tender document but getting an error message. The file is a PDF and under 10MB. Can you help me troubleshoot this issue?',
        category: 'TECHNICAL',
        subcategory: 'Document Upload',
        priority: 'MEDIUM',
        tags: ['document', 'upload', 'PDF', 'error'],
        createdBy: defaultUser._id,
        status: 'OPEN'
      },
      {
        title: 'Feature request: Bulk tender import',
        description: 'It would be very helpful to have a bulk import feature for tenders. Currently, I have to create them one by one which is time-consuming. Could this be added to the roadmap?',
        category: 'FEATURE_REQUEST',
        subcategory: 'Bulk Operations',
        priority: 'HIGH',
        tags: ['bulk', 'import', 'feature', 'request'],
        createdBy: defaultUser._id,
        status: 'IN_PROGRESS'
      },
      {
        title: 'AI scoring accuracy question',
        description: 'I\'ve noticed that the AI scoring for tender evaluation sometimes gives unexpected results. Is there a way to adjust the scoring algorithm or get more transparency into how scores are calculated?',
        category: 'TECHNICAL',
        subcategory: 'AI Features',
        priority: 'MEDIUM',
        tags: ['AI', 'scoring', 'evaluation', 'transparency'],
        createdBy: defaultUser._id,
        status: 'WAITING_FOR_CUSTOMER'
      },
      {
        title: 'Training session request',
        description: 'Our team would like to schedule a training session on the new features. We have about 15 users who need to learn the platform. What options are available for group training?',
        category: 'TRAINING',
        subcategory: 'Group Training',
        priority: 'LOW',
        tags: ['training', 'session', 'group', 'users'],
        createdBy: defaultUser._id,
        status: 'RESOLVED'
      },
      {
        title: 'Report generation issue',
        description: 'When I try to generate monthly reports, the system hangs and eventually times out. This happens consistently with reports containing more than 100 tenders. Is this a known issue?',
        category: 'BUG_REPORT',
        subcategory: 'Reporting',
        priority: 'HIGH',
        tags: ['reports', 'generation', 'timeout', 'bug'],
        createdBy: defaultUser._id,
        status: 'CLOSED'
      },
      {
        title: 'Integration with CRM system',
        description: 'We use Salesforce CRM and would like to integrate it with the tender management system. Is this possible and what would be the implementation timeline?',
        category: 'INTEGRATION',
        subcategory: 'CRM Integration',
        priority: 'HIGH',
        tags: ['integration', 'CRM', 'Salesforce', 'timeline'],
        createdBy: defaultUser._id,
        status: 'OPEN'
      },
      {
        title: 'Mobile app performance issues',
        description: 'The mobile app is very slow when loading tender lists. It takes 10-15 seconds to load even with a good internet connection. Can this be optimized?',
        category: 'TECHNICAL',
        subcategory: 'Mobile App',
        priority: 'MEDIUM',
        tags: ['mobile', 'performance', 'slow', 'optimization'],
        createdBy: defaultUser._id,
        status: 'IN_PROGRESS'
      },
      {
        title: 'Data backup and recovery',
        description: 'What is the backup schedule for our tender data? How long is data retained and what is the recovery process in case of data loss?',
        category: 'GENERAL',
        subcategory: 'Data Management',
        priority: 'HIGH',
        tags: ['backup', 'recovery', 'data', 'retention'],
        createdBy: defaultUser._id,
        status: 'OPEN'
      }
    ];

    console.log('🌱 Sample tickets prepared, count:', sampleTickets.length);
    console.log('🌱 Inserting tickets into database...');
    
    // Insert tickets one by one to avoid duplicate ticket numbers
    const insertedTickets = [];
    for (let i = 0; i < sampleTickets.length; i++) {
      const ticket = {
        ...sampleTickets[i],
        companyId: defaultUser.companyId
      };
      console.log(`🌱 Inserting ticket ${i + 1}/${sampleTickets.length}: ${ticket.title}`);
      
      const newTicket = new SupportTicket(ticket);
      await newTicket.save();
      insertedTickets.push(newTicket);
      
      // Small delay to ensure unique ticket numbers
      if (i < sampleTickets.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('🌱 Ticket insertion completed, count:', insertedTickets.length);
    console.log(`✅ Created ${insertedTickets.length} sample support tickets`);
  } catch (error) {
    console.error('❌ Error seeding sample tickets:', error);
    console.error('❌ Error stack:', error.stack);
    throw error; // Re-throw to be caught by the main function
  }
};

const seedSupportData = async (forceRefresh = false) => {
  try {
    console.log('🚀 Starting support data seeding...');
    console.log('🚀 Force refresh:', forceRefresh);
    
    console.log('🚀 Seeding FAQs...');
    await seedFAQs(forceRefresh);
    console.log('🚀 FAQs seeding completed');
    
    console.log('🚀 Seeding tickets...');
    await seedSampleTickets(forceRefresh);
    console.log('🚀 Tickets seeding completed');
    
    console.log('✅ Support data seeding completed successfully');
  } catch (error) {
    console.error('❌ Support data seeding failed:', error);
    console.error('❌ Error stack:', error.stack);
    throw error; // Re-throw to be caught by the endpoint
  }
};

// Force refresh function
const forceRefreshSupportData = async () => {
  console.log('🔄 Force refreshing support data...');
  await seedSupportData(true);
};

module.exports = { seedSupportData, forceRefreshSupportData };
