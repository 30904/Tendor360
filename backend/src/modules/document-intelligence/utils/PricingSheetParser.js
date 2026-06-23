const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const UPLOADS_ROOT = path.join(__dirname, '../../../../uploads');
const BACKEND_ROOT = path.join(__dirname, '../../..');

const COLUMN_ALIASES = {
  lineNumber: ['line', 'line #', 'line no', 'line number', 'item #', 'item number', 'no', '#', 'sno', 'sr no'],
  quantity: ['qty', 'quantity', 'q ty', 'count', 'units', 'order qty', 'ordered qty'],
  uom: ['uom', 'unit', 'unit of measure', 'u/m', 'um', 'each', 'uom/each'],
  description: [
    'description',
    'item description',
    'line item',
    'product',
    'material',
    'service',
    'item name',
    'details',
    'specification',
    'item'
  ],
  sku: ['sku', 'part', 'part number', 'part no', 'catalog', 'catalog number', 'mpn', 'item code', 'product code', 'model'],
  unitPrice: ['unit price', 'price', 'rate', 'unit cost', 'cost each', 'list price', 'unit rate', 'cost/unit'],
  lineTotal: ['total', 'extended', 'line total', 'amount', 'extended price', 'subtotal', 'line amount', 'ext price']
};

const TOTAL_ROW_PATTERN = /^(total|subtotal|grand total|summary|tax|shipping|freight)\b/i;

function normalizeHeader(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[_-]+/g, ' ');
}

function resolveDocumentFilePath(document) {
  const storage = document?.storage || {};
  const relativePath = storage.path || storage.filename;
  if (!relativePath) return null;

  if (path.isAbsolute(relativePath) && fs.existsSync(relativePath)) {
    return relativePath;
  }

  if (storage.filename) {
    const viaFilename = path.join(UPLOADS_ROOT, storage.filename);
    if (fs.existsSync(viaFilename)) return viaFilename;
  }

  const viaRelative = path.join(BACKEND_ROOT, String(relativePath).replace(/^uploads[\\/]/, 'uploads/'));
  if (fs.existsSync(viaRelative)) return viaRelative;

  return null;
}

function isSpreadsheetDocument(document) {
  const storage = document?.storage || {};
  const mime = String(storage.mimeType || '').toLowerCase();
  const name = String(storage.originalName || storage.filename || '').toLowerCase();

  if (
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime.includes('csv') ||
    mime === 'application/vnd.ms-excel' ||
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return true;
  }

  return /\.(xlsx|xls|csv)$/i.test(name);
}

function scoreHeaderRow(cells) {
  const normalized = cells.map(normalizeHeader);
  const mapping = {};
  let score = 0;

  Object.entries(COLUMN_ALIASES).forEach(([field, aliases]) => {
    const index = normalized.findIndex((cell) => aliases.some((alias) => cell === alias || cell.includes(alias)));
    if (index >= 0) {
      mapping[field] = index;
      score += 1;
    }
  });

  const hasLineIdentity = mapping.description !== undefined || mapping.sku !== undefined;
  const hasQtyOrPrice = mapping.quantity !== undefined || mapping.unitPrice !== undefined || mapping.lineTotal !== undefined;

  return { mapping, score: hasLineIdentity && hasQtyOrPrice ? score : 0 };
}

function parseNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const cleaned = String(value).replace(/[$€£,\s]/g, '').replace(/^\((.*)\)$/, '-$1');
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

function parseString(value) {
  const text = String(value || '').trim();
  return text || '';
}

function isTotalRow(row, descriptionIndex) {
  const first = parseString(row[0]);
  const description = descriptionIndex >= 0 ? parseString(row[descriptionIndex]) : '';
  return TOTAL_ROW_PATTERN.test(first) || TOTAL_ROW_PATTERN.test(description);
}

function rowHasData(row, mapping) {
  const fields = ['quantity', 'description', 'sku', 'unitPrice', 'lineTotal'];
  return fields.some((field) => {
    const index = mapping[field];
    if (index === undefined) return false;
    const value = row[index];
    return value !== null && value !== undefined && String(value).trim() !== '';
  });
}

function parseSheetRows(rows, sheetName) {
  if (!rows?.length) return [];

  let best = { headerRowIndex: -1, mapping: {}, score: 0 };
  const scanLimit = Math.min(rows.length, 20);

  for (let i = 0; i < scanLimit; i += 1) {
    const candidate = scoreHeaderRow(rows[i] || []);
    if (candidate.score > best.score) {
      best = { headerRowIndex: i, mapping: candidate.mapping, score: candidate.score };
    }
  }

  if (best.headerRowIndex < 0 || best.score < 2) {
    return [];
  }

  const lineItems = [];
  for (let i = best.headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    if (!rowHasData(row, best.mapping)) continue;
    if (isTotalRow(row, best.mapping.description)) continue;

    const description = best.mapping.description !== undefined ? parseString(row[best.mapping.description]) : '';
    const sku = best.mapping.sku !== undefined ? parseString(row[best.mapping.sku]) : '';
    const quantity = best.mapping.quantity !== undefined ? parseNumber(row[best.mapping.quantity]) : null;
    const unitPrice = best.mapping.unitPrice !== undefined ? parseNumber(row[best.mapping.unitPrice]) : null;
    const lineTotal = best.mapping.lineTotal !== undefined ? parseNumber(row[best.mapping.lineTotal]) : null;
    const lineNumber =
      best.mapping.lineNumber !== undefined ? parseNumber(row[best.mapping.lineNumber]) : null;
    const uom = best.mapping.uom !== undefined ? parseString(row[best.mapping.uom]) : 'EA';

    if (!description && !sku) continue;

    lineItems.push({
      lineNumber: lineNumber || lineItems.length + 1,
      quantity: quantity ?? 1,
      uom: uom || 'EA',
      description: description || sku,
      sku: sku || undefined,
      unitPrice: unitPrice ?? undefined,
      lineTotal: lineTotal ?? undefined,
      sheetName
    });

    if (lineItems.length >= 500) break;
  }

  return lineItems;
}

/**
 * TB-009: Parse structured pricing worksheets using column headers (XLSX/XLS/CSV).
 */
function parsePricingSheetFromFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return [];
  }

  const workbook = xlsx.readFile(filePath, { cellDates: false, cellNF: false, cellText: true });
  const allLineItems = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' });
    const parsed = parseSheetRows(rows, sheetName);
    parsed.forEach((item) => allLineItems.push(item));
  }

  return allLineItems;
}

function parsePricingSheetFromDocument(document) {
  if (!document || !isSpreadsheetDocument(document)) {
    return [];
  }

  const filePath = resolveDocumentFilePath(document);
  if (!filePath) {
    return [];
  }

  try {
    return parsePricingSheetFromFile(filePath);
  } catch (error) {
    console.warn(`TB-009: Pricing sheet parse failed for ${filePath}:`, error.message);
    return [];
  }
}

module.exports = {
  parsePricingSheetFromFile,
  parsePricingSheetFromDocument,
  resolveDocumentFilePath,
  isSpreadsheetDocument,
  parseSheetRows
};
