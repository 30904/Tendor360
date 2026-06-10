const axios = require('axios');
const BaseConnector = require('./BaseConnector');

const SAM_OPPORTUNITIES_URL = 'https://api.sam.gov/opportunities/v2/search';
const SAM_NOTICE_DOCS_URL = 'https://api.sam.gov/prod/opportunities/v1/noticedocuments';

class SamGovConnector extends BaseConnector {
  constructor() {
    super('sam_gov', 'SAM.gov');
  }

  validateConfig(config = {}) {
    if (!config.apiKey) {
      throw new Error('SAM.gov connector requires apiKey');
    }
  }

  async discover({ config = {}, cursor, limit = 25 }) {
    this.validateConfig(config);

    const params = {
      api_key: config.apiKey,
      limit,
      postedFrom: config.postedFrom,
      postedTo: config.postedTo,
      offset: cursor ? Number(cursor) : 0
    };

    const response = await axios.get(SAM_OPPORTUNITIES_URL, {
      params,
      timeout: 30000,
      validateStatus: (status) => status < 500
    });

    if (response.status >= 400) {
      throw new Error(
        response.data?.errorMessage ||
          response.data?.message ||
          `SAM.gov request failed with status ${response.status}`
      );
    }

    const records = response.data?.opportunitiesData || response.data?.data || [];
    const opportunities = records.map((record) => {
      const resourceLinks = record.resourceLinks || record.attachments || [];
      return this.normalizeOpportunity(
        {
          externalId: record.noticeId || record.solicitationNumber,
          reference: record.solicitationNumber || record.noticeId,
          title: record.title,
          organization: record.department || record.subTier,
          location: record.placeOfPerformance?.city?.name || record.officeAddress?.city,
          description: record.description,
          deadline: record.responseDeadLine || record.archiveDate,
          estimatedValue: record.award?.amount,
          externalUpdatedAt: record.modifiedDate || record.postedDate,
          attachments: resourceLinks.map((link, idx) => ({
            name: link.description || link.name || `SAM attachment ${idx + 1}`,
            url: link.href || link.url,
            mimeType: link.type || 'application/pdf'
          }))
        },
        { name: 'SAM.gov' }
      );
    });

    const nextCursor =
      records.length === limit ? String((params.offset || 0) + records.length) : null;

    return {
      opportunities,
      nextCursor,
      logs: [
        {
          level: 'info',
          message: `SAM.gov returned ${records.length} opportunities`
        }
      ]
    };
  }
  /**
   * TB-005 — Fetch notice documents when GovWin (or other) feed has no attachments.
   */
  async fetchAttachments({ noticeId, config = {} }) {
    if (!noticeId || !config.apiKey) return [];

    try {
      const response = await axios.get(SAM_NOTICE_DOCS_URL, {
        params: { noticeId, api_key: config.apiKey },
        timeout: 20000,
        validateStatus: (status) => status < 500
      });

      if (response.status >= 400) return [];

      const docs = response.data?.noticeDocuments || response.data?.documents || response.data || [];
      const list = Array.isArray(docs) ? docs : [];

      return list
        .map((doc, idx) => ({
          name: doc.name || doc.fileName || doc.title || `SAM.gov document ${idx + 1}`,
          url: doc.url || doc.href || doc.downloadUrl,
          mimeType: doc.mimeType || 'application/pdf',
          noticeId
        }))
        .filter((d) => d.url);
    } catch {
      return [];
    }
  }
}

module.exports = SamGovConnector;
