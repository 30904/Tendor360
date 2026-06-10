const ExcelKeywordLoaderService = require('../src/modules/tender-discovery/services/ExcelKeywordLoaderService');
const path = require('path');

const filePath = path.join(__dirname, '../../Thermo_Fisher_Tender_Keywords_Master.xlsx');

const keywords = ExcelKeywordLoaderService.loadKeywordsFromFile(filePath, { skipLastSheet: true });

console.log(`\n✅ Total keywords extracted (first 3 sheets, skipping last): ${keywords.length}`);
console.log('\nFirst 30 keywords:');
keywords.slice(0, 30).forEach((k, i) => console.log(`  [${i+1}] ${k}`));
console.log('\nLast 10 keywords:');
keywords.slice(-10).forEach((k, i) => console.log(`  ${k}`));
