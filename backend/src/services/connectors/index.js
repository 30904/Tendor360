const GovWinConnector = require('./GovWinConnector');
const SamGovConnector = require('./SamGovConnector');
const EmailTenderConnector = require('./EmailTenderConnector');
const ManualUploadConnector = require('./ManualUploadConnector');
const GenericApiConnector = require('./GenericApiConnector');
const WebScrapeConnector = require('./WebScrapeConnector');

const CONNECTOR_REGISTRY = {
  govwin: new GovWinConnector(),
  sam_gov: new SamGovConnector(),
  email: new EmailTenderConnector(),
  manual: new ManualUploadConnector(),
  generic_api: new GenericApiConnector(),
  web_scrape: new WebScrapeConnector()
};

const CONNECTOR_CATALOG = [
  {
    key: 'generic_api',
    displayName: 'Generic REST API',
    integrationMode: 'api',
    description: 'Any HTTP JSON discovery API with configurable base URL, path, and auth.',
    fields: ['baseUrl', 'opportunitiesPath', 'authType', 'apiKey', 'lookbackHours', 'searchQuery']
  },
  {
    key: 'govwin',
    displayName: 'GovWin-style API',
    integrationMode: 'api',
    description: 'REST opportunities endpoint with Bearer API key (GovWin-compatible).',
    fields: ['baseUrl', 'apiKey', 'lookbackHours']
  },
  {
    key: 'sam_gov',
    displayName: 'SAM.gov API',
    integrationMode: 'api',
    description: 'US SAM.gov opportunities search API.',
    fields: ['apiKey', 'lookbackHours', 'searchQuery']
  },
  {
    key: 'web_scrape',
    displayName: 'Web scraping',
    integrationMode: 'web_scraping',
    description: 'Parse public listing pages for tender links (no headless browser).',
    fields: ['searchUrl', 'loginUrl', 'keywords', 'itemLinkSelector']
  },
  {
    key: 'email',
    displayName: 'Email ingestion',
    integrationMode: 'email',
    description: 'Mailbox-based tender intake (requires Graph integration for full ATS).',
    fields: ['mailbox', 'inboundAddress']
  },
  {
    key: 'manual',
    displayName: 'Manual upload',
    integrationMode: 'manual',
    description: 'Operator-triggered or file-based imports only.',
    fields: []
  }
];

function getConnector(connectorType) {
  const connector = CONNECTOR_REGISTRY[connectorType];
  if (!connector) {
    throw new Error(`Unsupported connector type: ${connectorType}`);
  }
  return connector;
}

function listConnectors() {
  return Object.values(CONNECTOR_REGISTRY).map((connector) => ({
    key: connector.key,
    displayName: connector.displayName
  }));
}

function getConnectorCatalog() {
  return CONNECTOR_CATALOG;
}

module.exports = {
  getConnector,
  listConnectors,
  getConnectorCatalog
};
