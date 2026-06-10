const xlsx = require('xlsx');
const fs = require('fs');

/**
 * Loads keywords from an Excel file (.xlsx or .xls).
 * Iterates through all sheets (except README/Instruction sheets)
 * and smartly extracts keywords from the first column, skipping headers and metadata.
 * 
 * @param {string} filePath - Absolute or relative path to the Excel file
 * @returns {string[]} Array of deduplicated, lowercased keywords
 */
function loadKeywordsFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found at path: ${filePath}`);
  }

  const workbook = xlsx.readFile(filePath);
  const keywords = new Set();

  const ignoreSheetNames = ['readme', 'instruction', 'guide'];

  workbook.SheetNames.forEach((sheetName) => {
    if (ignoreSheetNames.some(ignore => sheetName.toLowerCase().includes(ignore))) {
      return;
    }

    const sheet = workbook.Sheets[sheetName];
    // raw: false ensures we get formatted strings
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

    for (const row of rows) {
      if (!row || row.length === 0) continue;

      const cellValue = String(row[0] || '').trim();

      // Skip empty cells
      if (!cellValue) continue;

      // Skip instructional text or very long sentences
      if (cellValue.length > 80) continue;

      // Skip common headers
      const lowerCell = cellValue.toLowerCase();
      if (
        lowerCell === 'keyword / phrase' ||
        lowerCell === 'german keyword' ||
        lowerCell === 'code' ||
        lowerCell === 'keyword / brand' ||
        lowerCell === 'keyword' ||
        lowerCell.includes('cmdamericasbids') ||
        lowerCell.includes('admin.at@thermo')
      ) {
        continue;
      }

      // Skip section dividers like "── CHROMATOGRAPHY ──" or "-- MASS SPECTROMETRY --"
      if (
        (cellValue.startsWith('─') && cellValue.endsWith('─')) ||
        (cellValue.startsWith('-') && cellValue.endsWith('-'))
      ) {
        continue;
      }

      // It's a valid keyword
      keywords.add(lowerCell);
    }
  });

  return Array.from(keywords);
}

module.exports = {
  loadKeywordsFromFile
};
