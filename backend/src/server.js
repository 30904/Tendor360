
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { loadEnvironment, getSafeEnvSummary } = require('./config/env');

const { loadedFromFile } = loadEnvironment();
if (loadedFromFile) {
  console.log('📁 Environment loaded from local .env (development only)');
} else {
  console.log('📁 Environment loaded from host process variables');
}
console.log('🔧 Environment summary:', getSafeEnvSummary());

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
    const server = app.listen(PORT, () => {
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

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the other process or change PORT in backend/.env`);
        console.error(`   Windows: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F`);
        process.exit(1);
      }
      console.error('❌ Server error:', err);
      process.exit(1);
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
// Trigger restart
