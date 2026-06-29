const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const MAX_STORED_TEXT_CHARS = 50000;

function normalizeAttachmentMeta(contentType = '', filename = '') {
  const ct = String(contentType).toLowerCase().split(';')[0].trim();
  const lowerName = String(filename || '').toLowerCase();
  return { ct, lowerName };
}

function stripHtml(html = '') {
  return String(html)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncateText(text = '') {
  const normalized = String(text || '').trim();
  if (normalized.length <= MAX_STORED_TEXT_CHARS) return normalized;
  return normalized.slice(0, MAX_STORED_TEXT_CHARS);
}

/**
 * ATS-003: Extract searchable plain text from email attachment bytes.
 */
async function extractTextFromAttachment({ buffer, contentType, filename } = {}) {
  if (!buffer || !Buffer.isBuffer(buffer) || buffer.length === 0) {
    return '';
  }

  if (buffer.length > MAX_ATTACHMENT_BYTES) {
    console.warn(
      `ATS-003: Skipping attachment text extraction for ${filename || 'attachment'} (${buffer.length} bytes exceeds limit)`
    );
    return '';
  }

  const { ct, lowerName } = normalizeAttachmentMeta(contentType, filename);

  if (ct === 'text/plain' || lowerName.endsWith('.txt')) {
    return buffer.toString('utf8');
  }

  if (ct === 'text/html' || lowerName.endsWith('.html') || lowerName.endsWith('.htm')) {
    return stripHtml(buffer.toString('utf8'));
  }

  if (ct.includes('pdf') || lowerName.endsWith('.pdf')) {
    const parsed = await pdfParse(buffer);
    return parsed.text || '';
  }

  if (
    ct.includes('wordprocessingml') ||
    ct.includes('officedocument') ||
    lowerName.endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value || '';
  }

  return '';
}

module.exports = {
  extractTextFromAttachment,
  truncateText,
  MAX_ATTACHMENT_BYTES,
  MAX_STORED_TEXT_CHARS
};
