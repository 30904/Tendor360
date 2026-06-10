const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../../Thermo_Fisher_Tender_Keywords_Master.xlsx');
const workbook = xlsx.readFile(filePath);

console.log('\n=== SHEETS ===');
workbook.SheetNames.forEach((name, i) => {
  console.log(`[${i}] ${name}`);
});

workbook.SheetNames.forEach((name, i) => {
  const sheet = workbook.Sheets[name];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });
  console.log(`\n=== Sheet [${i}]: "${name}" === (${rows.length} rows)`);
  // Print first 5 rows to see headers
  rows.slice(0, 5).forEach((row, ri) => {
    console.log(`  Row ${ri}:`, JSON.stringify(row));
  });
});
