const mongoose = require('mongoose');

// Import all models
const Company = require('./src/models/Company');
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const Tender = require('./src/models/Tender');
const Document = require('./src/models/Document');
const Evaluation = require('./src/models/Evaluation');
const Contract = require('./src/models/Contract');
const Report = require('./src/models/Report');
const Alert = require('./src/models/Alert');
const Calendar = require('./src/models/Calendar');
const Pricing = require('./src/models/Pricing');
const SavedSearch = require('./src/models/SavedSearch');
const SupportTicket = require('./src/models/SupportTicket');
const FAQ = require('./src/models/FAQ');
const EvaluationTemplate = require('./src/models/EvaluationTemplate');
const AuditLog = require('./src/models/AuditLog');
const Setting = require('./src/models/Setting');
const SystemConfig = require('./src/models/SystemConfig');

const collections = [
  { name: 'Company', model: Company },
  { name: 'User', model: User },
  { name: 'Role', model: Role },
  { name: 'Tender', model: Tender },
  { name: 'Document', model: Document },
  { name: 'Evaluation', model: Evaluation },
  { name: 'Contract', model: Contract },
  { name: 'Report', model: Report },
  { name: 'Alert', model: Alert },
  { name: 'Calendar', model: Calendar },
  { name: 'Pricing', model: Pricing },
  { name: 'SavedSearch', model: SavedSearch },
  { name: 'SupportTicket', model: SupportTicket },
  { name: 'FAQ', model: FAQ },
  { name: 'EvaluationTemplate', model: EvaluationTemplate },
  { name: 'AuditLog', model: AuditLog },
  { name: 'Setting', model: Setting },
  { name: 'SystemConfig', model: SystemConfig }
];

async function checkCollections() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tender360');
    console.log('📊 COLLECTION DATA SUMMARY:');
    console.log('========================');
    
    for (const collection of collections) {
      try {
        const count = await collection.model.countDocuments();
        console.log(`${collection.name.padEnd(20)}: ${count} documents`);
      } catch (error) {
        console.log(`${collection.name.padEnd(20)}: ERROR - ${error.message}`);
      }
    }
    
    console.log('========================');
    
    // Show some sample data for populated collections
    console.log('\n📋 SAMPLE DATA:');
    console.log('===============');
    
    // Show companies
    const companies = await Company.find().limit(3);
    console.log(`\n🏢 Companies (${companies.length}):`);
    companies.forEach(company => {
      console.log(`  - ${company.name} (${company.code}) - ${company.industry}`);
    });
    
    // Show users per company
    const users = await User.find().populate('companyId', 'name code').limit(10);
    console.log(`\n👥 Users (${users.length}):`);
    users.forEach(user => {
      console.log(`  - ${user.email} (${user.companyId?.name || 'No Company'}) - ${user.role}`);
    });
    
    // Show roles
    const roles = await Role.find();
    console.log(`\n🔑 Roles (${roles.length}):`);
    roles.forEach(role => {
      console.log(`  - ${role.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkCollections();
