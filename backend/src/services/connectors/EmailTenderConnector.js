const BaseConnector = require('./BaseConnector');
const emailTenderScanService = require('../../modules/email-tender-scanning/services/EmailTenderScanService');

class EmailTenderConnector extends BaseConnector {
  constructor() {
    super('email', 'Email ingestion');
  }

  validateConfig(config = {}) {
    if (!config.inboundAddress && !config.mailbox) {
      throw new Error('Email connector requires mailbox or inboundAddress');
    }
  }

  async discover({ companyId, config = {} }) {
    this.validateConfig(config);

    if (!companyId) {
      return {
        opportunities: [],
        nextCursor: null,
        logs: [
          {
            level: 'warn',
            message: 'Email discovery requires companyId; configure US/AT mailboxes under Email Tender Scanning.'
          }
        ]
      };
    }

    const result = await emailTenderScanService.runDiscoveryScan(companyId, config);
    const opportunities = (result.opportunities || []).map((raw) =>
      this.normalizeOpportunity(raw, { name: config.sourceName || 'Email inbox' })
    );

    return {
      opportunities,
      nextCursor: result.nextCursor,
      logs: result.logs || []
    };
  }
}

module.exports = EmailTenderConnector;
