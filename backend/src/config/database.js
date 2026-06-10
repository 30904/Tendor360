const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Use fallback MongoDB URI if not set in environment
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tender360';
    console.log('🔌 MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Using fallback');
    
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return mongoose.connection;
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection state: ${conn.connection.readyState}`);
    
    // Set global mongoose options
    mongoose.set('strictQuery', false);
    
    // Add connection event listeners
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

module.exports = { connectDB };
