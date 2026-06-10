const fs = require('fs');
const path = require('path');

const UPLOAD_ROOT = path.join(__dirname, '../../../../uploads');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * ATS-010: Generate a failure "screenshot" artifact (SVG) for support / BOT admin review.
 */
async function captureFailureScreenshot(companyId, { title, errorMessage, context = {} }) {
  const dir = path.join(UPLOAD_ROOT, String(companyId), 'failure-artifacts');
  ensureDir(dir);

  const fileName = `failure-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.svg`;
  const absolutePath = path.join(dir, fileName);
  const lines = [
    `Requirement: ${context.requirementId || 'ATS-010'}`,
    `Source: ${context.source || 'outlook_graph'}`,
    `Mailbox: ${context.mailbox || '—'}`,
    `Attempts: ${context.attempts ?? '—'}`,
    `Time: ${new Date().toISOString()}`,
    '',
    `Error: ${errorMessage}`
  ];

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520">
  <rect width="900" height="520" fill="#0f172a"/>
  <rect x="24" y="24" width="852" height="472" rx="12" fill="#1e293b" stroke="#334155"/>
  <text x="48" y="72" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="700">${escapeXml(title)}</text>
  <text x="48" y="110" fill="#94a3b8" font-family="Segoe UI, Arial, sans-serif" font-size="14">Tender360 BOT failure capture (ATS-010)</text>
  ${lines
    .map(
      (line, i) =>
        `<text x="48" y="${150 + i * 28}" fill="#e2e8f0" font-family="Consolas, monospace" font-size="13">${escapeXml(line)}</text>`
    )
    .join('\n  ')}
</svg>`;

  fs.writeFileSync(absolutePath, svg, 'utf8');

  const relativePath = path.join(String(companyId), 'failure-artifacts', fileName).replace(/\\/g, '/');
  return {
    screenshotPath: relativePath,
    screenshotUrl: `/uploads/${relativePath}`
  };
}

module.exports = { captureFailureScreenshot };
