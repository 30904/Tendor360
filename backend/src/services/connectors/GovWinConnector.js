const axios = require('axios');
const BaseConnector = require('./BaseConnector');

class GovWinConnector extends BaseConnector {
  constructor() {
    super('govwin', 'GovWin');
  }

  validateConfig(config = {}) {
    if (!config.baseUrl || !config.apiKey) {
      throw new Error('GovWin connector requires baseUrl and apiKey');
    }
  }

  buildDemoOpportunities(config = {}, limit = 5) {
    const prefix = config.sourceName || 'GovWin';
    return Array.from({ length: Math.min(limit, 5) }).map((_, i) => {
      const opportunity = this.normalizeOpportunity(
        {
          externalId: `DEMO-GOVWIN-${Date.now()}-${i}`,
          reference: `DEMO-GW-${1000 + i}`,
          title: `${prefix} — Hospital diagnostics refresh ${i + 1}`,
          organization: 'MediCare Demo Health System',
          description: 'Program summary: immunoassay and point-of-care instrument refresh for 400-bed hospital.',
          programSummary:
            'Multi-year capital program for core laboratory and point-of-care expansion including cold chain.',
          deadline: new Date(Date.now() + (14 + i) * 86400000),
          externalUpdatedAt: new Date(Date.now() - i * 3600000),
          contacts: [{ type: 'email', value: 'procurement.demo@healthsystem.example' }],
          timeline: {
            postedDate: new Date(Date.now() - 86400000),
            updatedDate: new Date(Date.now() - i * 3600000),
            responseDeadline: new Date(Date.now() + (14 + i) * 86400000)
          },
          attachments: [
            { name: 'Solicitation package.pdf', url: 'demo://govwin/solicitation.pdf' },
            { name: 'Pricing worksheet.xlsx', url: 'demo://govwin/pricing.xlsx' }
          ],
          isDemo: true
        },
        { name: 'GovWin (demo)' }
      );
      opportunity.metadata.isDemo = true;
      return opportunity;
    });
  }

  isExplicitDemoMode(config = {}) {
    return config.demoMode === true;
  }

  async discover({ config = {}, cursor, limit = 25 }) {
    if (this.isExplicitDemoMode(config)) {
      return {
        opportunities: this.buildDemoOpportunities(config, limit),
        nextCursor: null,
        isDemo: true,
        logs: [{ level: 'info', message: 'GovWin explicit demo mode — API bypassed (preview data; import gated by DISCOVERY_DEMO_FALLBACK / NODE_ENV)' }]
      };
    }

    this.validateConfig(config);

    const response = await axios.get(`${config.baseUrl.replace(/\/$/, '')}/opportunities`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: 'application/json'
      },
      params: {
        page: cursor ? Number(cursor) : 1,
        pageSize: limit,
        modifiedSince: config.modifiedSince
      },
      timeout: 30000,
      validateStatus: (status) => status < 500
    });

    if (response.status >= 400) {
      throw new Error(
        response.data?.message || `GovWin request failed with status ${response.status}`
      );
    }

    const records = response.data?.items || response.data?.results || [];
    const opportunities = records.map((record) => {
      const attachments = (record.attachments || record.documents || record.resourceLinks || []).map(
        (item, idx) => {
          if (typeof item === 'string') return { name: `GovWin doc ${idx + 1}`, url: item };
          return {
            name: item.name || item.fileName || item.title || `GovWin doc ${idx + 1}`,
            url: item.url || item.href || item.downloadUrl,
            mimeType: item.mimeType || 'application/pdf'
          };
        }
      );

      return this.normalizeOpportunity(
        {
          ...record,
          externalId: record.id || record.opportunityId || record.noticeId,
          reference: record.solicitationNumber || record.reference || record.id,
          title: record.title || record.name,
          organization: record.agencyName || record.agency,
          description: record.description || record.summary || record.programSummary,
          deadline: record.responseDate || record.deadline,
          externalUpdatedAt: record.updatedAt || record.modifiedDate,
          programSummary: record.programSummary || record.summary || record.description,
          contacts: record.contacts || [],
          timeline: {
            postedDate: record.postedDate || record.publishDate,
            updatedDate: record.updatedAt || record.modifiedDate,
            responseDeadline: record.responseDate || record.deadline
          },
          attachments
        },
        { name: 'GovWin', organization: record.agencyName }
      );
    });

    const currentPage = cursor ? Number(cursor) : 1;
    const hasMore = records.length === limit;
    const nextCursor = hasMore ? String(currentPage + 1) : null;

    return {
      opportunities,
      nextCursor,
      logs: [
        {
          level: 'info',
          message: `GovWin returned ${records.length} opportunities (lookback ${config.lookbackHours || 24}h)`
        }
      ]
    };
  }

  async testConnection({ config = {} }) {
    if (this.isExplicitDemoMode(config)) {
      const result = await this.discover({ config, limit: 1 });
      return {
        ok: false,
        verified: false,
        isDemo: true,
        message: `Demo preview only — ${result.opportunities.length} sample opportunity(ies). Live GovWin API was not tested.`,
        sampleCount: result.opportunities.length
      };
    }

    this.validateConfig(config);
    const result = await this.discover({ config, limit: 1 });
    return {
      ok: true,
      verified: true,
      isDemo: false,
      message: `GovWin API reachable. Preview count: ${result.opportunities.length}.`,
      sampleCount: result.opportunities.length
    };
  }
}

module.exports = GovWinConnector;
