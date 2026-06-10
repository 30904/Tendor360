const { listConnectors } = require('../../services/connectors');
const IntegrationConnector = require('../integrations/models/IntegrationConnector');
const TenderSource = require('../../models/TenderSource');

function isConnectorConfigured(connectorKey, connectorRecord) {
  if (connectorRecord?.config?.configured === true) return true;
  if (connectorRecord?.status === 'active') return true;

  if (connectorKey === 'openai') {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  if (connectorKey === 'sam_gov') {
    return Boolean(process.env.SAM_GOV_API_KEY);
  }

  if (connectorKey === 'govwin') {
    return Boolean(process.env.GOVWIN_API_KEY && process.env.GOVWIN_BASE_URL);
  }

  if (connectorKey === 'salesforce') {
    return Boolean(
      process.env.SALESFORCE_ACCESS_TOKEN && process.env.SALESFORCE_INSTANCE_URL
    );
  }

  return false;
}

async function buildConnectorCatalog(companyId) {
  const marketplace = listConnectors();
  const [integrationRecords, tenderSources] = await Promise.all([
    IntegrationConnector.find({ companyId, isDeleted: false }).lean(),
    TenderSource.find({ companyId, isDeleted: false, status: 'active' }).lean()
  ]);

  const configuredTemplates = new Set(
    tenderSources.map((s) => s.connectorTemplate).filter(Boolean)
  );
  const byKey = Object.fromEntries(integrationRecords.map((item) => [item.key, item]));

  return marketplace.map((connector) => {
    const record = byKey[connector.key];
    const fromDiscoverySource = configuredTemplates.has(connector.key);
    const configuredFlag = isConnectorConfigured(connector.key, record) || fromDiscoverySource;

    return {
      key: connector.key,
      displayName: connector.displayName,
      status: configuredFlag ? record?.status || 'active' : 'not_configured',
      health: configuredFlag ? record?.health || 'healthy' : 'unknown',
      configured: configuredFlag,
      message: configuredFlag ? 'Configured' : 'Not configured',
      linkedDiscoverySource: fromDiscoverySource
    };
  });
}

module.exports = {
  buildConnectorCatalog,
  isConnectorConfigured
};
