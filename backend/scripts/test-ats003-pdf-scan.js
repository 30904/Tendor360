/**
 * ATS-003 local test — PDF attachment keyword scan (no mailbox required).
 *
 * Usage:
 *   node scripts/test-ats003-pdf-scan.js
 *   node scripts/test-ats003-pdf-scan.js path/to/your-tender.pdf
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { extractTextFromAttachment } = require('../src/modules/email-tender-scanning/services/AttachmentTextExtractor');
const keywordScanner = require('../src/modules/email-tender-scanning/services/EmailKeywordScanner');

const SAMPLE_KEYWORDS = [
  'dionex',
  'hplc',
  'ion chromatography',
  'mass spectrometry',
  'laboratory equipment',
  'tender'
];

function resolvePdfPath(argPath) {
  if (argPath) {
    const resolved = path.resolve(argPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`PDF not found: ${resolved}`);
    }
    return resolved;
  }

  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    throw new Error('No PDF path given and backend/uploads folder does not exist.');
  }

  const pdf = fs.readdirSync(uploadsDir).find((name) => name.toLowerCase().endsWith('.pdf'));
  if (!pdf) {
    throw new Error(
      'No PDF path given and no .pdf files in backend/uploads.\n' +
        'Usage: node scripts/test-ats003-pdf-scan.js path/to/file.pdf'
    );
  }

  return path.join(uploadsDir, pdf);
}

async function run() {
  const pdfPath = resolvePdfPath(process.argv[2]);
  const filename = path.basename(pdfPath);
  const buffer = fs.readFileSync(pdfPath);

  console.log('ATS-003 PDF scan test');
  console.log('File:', pdfPath);
  console.log('Size:', buffer.length, 'bytes');
  console.log('---');

  const text = await extractTextFromAttachment({
    buffer,
    contentType: 'application/pdf',
    filename
  });

  console.log('Extracted text length:', text.length);
  console.log('Preview:', text.slice(0, 200).replace(/\s+/g, ' ').trim() || '(empty)');
  console.log('---');

  if (!text.trim()) {
    console.error('FAIL: No text extracted from PDF (scanned image PDFs may need OCR).');
    process.exit(1);
  }

  const scan = await keywordScanner.scanAttachments(
    [
      {
        name: filename,
        contentType: 'application/pdf',
        contentBuffer: buffer,
        isImage: false
      }
    ],
    SAMPLE_KEYWORDS
  );

  console.log('Matched:', scan.matched);
  console.log('Keyword hits:', scan.hits.length ? scan.hits.join(', ') : '(none)');

  if (scan.matched) {
    console.log('PASS: ATS-003 PDF keyword scan works locally.');
    process.exit(0);
  }

  console.log(
    'WARN: PDF parsed OK but no sample keywords matched.\n' +
      'Add words like "Dionex" or "HPLC" to your PDF and run again.'
  );
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
