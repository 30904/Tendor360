const mongoose = require('mongoose');

// Import seeders
const seedCompanies = require('./src/seed/seeders/companySeeder');
const seedRoles = require('./src/seed/seeders/roleSeeder');
const seedUsers = require('./src/seed/seeders/userSeeder');
const seedTenders = require('./src/seed/seeders/tenderSeeder');
const seedAlerts = require('./src/seed/seeders/alertSeeder');

async function testSeeder(seederName, seederFunction) {
  try {
    console.log(`\n🧪 Testing ${seederName}...`);
    console.log('='.repeat(50));
    await seederFunction();
    console.log(`✅ ${seederName} completed successfully`);
  } catch (error) {
    console.error(`❌ ${seederName} failed:`, error.message);
    throw error;
  }
}

async function runTests() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tender360');
    console.log('📊 Connected to MongoDB');

    // Test each seeder individually
    await testSeeder('Company Seeder', seedCompanies);
    await testSeeder('Role Seeder', seedRoles);
    await testSeeder('User Seeder', seedUsers);
    await testSeeder('Tender Seeder', seedTenders);
    await testSeeder('Alert Seeder', seedAlerts);

    console.log('\n🎉 All tested seeders completed successfully!');
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
