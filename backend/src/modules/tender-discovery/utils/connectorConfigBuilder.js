/**
 * Build runtime connector config from a TenderSource document.
 */
function buildConnectorConfigFromSource(source = {}, company = null) {
  const discovery = source.discoveryConfig || {};
  const auth = source.authCredentials || {};
  const scraping = source.scrapingConfig || {};

  const baseUrl = (discovery.baseUrl || source.url || '').replace(/\/$/, '');
  const lookbackHours = Number(discovery.lookbackHours) || 24;
  const modifiedSince = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString();
  const lookbackStart = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  const formatSamDate = (d) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

  return {
    baseUrl,
    opportunitiesPath: discovery.opportunitiesPath || '/opportunities',
    authType: discovery.authType || (auth.apiKey ? 'bearer' : auth.username ? 'basic' : 'none'),
    apiKey: auth.apiKey || auth.token || discovery.apiKey,
    apiKeyHeader: discovery.apiKeyHeader || 'Authorization',
    apiKeyPrefix: discovery.apiKeyPrefix || 'Bearer',
    username: auth.username || scraping.loginUsername,
    password: auth.password || scraping.loginPassword,
    lookbackHours,
    modifiedSince,
    postedFrom: formatSamDate(lookbackStart),
    postedTo: formatSamDate(new Date()),
    pageSize: Number(discovery.pageSize) || 25,
    searchQuery: discovery.searchQuery || '',
    searchParams: discovery.searchParams || {},
    itemsJsonPath: discovery.itemsJsonPath,
    mailbox: auth.username,
    inboundAddress: source.url,
    loginUrl: scraping.loginUrl || baseUrl,
    searchUrl: scraping.searchUrl || source.url,
    resultsContainerSelector: scraping.resultsContainerSelector,
    itemLinkSelector: scraping.itemLinkSelector || 'a[href]',
    parsingConfig: source.parsingConfig || {},
    keywords: source.keywords || [],
    keywordFilePath: source.keywordFilePath || company?.settings?.discovery?.keywordFilePath || null,
    sourceName: source.name
  };
}

function maskSourceCredentials(source) {
  if (!source) return source;
  const doc = source.toObject ? source.toObject() : { ...source };
  if (doc.authCredentials) {
    if (doc.authCredentials.password) doc.authCredentials.password = '********';
    if (doc.authCredentials.apiKey) doc.authCredentials.apiKey = '********';
    if (doc.authCredentials.token) doc.authCredentials.token = '********';
  }
  if (doc.discoveryConfig?.apiKey) doc.discoveryConfig.apiKey = '********';
  if (doc.scrapingConfig?.loginPassword) doc.scrapingConfig.loginPassword = '********';
  return doc;
}

const MASK = '********';

function applyCredentialMerge(existing = {}, incoming = {}) {
  const next = { ...existing, ...incoming };
  ['password', 'apiKey', 'token'].forEach((field) => {
    if (incoming[field] === MASK) {
      next[field] = existing[field];
    }
  });
  return next;
}

module.exports = {
  buildConnectorConfigFromSource,
  maskSourceCredentials,
  applyCredentialMerge,
  MASK
};
