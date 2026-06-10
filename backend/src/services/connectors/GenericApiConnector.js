const axios = require('axios');
const BaseConnector = require('./BaseConnector');

function pickItems(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;
  if (payload.data && Array.isArray(payload.data.items)) return payload.data.items;
  if (payload.data && Array.isArray(payload.data.results)) return payload.data.results;
  return [];
}

function buildAuthHeaders(config) {
  const headers = { Accept: 'application/json' };
  const { authType, apiKey, apiKeyHeader, apiKeyPrefix, username, password } = config;

  if (!apiKey && authType !== 'basic') return headers;

  if (authType === 'basic' && username) {
    const token = Buffer.from(`${username}:${password || ''}`).toString('base64');
    headers.Authorization = `Basic ${token}`;
    return headers;
  }

  if (authType === 'api_key' && apiKey) {
    headers[apiKeyHeader || 'X-API-Key'] = apiKey;
    return headers;
  }

  if (apiKey) {
    const prefix = apiKeyPrefix === 'none' ? '' : `${apiKeyPrefix || 'Bearer'} `;
    headers[apiKeyHeader || 'Authorization'] =
      prefix.trim() && apiKeyPrefix !== 'none' ? `${prefix}${apiKey}` : apiKey;
  }

  return headers;
}

class GenericApiConnector extends BaseConnector {
  constructor() {
    super('generic_api', 'Generic REST API');
  }

  validateConfig(config = {}) {
    if (!config.baseUrl) {
      throw new Error('Generic API connector requires baseUrl (discovery endpoint URL)');
    }
  }

  async discover({ config = {}, cursor, limit = 25 }) {
    this.validateConfig(config);

    const path = config.opportunitiesPath || '/opportunities';
    const url = `${config.baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;

    const params = {
      page: cursor ? Number(cursor) : 1,
      pageSize: limit,
      limit,
      modifiedSince: config.modifiedSince,
      q: config.searchQuery || undefined,
      ...config.searchParams
    };

    Object.keys(params).forEach((key) => {
      if (params[key] === undefined || params[key] === '') delete params[key];
    });

    const response = await axios.get(url, {
      headers: buildAuthHeaders(config),
      params,
      timeout: 30000,
      validateStatus: (status) => status < 500
    });

    if (response.status >= 400) {
      throw new Error(
        response.data?.message || `API request failed with status ${response.status}`
      );
    }

    const records = pickItems(response.data);
    const opportunities = records.map((record) =>
      this.normalizeOpportunity(record, {
        name: config.sourceName || 'Generic API',
        organization: record.agencyName || record.organization
      })
    );

    const currentPage = cursor ? Number(cursor) : 1;
    const hasMore = records.length >= limit;
    const nextCursor = hasMore ? String(currentPage + 1) : null;

    return {
      opportunities,
      nextCursor,
      logs: [
        {
          level: 'info',
          message: `Generic API returned ${records.length} opportunities from ${url}`
        }
      ]
    };
  }

  async testConnection({ config = {} }) {
    this.validateConfig(config);
    const result = await this.discover({ config, limit: 1 });
    return {
      ok: true,
      message: `Connection successful. Sample opportunities: ${result.opportunities.length}.`,
      sampleCount: result.opportunities.length
    };
  }
}

module.exports = GenericApiConnector;
