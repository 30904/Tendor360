const mongoose = require('mongoose');
const Company = require('../models/Company');
const TenderSource = require('../models/TenderSource');
const { getConnector, getConnectorCatalog } = require('../services/connectors');
const discoveryService = require('../modules/tender-discovery/services/DiscoveryService');
const { resolveConnectorType } = require('../modules/tender-discovery/utils/resolveConnectorType');
const {
  buildConnectorConfigFromSource,
  maskSourceCredentials
} = require('../modules/tender-discovery/utils/connectorConfigBuilder');
const { resolveCompanyObjectId } = require('../utils/resolveCompanyObjectId');
const { ensureIntelligencePlatformForCompanyId } = require('../seed/data/intelligencePlatformSeed');

const getCatalog = async (req, res) => {
  res.json({
    success: true,
    data: {
      catalog: getConnectorCatalog(),
      frequencies: ['realtime', 'hourly', 'every_4_hours', 'daily', 'weekly', 'monthly'],
      integrationModes: ['api', 'web_scraping', 'email', 'manual'],
      authTypes: ['none', 'bearer', 'api_key', 'basic']
    }
  });
};

const testConnection = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    let sourcePayload = req.body;

    if (req.body.sourceId) {
      const source = await TenderSource.findOne({
        _id: req.body.sourceId,
        companyId: new mongoose.Types.ObjectId(companyId),
        isDeleted: false
      });
      if (!source) {
        return res.status(404).json({ success: false, message: 'Discovery connector not found' });
      }
      sourcePayload = source.toObject();
    }

    const connectorType = resolveConnectorType(sourcePayload);
    let config = buildConnectorConfigFromSource(sourcePayload);

    if (connectorType === 'sam_gov' && !config.apiKey) {
      config.apiKey = process.env.SAM_GOV_API_KEY;
    }
    if (connectorType === 'govwin' && !config.apiKey) {
      config.apiKey = process.env.GOVWIN_API_KEY;
      if (!config.baseUrl) config.baseUrl = process.env.GOVWIN_BASE_URL;
    }

    const connector = getConnector(connectorType);

    if (typeof connector.testConnection === 'function') {
      const testResult = await connector.testConnection({ config });
      return res.json({
        success: true,
        data: { connectorType, ...testResult },
        message: testResult.message
      });
    }

    connector.validateConfig(config);
    const preview = await connector.discover({ config, limit: 1 });
    res.json({
      success: true,
      data: {
        connectorType,
        ok: true,
        sampleCount: (preview.opportunities || []).length,
        logs: preview.logs || []
      },
      message: `Connection OK. Preview returned ${(preview.opportunities || []).length} opportunity(ies).`
    });
  } catch (error) {
    console.error('Test discovery connector error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Connection test failed'
    });
  }
};

const runDiscoveryNow = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const source = await TenderSource.findOne({
      _id: id,
      companyId: new mongoose.Types.ObjectId(companyId),
      isDeleted: false
    });

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Discovery connector not found'
      });
    }

    const connectorType = resolveConnectorType(source);
    const job = await discoveryService.createJob({
      companyId,
      userId: req.user._id,
      connectorType,
      sourceId: source._id,
      trigger: 'manual'
    });

    const completedJob = await discoveryService.runJob(job._id);
    const TenderDiscoveryJob = require('../modules/tender-discovery/models/TenderDiscoveryJob');
    const freshJob = await TenderDiscoveryJob.findById(completedJob._id).lean();

    const updatedSource = await TenderSource.findById(source._id);
    res.json({
      success: true,
      data: {
        source: maskSourceCredentials(updatedSource),
        job: freshJob
      },
      message: `Discovery run completed. Imported ${freshJob?.stats?.imported ?? 0} opportunity(ies).`
    });
  } catch (error) {
    console.error('Run discovery error:', error);
    const source = await TenderSource.findById(req.params.id).catch(() => null);
    if (source) {
      await source.updateSyncStatus(false, error.message);
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Discovery run failed'
    });
  }
};

/**
 * Seed discovery connectors + intelligence platform data for the logged-in tenant.
 * Fixes empty Discovery Connectors when DB was re-seeded but the session still has an old companyId.
 */
const seedDemoPlatform = async (req, res) => {
  try {
    const companyOid = resolveCompanyObjectId(req.companyId || req.user?.companyId);
    if (!companyOid) {
      return res.status(400).json({ success: false, message: 'Company context required' });
    }

    const company = await Company.findById(companyOid);
    if (!company || company.isDeleted) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const outcome = await ensureIntelligencePlatformForCompanyId(companyOid);
    if (!outcome) {
      return res.status(500).json({ success: false, message: 'Unable to seed platform data' });
    }

    if (outcome.skipped && outcome.reason === 'no_owner') {
      return res.status(400).json({
        success: false,
        message: 'No active user found for this company. Log out and sign in again, or run the user seeder.'
      });
    }

    const connectorCount =
      outcome.connectorCount ??
      (await TenderSource.countDocuments({ companyId: companyOid, isDeleted: false }));

    const label = company.displayName || company.name;

    res.json({
      success: true,
      message: outcome.skipped
        ? `${label} already has ${connectorCount} discovery connector(s).`
        : `Loaded ${connectorCount} healthcare discovery connectors for ${label}.`,
      data: {
        company: {
          id: company._id,
          name: company.name,
          displayName: company.displayName,
          code: company.code
        },
        connectorCount,
        seeded: !outcome.skipped
      }
    });
  } catch (error) {
    console.error('Seed demo platform error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed discovery connectors'
    });
  }
};

module.exports = {
  getCatalog,
  testConnection,
  runDiscoveryNow,
  seedDemoPlatform
};
