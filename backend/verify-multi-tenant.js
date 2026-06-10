const mongoose = require('mongoose');
require('dotenv').config();

const verifyMultiTenantData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    console.log('\n=== MULTI-TENANT DATA VERIFICATION ===\n');
    
    const collections = [
      'companies', 'users', 'tenders', 'documents', 'evaluations', 
      'pricing', 'calendars', 'contracts', 'reports', 'settings', 
      'alerts', 'savedsearches', 'evaluationtemplates', 'faqs', 'supporttickets'
    ];
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.countDocuments();
        const sample = await collection.findOne();
        
        console.log(`${collectionName.toUpperCase()}: ${count} documents`);
        
        if (sample && sample.companyId) {
          console.log(`  - Sample companyId: ${sample.companyId}`);
          // Check if all documents have companyId
          const withoutCompanyId = await collection.countDocuments({ companyId: { $exists: false } });
          if (withoutCompanyId > 0) {
            console.log(`  ⚠️  WARNING: ${withoutCompanyId} documents without companyId`);
          } else {
            console.log(`  ✅ All documents have companyId`);
          }
        } else if (sample) {
          console.log(`  - No companyId field (expected for: ${collectionName})`);
        }
        console.log('');
      } catch (error) {
        console.log(`${collectionName.toUpperCase()}: Error - ${error.message}`);
      }
    }
    
    // Check company distribution
    console.log('=== COMPANY DISTRIBUTION ===');
    const companies = await db.collection('companies').find({}).toArray();
    console.log(`Total Companies: ${companies.length}`);
    
    for (const company of companies) {
      console.log(`\n${company.name} (${company.code}):`);
      console.log(`  - Users: ${await db.collection('users').countDocuments({ companyId: company._id })}`);
      console.log(`  - Tenders: ${await db.collection('tenders').countDocuments({ companyId: company._id })}`);
      console.log(`  - Documents: ${await db.collection('documents').countDocuments({ companyId: company._id })}`);
      console.log(`  - Evaluations: ${await db.collection('evaluations').countDocuments({ companyId: company._id })}`);
      console.log(`  - Pricing: ${await db.collection('pricing').countDocuments({ companyId: company._id })}`);
      console.log(`  - Calendar Events: ${await db.collection('calendars').countDocuments({ companyId: company._id })}`);
      console.log(`  - Contracts: ${await db.collection('contracts').countDocuments({ companyId: company._id })}`);
      console.log(`  - Reports: ${await db.collection('reports').countDocuments({ companyId: company._id })}`);
      console.log(`  - Settings: ${await db.collection('settings').countDocuments({ companyId: company._id })}`);
      console.log(`  - Alerts: ${await db.collection('alerts').countDocuments({ companyId: company._id })}`);
      console.log(`  - Saved Searches: ${await db.collection('savedsearches').countDocuments({ companyId: company._id })}`);
      console.log(`  - Evaluation Templates: ${await db.collection('evaluationtemplates').countDocuments({ companyId: company._id })}`);
      console.log(`  - FAQs: ${await db.collection('faqs').countDocuments({ companyId: company._id })}`);
      console.log(`  - Support Tickets: ${await db.collection('supporttickets').countDocuments({ companyId: company._id })}`);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
};

verifyMultiTenantData();
