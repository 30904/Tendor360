const BaseConnector = require('./BaseConnector');

class ManualUploadConnector extends BaseConnector {
  constructor() {
    super('manual', 'Manual upload');
  }

  validateConfig() {
  }

  async discover({ payload = {} }) {
    const records = Array.isArray(payload.records) ? payload.records : [];
    const opportunities = records.map((record) =>
      this.normalizeOpportunity(record, { name: payload.sourceName || 'Manual upload' })
    );

    return {
      opportunities,
      nextCursor: null,
      logs: [
        {
          level: 'info',
          message: `Manual upload parsed ${opportunities.length} opportunities`
        }
      ]
    };
  }
}

module.exports = ManualUploadConnector;
