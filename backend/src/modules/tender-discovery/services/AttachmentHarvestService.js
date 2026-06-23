const fs = require('fs');
const path = require('path');
const axios = require('axios');
const xlsx = require('xlsx');
const Document = require('../../../models/Document');
const SamGovConnector = require('../../../services/connectors/SamGovConnector');
const WebScrapeConnector = require('../../../services/connectors/WebScrapeConnector');

const UPLOAD_ROOT = path.join(__dirname, '../../../../uploads');

function ensureUploadDir(companyId) {
  const dir = path.join(UPLOAD_ROOT, String(companyId), 'discovery');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function isDemoUrl(url) {
  return typeof url === 'string' && url.startsWith('demo://');
}

/**
 * Materialize curated demo portal files for TB-004 when connectors return demo:// URLs.
 * pricing.xlsx is structured for TB-009 XLSX column parsing.
 */
function materializeDemoAttachment(url, destPath) {
  const resource = String(url || '')
    .replace(/^demo:\/\//i, '')
    .replace(/\\/g, '/')
    .toLowerCase();

  if (resource.endsWith('pricing.xlsx') || resource.includes('/pricing')) {
    const rows = [
      ['Line', 'Qty', 'UOM', 'Description', 'SKU', 'Unit Price', 'Line Total'],
      [1, 4, 'EA', 'Immunoassay analyzer module', 'DIAG-8842-A', 12500, 50000],
      [2, 12, 'EA', 'Calibration kit annual supply', 'CAL-220', 450, 5400],
      [3, 2, 'EA', 'Point-of-care connectivity hub', 'POC-HUB-9', 3200, 6400]
    ];
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, xlsx.utils.aoa_to_sheet(rows), 'Pricing');
    xlsx.writeFile(workbook, destPath);
    return {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      demoResource: 'govwin/pricing.xlsx'
    };
  }

  if (resource.endsWith('solicitation.pdf') || resource.includes('/solicitation')) {
    const text = [
      'REQUEST FOR PROPOSAL — Hospital Diagnostics Refresh',
      'Organization: MediCare Demo Health System',
      'Program Summary: Multi-year capital program for core laboratory and point-of-care expansion including cold chain.',
      'Scope: Immunoassay analyzers, calibration kits, and connectivity hubs for a 400-bed hospital network.',
      'Response deadline: 2026-08-15',
      'Contact: procurement.demo@healthsystem.example | +1-617-555-0100',
      'Location: Boston, MA',
      'Estimated value: USD 618,000',
      '',
      'Evaluation criteria: technical capability, service coverage, and total cost of ownership.'
    ].join('\n');
    fs.writeFileSync(destPath, text, 'utf8');
    return { mimeType: 'text/plain', demoResource: 'govwin/solicitation.pdf' };
  }

  const label = resource || 'demo-attachment';
  const content = `Tender360 discovery demo file — ${label}\nGenerated for connector preview when live portal download is unavailable.\n`;
  fs.writeFileSync(destPath, content, 'utf8');
  return { mimeType: 'text/plain', demoResource: label };
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

async function downloadToFile(url, destPath, timeout = 20000, cookiesHeader = null) {
  const headers = {};
  if (cookiesHeader) {
    headers['Cookie'] = cookiesHeader;
    headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Tender360-DiscoveryBot/1.0';
  }

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout,
    maxRedirects: 5,
    headers,
    validateStatus: (s) => s < 400
  });
  fs.writeFileSync(destPath, response.data);
  return response.headers['content-type'] || 'application/octet-stream';
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
    samConfig,
    scrapeConfig
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

    let cookiesHeader = null;
    if (scrapeConfig && scrapeConfig.loginUrl && scrapeConfig.loginUsername) {
      try {
        const scraper = new WebScrapeConnector();
        const cookies = await scraper.getAuthCookies(scrapeConfig);
        if (cookies && cookies.length) {
          cookiesHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        }
      } catch (e) {
        console.warn('Failed to retrieve cookies via WebScrapeConnector for attachment harvest', e);
      }
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
        let demoMaterialized = false;

        if (isDemoUrl(attachment.url)) {
          const demo = materializeDemoAttachment(attachment.url, destPath);
          mimeType = demo.mimeType;
          demoMaterialized = true;
        } else if (attachment.url) {
          try {
            mimeType = await downloadToFile(attachment.url, destPath, 20000, cookiesHeader);
          } catch (err) {
            throw new Error(`Failed to download ${attachment.url}: ${err.message}`);
          }
        } else if (attachment.noticeId && samConfig?.apiKey) {
          const sam = new SamGovConnector();
          const samFiles = await sam.fetchAttachments({
            noticeId: attachment.noticeId,
            config: samConfig
          });
          const match = samFiles[0];
          if (!match?.url) {
            throw new Error(`SAM.gov returned no file for notice ${attachment.noticeId}`);
          }
          mimeType = await downloadToFile(match.url, destPath, 20000, cookiesHeader);
        } else {
          throw new Error('Attachment has no downloadable URL or SAM notice id');
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
          tags: [
            'discovery',
            primaryConnector,
            samFallbackUsed ? 'sam_fallback' : 'portal',
            demoMaterialized ? 'demo_harvest' : null
          ].filter(Boolean),
          downloadStatus: 'completed'
        });

        results.documents.push(document);
        results.downloaded += 1;
      } catch (error) {
        console.warn(
          `Attachment harvest failed for ${attachment.name || attachment.url}:`,
          error.message
        );
        results.failed += 1;
      }
    }

    return results;
  }
}

module.exports = new AttachmentHarvestService();
module.exports.materializeDemoAttachment = materializeDemoAttachment;
module.exports.isDemoUrl = isDemoUrl;
