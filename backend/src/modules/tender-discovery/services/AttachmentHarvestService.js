const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Document = require('../../../models/Document');
const SamGovConnector = require('../../../services/connectors/SamGovConnector');

const UPLOAD_ROOT = path.join(__dirname, '../../../../uploads');

function ensureUploadDir(companyId) {
  const dir = path.join(UPLOAD_ROOT, String(companyId), 'discovery');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function normalizeAttachmentList(opportunity = {}) {
  const fromOpportunity = opportunity.attachments || [];
  const fromRaw =
    opportunity.metadata?.raw?.attachments ||
    opportunity.metadata?.raw?.resourceLinks ||
    opportunity.metadata?.raw?.documents ||
    [];

  const combined = [...fromOpportunity, ...fromRaw].map((item, index) => {
    if (typeof item === 'string') {
      return { name: `attachment-${index + 1}`, url: item };
    }
    return {
      name: item.name || item.fileName || item.title || `attachment-${index + 1}`,
      url: item.url || item.href || item.downloadUrl,
      mimeType: item.mimeType || item.type || 'application/pdf',
      noticeId: item.noticeId
    };
  });

  return combined.filter((a) => a.url || a.noticeId);
}

async function downloadToFile(url, destPath, timeout = 20000) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout,
    maxRedirects: 5,
    validateStatus: (s) => s < 400
  });
  fs.writeFileSync(destPath, response.data);
  return response.headers['content-type'] || 'application/octet-stream';
}

async function createPlaceholderFile(destPath, label) {
  const content = `Tender360 discovery placeholder — ${label}\nGenerated for demo when portal file is unavailable.\n`;
  fs.writeFileSync(destPath, content, 'utf8');
  return 'text/plain';
}

class AttachmentHarvestService {
  /**
   * TB-004 — Download portal attachments into tenant document store.
   * TB-005 — SAM.gov fallback when primary connector returned no files.
   */
  async harvestForOpportunity({
    companyId,
    userId,
    tenderId,
    opportunity,
    primaryConnector,
    samConfig
  }) {
    let attachments = normalizeAttachmentList(opportunity);
    let samFallbackUsed = false;

    if (!attachments.length && samConfig?.apiKey && opportunity.externalId) {
      const sam = new SamGovConnector();
      const samFiles = await sam.fetchAttachments({
        noticeId: opportunity.externalId,
        config: samConfig
      });
      if (samFiles.length) {
        attachments = samFiles;
        samFallbackUsed = true;
      }
    }

    const results = { downloaded: 0, failed: 0, documents: [], samFallbackUsed };

    if (!attachments.length) {
      return results;
    }

    const uploadDir = ensureUploadDir(companyId);

    for (const attachment of attachments) {
      try {
        const safeName = String(attachment.name || 'document')
          .replace(/[^a-zA-Z0-9._-]/g, '_')
          .slice(0, 120);
        const filename = `${Date.now()}-${safeName}`;
        const destPath = path.join(uploadDir, filename);
        let mimeType = attachment.mimeType || 'application/pdf';

        if (attachment.url && !attachment.url.startsWith('demo://')) {
          try {
            mimeType = await downloadToFile(attachment.url, destPath);
          } catch {
            mimeType = await createPlaceholderFile(destPath, safeName);
          }
        } else {
          mimeType = await createPlaceholderFile(destPath, safeName);
        }

        const relativePath = path.join(String(companyId), 'discovery', filename);
        const stat = fs.statSync(destPath);

        const document = await Document.create({
          companyId,
          name: attachment.name || safeName,
          type: 'TENDER_DOCUMENT',
          storage: {
            path: relativePath,
            filename,
            originalName: attachment.name || safeName,
            mimeType,
            size: stat.size
          },
          tenderRecord: {
            isCreated: true,
            tenderId,
            createdAt: new Date()
          },
          uploadedBy: userId,
          tags: ['discovery', primaryConnector, samFallbackUsed ? 'sam_fallback' : 'portal'].filter(Boolean)
        });

        results.documents.push(document);
        results.downloaded += 1;
      } catch (error) {
        results.failed += 1;
      }
    }

    return results;
  }
}

module.exports = new AttachmentHarvestService();
