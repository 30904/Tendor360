const mongoose = require('mongoose');
require('dotenv').config();

// Import the seeder
const { seedSupportData } = require('./src/seed/supportSeed');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tender360');
    console.log('✅ MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Main seeding function
const runSeeding = async () => {
  try {
    console.log('🚀 Starting support data seeding...');
    
    // Connect to database
    await connectDB();
    
    // Run the seeder with force refresh
    await seedSupportData(true);
    
    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding
runSeeding();
