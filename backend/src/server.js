
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');


// Load environment variables
console.log('📁 Loading environment variables from:', path.join(__dirname, '../.env'));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Set default JWT secrets for development if not provided
if (!process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_ACCESS_SECRET = 'tender360_dev_access_secret_key_2024_velioniq_ai_suite';
  console.log('⚠️  Using default JWT access secret for development');
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'tender360_dev_refresh_secret_key_2024_velioniq_ai_suite';
  console.log('⚠️  Using default JWT refresh secret for development');
}

console.log('🔧 Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? 'Set' : 'Not set',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ? 'Set' : 'Not set',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ? 'Set' : 'Not set'
});

// Import models first to ensure schemas are registered
require('./models');

// Import loaders
const { connectDB } = require('./config/database');
const { setupMiddlewares } = require('./loaders/middlewares');
const { setupRoutes } = require('./loaders/routes');
const { setupSchedulers } = require('./loaders/schedulers');
const { setupErrorHandling } = require('./loaders/errorHandling');
const { setupStaticFrontend } = require('./loaders/staticFrontend');

const app = express();
const PORT = process.env.PORT || 5025;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize application
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // Setup middlewares
    setupMiddlewares(app);

    // Setup routes
    setupRoutes(app);

    const staticServed = setupStaticFrontend(app);
    if (staticServed) {
      console.log('✅ Frontend static files enabled (production SPA)');
    }

    setupSchedulers();

    // Seed database with initial data only if requested
    if (process.env.NODE_ENV === 'development' && process.env.SEED_DB === 'true') {
      console.log('🌱 Seeding database with initial data...');
      try {
        const { seedAll } = require('./seed');
        await seedAll();
        console.log('✅ Database seeding completed');
      } catch (error) {
        console.error('❌ Database seeding failed:', error);
        // Don't exit, continue with server startup
      }
    }

    // Setup error handling (must be last)
    setupErrorHandling(app);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Tender360 Backend running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api`);
      console.log(`🔌 MongoDB Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      
          // Verify database connection is maintained
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ WARNING: MongoDB connection lost during startup!');
    }
    
    // Set up periodic connection health check
    setInterval(() => {
      if (mongoose.connection.readyState !== 1) {
        console.error('❌ MongoDB connection lost! Attempting to reconnect...');
        // Try to reconnect
        mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }).catch(err => {
          console.error('❌ Failed to reconnect to MongoDB:', err.message);
        });
      }
    }, 30000); // Check every 30 seconds
  });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

startServer();
