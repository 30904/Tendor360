/**
 * ATS-003 local test — DOCX attachment keyword scan (no mailbox required).
 *
 * Usage:
 *   node scripts/test-ats003-docx-scan.js
 *   node scripts/test-ats003-docx-scan.js path/to/your-tender.docx
 *   node scripts/test-ats003-docx-scan.js --create-sample
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
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

function createSampleDocx() {
  const scriptPath = path.join(__dirname, 'create-ats003-sample-docx.js');
  execFileSync(process.execPath, [scriptPath], { stdio: 'inherit' });
  return path.join(__dirname, '../uploads/ats003-sample-tender.docx');
}

function resolveDocxPath(argv) {
  const createSample = argv.includes('--create-sample');
  const argPath = argv.find((a) => !a.startsWith('--'));

  if (createSample) {
    return createSampleDocx();
  }

  if (argPath) {
    const resolved = path.resolve(argPath);
    if (!fs.existsSync(resolved)) {
      throw new Error(`DOCX not found: ${resolved}`);
    }
    return resolved;
  }

  const searchDirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, 'fixtures')
  ];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const docx = fs.readdirSync(dir).find((name) => name.toLowerCase().endsWith('.docx'));
    if (docx) return path.join(dir, docx);
  }

  throw new Error(
    'No DOCX path given and no .docx files in backend/uploads or backend/scripts/fixtures.\n' +
      'Options:\n' +
      '  node scripts/test-ats003-docx-scan.js --create-sample\n' +
      '  node scripts/test-ats003-docx-scan.js path/to/file.docx\n' +
      'Or create a Word file containing keywords like "Dionex" or "HPLC" and save to backend/uploads/'
  );
}

async function run() {
  const docxPath = resolveDocxPath(process.argv.slice(2));
  const filename = path.basename(docxPath);
  const buffer = fs.readFileSync(docxPath);
  const contentType =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  console.log('ATS-003 DOCX scan test');
  console.log('File:', docxPath);
  console.log('Size:', buffer.length, 'bytes');
  console.log('---');

  const text = await extractTextFromAttachment({
    buffer,
    contentType,
    filename
  });

  console.log('Extracted text length:', text.length);
  console.log('Preview:', text.slice(0, 200).replace(/\s+/g, ' ').trim() || '(empty)');
  console.log('---');

  if (!text.trim()) {
    console.error('FAIL: No text extracted from DOCX.');
    process.exit(1);
  }

  const scan = await keywordScanner.scanAttachments(
    [
      {
        name: filename,
        contentType,
        contentBuffer: buffer,
        isImage: false
      }
    ],
    SAMPLE_KEYWORDS
  );

  console.log('Matched:', scan.matched);
  console.log('Keyword hits:', scan.hits.length ? scan.hits.join(', ') : '(none)');
  console.log('Attachment matches:', JSON.stringify(scan.attachmentMatches, null, 2));

  if (scan.matched) {
    console.log('PASS: ATS-003 DOCX keyword scan works locally.');
    process.exit(0);
  }

  console.log(
    'WARN: DOCX parsed OK but no sample keywords matched.\n' +
      'Add words like "Dionex" or "HPLC" to your document and run again.'
  );
  process.exit(0);
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
