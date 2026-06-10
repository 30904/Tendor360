const xlsx = require('xlsx');
const fs = require('fs');

/**
 * Loads keywords from an Excel file (.xlsx or .xls).
 * Only reads the first column of each sheet (the Keywords column).
 * Skips header rows, section dividers, and instructional text.
 *
 * @param {string} filePath       - Absolute or relative path to the Excel file
 * @param {object} options
 * @param {boolean} options.skipLastSheet - If true, the last sheet is excluded (default: false)
 * @returns {string[]} Array of deduplicated, lowercased keywords
 */
function loadKeywordsFromFile(filePath, options = {}) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found at path: ${filePath}`);
  }

  const workbook = xlsx.readFile(filePath);
  const keywords = new Set();

  let sheetNames = workbook.SheetNames;

  // Optionally skip the last sheet
  if (options.skipLastSheet && sheetNames.length > 1) {
    sheetNames = sheetNames.slice(0, -1);
  }

  // Known header values to skip (column 0 values that are not real keywords)
  const HEADER_PATTERNS = [
    /^keyword/i,            // "Keyword / Phrase", "Keyword / Brand", "German Keyword"
    /^──/,                  // Section dividers: "── CHROMATOGRAPHY ──"
    /^--/,                  // Alternate dividers
    /cmdamerica/i,          // Instructional email lines
    /admin\.at@thermo/i,    // Email addresses
    /all keywords below/i,  // Instructional text
    /thermo scientific key/i,
    /austria keywords/i,
    /competitor.*market/i,
    /product keywords/i,
    /tenders mentioning/i
  ];

  sheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    // header:1 = raw array per row; raw:false = formatted strings
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false });

    for (const row of rows) {
      // Only care about column 0
      if (!row || row.length === 0) continue;

      const cellValue = String(row[0] || '').trim();

      // Skip empty
      if (!cellValue) continue;

      // Skip if too long to be a keyword (instructional sentences)
      if (cellValue.length > 80) continue;

      // Skip known header/divider patterns
      if (HEADER_PATTERNS.some((pattern) => pattern.test(cellValue))) continue;

      // It's a valid keyword — store lowercase
      keywords.add(cellValue.toLowerCase());
    }
  });

  return Array.from(keywords);
}

module.exports = {
  loadKeywordsFromFile
};
