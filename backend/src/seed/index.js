const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import seeders
const seedCompanies = require('./seeders/companySeeder');
const seedRoles = require('./seeders/roleSeeder');
const seedUsers = require('./seeders/userSeeder');
const seedTenders = require('./seeders/tenderSeeder');
const seedDocuments = require('./seeders/documentSeeder');
const seedEvaluations = require('./seeders/evaluationSeeder');
const seedPricing = require('./seeders/pricingSeeder');
const seedCalendar = require('./seeders/calendarSeeder');
const seedContracts = require('./seeders/contractSeeder');
const seedReports = require('./seeders/reportSeeder');
const seedSettings = require('./seeders/settingSeeder');
const seedAlerts = require('./seeders/alertSeeder');
const seedSavedSearches = require('./seeders/savedSearchSeeder');
const seedEvaluationTemplates = require('./seeders/evaluationTemplateSeeder');
const { seedSupportData } = require('./supportSeed');
const { seedCompetitors } = require('./seeders/competitorSeeder');
const { seedMarketDeclarations } = require('./seeders/marketDeclarationSeeder');
const seedIntelligenceDemo = require('./seeders/intelligenceDemoSeeder');

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

// Main seeding function
const seedAll = async () => {
  try {
    console.log('🚀 Starting database seeding...\n');
    
    // Only connect if not already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    } else {
      console.log('✅ Already connected to MongoDB, skipping connection');
    }
    
    // Clear existing data (optional - uncomment if you want to start fresh)
    await clearAllCollections();
    
    // Seed in order (dependencies first)
    console.log('🏢 Seeding companies...');
    await seedCompanies();
    console.log('🏢 Companies seeding completed');
    
    console.log('📋 Seeding roles...');
    await seedRoles();
    
    console.log('👥 Seeding users...');
    await seedUsers();
    console.log('👥 Users seeding completed');
    
    console.log('📄 Seeding tenders...');
    await seedTenders();
    
    console.log('📁 Seeding documents...');
    await seedDocuments();
    
    console.log('✅ Seeding evaluations...');
    await seedEvaluations();
    
    console.log('💰 Seeding pricing...');
    await seedPricing();
    
    console.log('📅 Seeding calendar events...');
    await seedCalendar();
    
    console.log('📋 Seeding contracts...');
    await seedContracts();
    
    console.log('📊 Seeding reports...');
    await seedReports();
    
    console.log('⚙️ Seeding settings...');
    await seedSettings();
    
    console.log('🔔 Seeding alerts...');
    await seedAlerts();
    
    console.log('🔍 Seeding saved searches...');
    await seedSavedSearches();
    
    console.log('📋 Seeding evaluation templates...');
    await seedEvaluationTemplates();
    
    console.log('🏢 Seeding competitors...');
    await seedCompetitors();
    console.log('🏢 Competitors seeding completed');
    
    console.log('🆘 Seeding support data...');
    await seedSupportData();

    console.log('🧠 Seeding intelligence demo data...');
    await seedIntelligenceDemo();

    console.log('🔌 Ensuring discovery connectors for buyer tenants...');
    const { ensureIntelligencePlatformForAllBuyers } = require('./data/intelligencePlatformSeed');
    await ensureIntelligencePlatformForAllBuyers();
    
    console.log('\n🎉 All seeding completed successfully!');
    console.log('\n🔑 Default Admin Credentials:');
    console.log('   Email: admin@tender360.com');
    console.log('   Password: Admin@123');
    console.log('\n🔑 Default Manager Credentials:');
    console.log('   Email: manager@tender360.com');
    console.log('   Password: Manager@123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    // Only disconnect if this seeder was run directly (not from server)
    if (require.main === module) {
      await mongoose.disconnect();
      console.log('\n🔌 Database connection closed');
    }
  }
};

// Clear all collections (use with caution!)
const clearAllCollections = async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      await collection.deleteMany({});
    }
    
    console.log('🗑️ All collections cleared');
  } catch (error) {
    console.error('❌ Error clearing collections:', error);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll, clearAllCollections };
