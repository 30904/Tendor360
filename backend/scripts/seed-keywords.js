const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const GlobalKeyword = require('../src/models/GlobalKeyword');
const Company = require('../src/models/Company');
const ExcelKeywordLoaderService = require('../src/modules/tender-discovery/services/ExcelKeywordLoaderService');

const EXCEL_PATH = path.join(__dirname, '../../Thermo_Fisher_Tender_Keywords_Master.xlsx');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  try {
    // Get the correct company — MediCare Innovations
    const company = await Company.findOne({ name: /medicare/i }).lean();
    if (!company) {
      console.error('❌ No company found in database');
      process.exit(1);
    }
    console.log(`Using company: ${company.name} (${company._id})`);

    // Parse keywords — skip last sheet (Competitor Signals)
    const keywords = ExcelKeywordLoaderService.loadKeywordsFromFile(EXCEL_PATH, { skipLastSheet: true });
    console.log(`\n📊 Keywords extracted: ${keywords.length} (from first 3 sheets)`);

    // Clear old keywords for this company
    const deleted = await GlobalKeyword.deleteMany({ companyId: company._id });
    console.log(`🗑️  Removed ${deleted.deletedCount} existing keywords`);

    // Insert all keywords
    const docs = keywords.map((kw) => ({
      companyId: company._id,
      keyword: kw.toLowerCase().trim(),
      source: 'excel_upload',
      uploadedAt: new Date()
    }));

    const inserted = await GlobalKeyword.insertMany(docs, { ordered: false }).catch((err) => {
      // Count successfully inserted even if some dupes were skipped
      if (err.result) return err.result;
      throw err;
    });
    const count = inserted.insertedCount ?? inserted.length ?? docs.length;
    console.log(`✅ Inserted ${count} keywords into MongoDB collection "globalkeywords"`);

    // Also update the company settings to reflect the file name
    await Company.findByIdAndUpdate(company._id, {
      'settings.discovery.keywordFileName': 'Thermo_Fisher_Tender_Keywords_Master.xlsx',
      'settings.discovery.keywordFilePath': EXCEL_PATH
    });
    console.log('✅ Updated company settings with file reference');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
