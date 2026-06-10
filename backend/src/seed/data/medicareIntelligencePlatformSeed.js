const IntegrationConnector = require('../../modules/integrations/models/IntegrationConnector');
const ScoringProfile = require('../../modules/ai-scoring/models/ScoringProfile');
const ScoringRule = require('../../modules/ai-scoring/models/ScoringRule');
const { getConnectorCatalog } = require('../../services/connectors');

const INTEGRATION_CONNECTOR_DEFAULTS = [
  { key: 'govwin', category: 'discovery', health: 'healthy' },
  { key: 'sam_gov', category: 'discovery', health: 'healthy' },
  { key: 'generic_api', category: 'discovery', health: 'healthy' },
  { key: 'web_scrape', category: 'discovery', health: 'healthy' },
  { key: 'email', category: 'discovery', health: 'healthy' },
  { key: 'manual', category: 'discovery', health: 'healthy' }
];

async function seedIntegrationConnectorsForCompany(companyId) {
  const catalogByKey = Object.fromEntries(getConnectorCatalog().map((c) => [c.key, c]));

  const upserted = [];
  for (const item of INTEGRATION_CONNECTOR_DEFAULTS) {
    const meta = catalogByKey[item.key];
    const doc = await IntegrationConnector.findOneAndUpdate(
      { companyId, key: item.key },
      {
        companyId,
        key: item.key,
        displayName: meta?.displayName || item.key,
        category: item.category,
        status: 'active',
        health: item.health,
        config: { configured: true, seededAt: new Date().toISOString() },
        lastCheckedAt: new Date(),
        isDeleted: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted.push(doc);
  }

  return upserted;
}

async function seedScoringProfileForCompany(companyId) {
  await ScoringRule.deleteMany({ companyId });
  await ScoringProfile.deleteMany({ companyId, isDeleted: false });

  const profile = await ScoringProfile.create({
    companyId,
    name: 'Healthcare pursuit & hospital capital scoring',
    description:
      'Weights relevancy for hospital diagnostics, med-surg capital, public health laboratory, and GPO refresh opportunities.',
    isDefault: true,
    thresholds: { pursue: 78, review: 58, decline: 40 }
  });

  const rules = [
    { dimension: 'relevancy', weight: 32, name: 'Clinical & portfolio relevancy' },
    { dimension: 'product_fit', weight: 26, name: 'Product & modality fit' },
    { dimension: 'strategic', weight: 18, name: 'Strategic account priority' },
    { dimension: 'customer_fit', weight: 14, name: 'Customer & IDN fit' },
    { dimension: 'risk', weight: 10, name: 'Compliance & delivery risk' }
  ];

  await ScoringRule.insertMany(
    rules.map((rule) => ({
      companyId,
      profileId: profile._id,
      name: rule.name,
      dimension: rule.dimension,
      weight: rule.weight,
      enabled: true
    }))
  );

  return profile;
}

module.exports = {
  seedIntegrationConnectorsForCompany,
  seedScoringProfileForCompany
};
