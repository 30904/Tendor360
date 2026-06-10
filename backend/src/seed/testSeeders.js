const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models to check data
const User = require('../models/User');
const Tender = require('../models/Tender');
const Document = require('../models/Document');
const Evaluation = require('../models/Evaluation');
const Pricing = require('../models/Pricing');
const CalendarEvent = require('../models/Calendar');
const Contract = require('../models/Contract');
const Report = require('../models/Report');
const Setting = require('../models/Setting');
const Alert = require('../models/Alert');
const SavedSearch = require('../models/SavedSearch');
const EvaluationTemplate = require('../models/EvaluationTemplate');
const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Test function to check seeded data
const testSeededData = async () => {
  try {
    console.log('🔍 Testing seeded data...\n');
    
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Test each collection
    const tests = [
      { name: 'Users', model: User, expectedMin: 5 },
      { name: 'Tenders', model: Tender, expectedMin: 20 },
      { name: 'Documents', model: Document, expectedMin: 15 },
      { name: 'Evaluations', model: Evaluation, expectedMin: 10 },
      { name: 'Pricing', model: Pricing, expectedMin: 8 },
      { name: 'Calendar Events', model: CalendarEvent, expectedMin: 12 },
      { name: 'Contracts', model: Contract, expectedMin: 5 },
      { name: 'Reports', model: Report, expectedMin: 6 },
      { name: 'Settings', model: Setting, expectedMin: 20 },
      { name: 'Alerts', model: Alert, expectedMin: 8 },
      { name: 'Saved Searches', model: SavedSearch, expectedMin: 10 },
      { name: 'Evaluation Templates', model: EvaluationTemplate, expectedMin: 6 },
      { name: 'Support Tickets', model: SupportTicket, expectedMin: 5 },
      { name: 'FAQs', model: FAQ, expectedMin: 10 }
    ];
    
    let allPassed = true;
    
    for (const test of tests) {
      try {
        const count = await test.model.countDocuments();
        const status = count >= test.expectedMin ? '✅' : '❌';
        const message = count >= test.expectedMin ? 'PASS' : 'FAIL';
        
        console.log(`${status} ${test.name}: ${count} records (expected: ${test.expectedMin}+) - ${message}`);
        
        if (count < test.expectedMin) {
          allPassed = false;
        }
      } catch (error) {
        console.log(`❌ ${test.name}: ERROR - ${error.message}`);
        allPassed = false;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    
    if (allPassed) {
      console.log('🎉 All tests passed! Database is properly seeded.');
    } else {
      console.log('⚠️ Some tests failed. Check the seeding process.');
    }
    
    // Additional relationship tests
    console.log('\n🔗 Testing relationships...');
    
    try {
      // Test user-tender relationships
      const usersWithTenders = await User.aggregate([
        { $lookup: { from: 'tenders', localField: '_id', foreignField: 'owner', as: 'tenders' } },
        { $match: { 'tenders.0': { $exists: true } } },
        { $count: 'count' }
      ]);
      
      console.log(`✅ Users with tenders: ${usersWithTenders[0]?.count || 0}`);
      
      // Test tender-evaluation relationships
      const tendersWithEvaluations = await Tender.aggregate([
        { $lookup: { from: 'evaluations', localField: '_id', foreignField: 'tenderId', as: 'evaluations' } },
        { $match: { 'evaluations.0': { $exists: true } } },
        { $count: 'count' }
      ]);
      
      console.log(`✅ Tenders with evaluations: ${tendersWithEvaluations[0]?.count || 0}`);
      
      // Test user-alert relationships
      const usersWithAlerts = await User.aggregate([
        { $lookup: { from: 'alerts', localField: '_id', foreignField: 'user', as: 'alerts' } },
        { $match: { 'alerts.0': { $exists: true } } },
        { $count: 'count' }
      ]);
      
      console.log(`✅ Users with alerts: ${usersWithAlerts[0]?.count || 0}`);
      
    } catch (error) {
      console.log(`❌ Relationship test error: ${error.message}`);
    }
    
    // Sample data verification
    console.log('\n📊 Sample data verification...');
    
    try {
      // Check for admin user
      const adminUser = await User.findOne({ email: 'admin@tender360.com' });
      console.log(`✅ Admin user: ${adminUser ? 'Found' : 'Not found'}`);
      
      // Check for high-value tenders
      const highValueTenders = await Tender.countDocuments({ estimatedValue: { $gte: 1000000 } });
      console.log(`✅ High-value tenders (≥$1M): ${highValueTenders}`);
      
      // Check for active tenders
      const activeTenders = await Tender.countDocuments({ status: 'active' });
      console.log(`✅ Active tenders: ${activeTenders}`);
      
      // Check for default evaluation templates
      const defaultTemplates = await EvaluationTemplate.countDocuments({ isDefault: true });
      console.log(`✅ Default evaluation templates: ${defaultTemplates}`);
      
    } catch (error) {
      console.log(`❌ Sample data verification error: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
};

// Run tests if called directly
if (require.main === module) {
  testSeededData();
}

module.exports = { testSeededData };
