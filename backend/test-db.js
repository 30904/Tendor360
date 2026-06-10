const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('🔍 Testing database connection...');
console.log('MONGO_URI:', process.env.MONGO_URI);

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test basic operations
    const collections = await mongoose.connection.db.collections();
    console.log('📚 Available collections:', collections.map(c => c.collectionName));
    
    await mongoose.disconnect();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Make sure MongoDB is running locally');
    console.log('   2. Check if MongoDB is running on port 27017');
    console.log('   3. Try: mongod --dbpath /path/to/data/db');
    console.log('   4. Or install MongoDB as a service');
  }
};

testConnection();
