const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import all seeders
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

// Available seeders
const seeders = {
  'roles': { fn: seedRoles, description: 'User roles and permissions' },
  'users': { fn: seedUsers, description: 'User accounts' },
  'tenders': { fn: seedTenders, description: 'Tender records' },
  'documents': { fn: seedDocuments, description: 'Document records' },
  'evaluations': { fn: seedEvaluations, description: 'Evaluation records' },
  'pricing': { fn: seedPricing, description: 'Pricing records' },
  'calendar': { fn: seedCalendar, description: 'Calendar events' },
  'contracts': { fn: seedContracts, description: 'Contract records' },
  'reports': { fn: seedReports, description: 'Report templates' },
  'settings': { fn: seedSettings, description: 'System settings' },
  'alerts': { fn: seedAlerts, description: 'User alerts' },
  'saved-searches': { fn: seedSavedSearches, description: 'Saved search criteria' },
  'evaluation-templates': { fn: seedEvaluationTemplates, description: 'Evaluation templates' },
  'support': { fn: seedSupportData, description: 'Support tickets and FAQs' }
};

// Main function
const runSeeder = async (seederName) => {
  try {
    console.log(`🚀 Starting ${seederName} seeder...\n`);
    
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Check if seeder exists
    if (!seeders[seederName]) {
      console.log('❌ Invalid seeder name. Available seeders:');
      Object.keys(seeders).forEach(name => {
        console.log(`   - ${name}: ${seeders[name].description}`);
      });
      return;
    }
    
    // Run the seeder
    await seeders[seederName].fn();
    console.log(`\n✅ ${seederName} seeding completed successfully!`);
    
  } catch (error) {
    console.error(`❌ ${seederName} seeding failed:`, error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
};

// Run multiple seeders
const runMultipleSeeders = async (seederNames) => {
  try {
    console.log(`🚀 Starting multiple seeders: ${seederNames.join(', ')}\n`);
    
    // Connect to database
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    
    // Validate all seeders exist
    const invalidSeeders = seederNames.filter(name => !seeders[name]);
    if (invalidSeeders.length > 0) {
      console.log('❌ Invalid seeder names:', invalidSeeders.join(', '));
      console.log('Available seeders:');
      Object.keys(seeders).forEach(name => {
        console.log(`   - ${name}: ${seeders[name].description}`);
      });
      return;
    }
    
    // Run seeders in order
    for (const seederName of seederNames) {
      console.log(`\n📋 Running ${seederName} seeder...`);
      await seeders[seederName].fn();
      console.log(`✅ ${seederName} completed`);
    }
    
    console.log(`\n🎉 All ${seederNames.length} seeders completed successfully!`);
    
  } catch (error) {
    console.error('❌ Multiple seeding failed:', error);
    process.exit(1);
  } finally {
    // Disconnect from database
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
};

// Show help
const showHelp = () => {
  console.log('🌱 Tender360 Database Seeder\n');
  console.log('Usage:');
  console.log('  node runIndividualSeeders.js <seeder-name>');
  console.log('  node runIndividualSeeders.js <seeder1,seeder2,seeder3>');
  console.log('  node runIndividualSeeders.js --help\n');
  console.log('Available seeders:');
  Object.keys(seeders).forEach(name => {
    console.log(`  ${name.padEnd(20)} - ${seeders[name].description}`);
  });
  console.log('\nExamples:');
  console.log('  node runIndividualSeeders.js tenders');
  console.log('  node runIndividualSeeders.js users,tenders,documents');
  console.log('  node runIndividualSeeders.js --help');
};

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }
  
  const input = args[0];
  
  // Check if multiple seeders (comma-separated)
  if (input.includes(',')) {
    const seederNames = input.split(',').map(name => name.trim());
    runMultipleSeeders(seederNames);
  } else {
    // Single seeder
    runSeeder(input);
  }
}

module.exports = { runSeeder, runMultipleSeeders, seeders };
