const Tender = require('../../../models/Tender');
const TenderSource = require('../../../models/TenderSource');
const Company = require('../../../models/Company');
const TenderDiscoveryJob = require('../models/TenderDiscoveryJob');
const TenderDiscoveryLog = require('../models/TenderDiscoveryLog');
const TenderImportBatch = require('../models/TenderImportBatch');
const { getConnector } = require('../../../services/connectors');
const { resolveConnectorType } = require('../utils/resolveConnectorType');
const { buildConnectorConfigFromSource } = require('../utils/connectorConfigBuilder');
const { buildOpportunityContentHash } = require('../utils/opportunityContentHash');
const { applyMetadataToTender } = require('./DiscoveryMetadataService');
const attachmentHarvestService = require('./AttachmentHarvestService');
const tenderIntelligenceService = require('../../tender-intelligence/services/TenderIntelligenceService');
const webhookDispatcher = require('../../integrations/services/WebhookDispatcherService');

async function appendLog(companyId, jobId, level, message, metadata) {
  await TenderDiscoveryLog.create({
    companyId,
    jobId,
    level,
    message,
    metadata
  });
}

function buildExternalKey(connectorType, externalId) {
  return `${connectorType}:${externalId}`;
}

function buildSamFallbackConfig(companyId) {
  return {
    apiKey: process.env.SAM_GOV_API_KEY
  };
}

function triggerTenderIntelligence(companyId, tenderId) {
  tenderIntelligenceService.runFullIntelligenceForTender(companyId, tenderId).catch((err) => {
    console.warn(`Tender intelligence TB-006–010 skipped for ${tenderId}:`, err.message);
  });
}

async function importOpportunities({
  companyId,
  userId,
  job,
  batch,
  opportunities,
  connectorConfig,
  samFallbackConfig
}) {
  let imported = 0;
  let recordsNew = 0;
  let recordsUpdated = 0;
  let duplicates = 0;
  let failed = 0;
  let attachmentsDownloaded = 0;
  let attachmentsFailed = 0;
  let samFallbackCount = 0;
  const externalReferenceKeys = [];
  const processedOpportunities = [];

  for (const opportunity of opportunities) {
    try {
      const contentHash = buildOpportunityContentHash(opportunity);
      opportunity.contentHash = contentHash;

      const externalKey = buildExternalKey(job.connectorType, opportunity.externalId);
      externalReferenceKeys.push(externalKey);

      const existing = await Tender.findOne({
        companyId,
        isDeleted: false,
        'discovery.externalKey': externalKey
      });

      if (existing) {
        const unchanged = existing.discovery?.contentHash === contentHash;
        if (unchanged) {
          duplicates += 1;
          existing.discovery.lastSyncedAt = new Date();
          existing.discovery.changeStatus = 'unchanged';
          await existing.save();
          continue;
        }

        existing.title = opportunity.title || existing.title;
        existing.organization = opportunity.organization || existing.organization;
        existing.location = opportunity.location || existing.location;
        existing.description = opportunity.description || existing.description;
        existing.estimatedValue = opportunity.estimatedValue ?? existing.estimatedValue;
        existing.deadline = opportunity.deadline || existing.deadline;
        existing.discovery.contentHash = contentHash;
        existing.discovery.changeStatus = 'updated';
        existing.discovery.externalUpdatedAt =
          opportunity.externalUpdatedAt || existing.discovery.externalUpdatedAt;
        applyMetadataToTender(existing, opportunity);
        await existing.save();

        const harvest = await attachmentHarvestService.harvestForOpportunity({
          companyId,
          userId,
          tenderId: existing._id,
          opportunity,
          primaryConnector: job.connectorType,
          samConfig: samFallbackConfig
        });

        existing.discovery.attachments = {
          downloaded: (existing.discovery.attachments?.downloaded || 0) + harvest.downloaded,
          failed: (existing.discovery.attachments?.failed || 0) + harvest.failed,
          samFallbackUsed: harvest.samFallbackUsed,
          documentIds: [
            ...(existing.discovery.attachments?.documentIds || []),
            ...harvest.documents.map((d) => d._id)
          ]
        };
        await existing.save();

        attachmentsDownloaded += harvest.downloaded;
        attachmentsFailed += harvest.failed;
        if (harvest.samFallbackUsed) samFallbackCount += 1;

        recordsUpdated += 1;
        imported += 1;
        processedOpportunities.push({ tenderId: existing._id, opportunity, changeStatus: 'updated' });
        webhookDispatcher.triggerEvent(companyId, 'tender.updated', existing);
        triggerTenderIntelligence(companyId, existing._id);
        continue;
      }

      const tender = await Tender.create({
        companyId,
        reference: opportunity.reference || `DISC-${Date.now()}`,
        title: opportunity.title,
        organization: opportunity.organization,
        location: opportunity.location,
        description: opportunity.description || opportunity.title,
        estimatedValue: opportunity.estimatedValue || 0,
        currency: opportunity.currency || 'USD',
        deadline: opportunity.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        tenderType: opportunity.tenderType || 'Government RFP',
        therapeuticArea: opportunity.therapeuticArea || 'Other',
        source: opportunity.source,
        owner: userId,
        pipelineStage: 'identified',
        status: 'active',
        discovery: {
          externalKey,
          connectorType: job.connectorType,
          importedAt: new Date(),
          contentHash,
          changeStatus: 'new',
          externalUpdatedAt: opportunity.externalUpdatedAt || null
        }
      });

      applyMetadataToTender(tender, opportunity);
      await tender.save();

      const harvest = await attachmentHarvestService.harvestForOpportunity({
        companyId,
        userId,
        tenderId: tender._id,
        opportunity,
        primaryConnector: job.connectorType,
        samConfig: samFallbackConfig
      });

      tender.discovery.attachments = {
        downloaded: harvest.downloaded,
        failed: harvest.failed,
        samFallbackUsed: harvest.samFallbackUsed,
        documentIds: harvest.documents.map((d) => d._id)
      };
      await tender.save();

      attachmentsDownloaded += harvest.downloaded;
      attachmentsFailed += harvest.failed;
      if (harvest.samFallbackUsed) samFallbackCount += 1;

      recordsNew += 1;
      imported += 1;
      processedOpportunities.push({ tenderId: tender._id, opportunity, changeStatus: 'new' });
      webhookDispatcher.triggerEvent(companyId, 'tender.created', tender);
      triggerTenderIntelligence(companyId, tender._id);
    } catch (error) {
      failed += 1;
      await appendLog(companyId, job._id, 'error', error.message, {
        reference: opportunity.reference
      });
    }
  }

  batch.recordsProcessed = opportunities.length;
  batch.recordsImported = imported;
  batch.recordsNew = recordsNew;
  batch.recordsUpdated = recordsUpdated;
  batch.duplicatesSkipped = duplicates;
  batch.attachmentsDownloaded = attachmentsDownloaded;
  batch.attachmentsFailed = attachmentsFailed;
  batch.samFallbackUsed = samFallbackCount > 0;
  batch.lookbackHours = connectorConfig?.lookbackHours || job.lookbackHours || 24;
  batch.externalReferenceKeys = externalReferenceKeys;
  batch.status = failed > 0 && imported === 0 ? 'failed' : 'completed';
  batch.completedAt = new Date();
  await batch.save();

  job.stats.discovered = opportunities.length;
  job.stats.imported = imported;
  job.stats.new = recordsNew;
  job.stats.updated = recordsUpdated;
  job.stats.duplicates = duplicates;
  job.stats.attachmentsDownloaded = attachmentsDownloaded;
  job.stats.attachmentsFailed = attachmentsFailed;
  job.stats.samFallbackUsed = samFallbackCount;
  job.stats.failed = failed;
  job.status = batch.status === 'failed' ? 'failed' : 'completed';
  job.completedAt = new Date();
  await job.save();

  if (recordsNew || recordsUpdated) {
    await appendLog(
      companyId,
      job._id,
      'info',
      `TB-003: ${recordsNew} new, ${recordsUpdated} updated, ${duplicates} unchanged (${batch.lookbackHours}h lookback)`
    );
  }

  return {
    imported,
    recordsNew,
    recordsUpdated,
    duplicates,
    failed,
    attachmentsDownloaded,
    attachmentsFailed,
    samFallbackCount,
    processedOpportunities
  };
}

class DiscoveryService {
  async createJob({
    companyId,
    userId,
    connectorType,
    sourceId,
    trigger = 'manual',
    scheduledAt,
    payload,
    lookbackHours
  }) {
    const job = await TenderDiscoveryJob.create({
      companyId,
      sourceId,
      connectorType,
      trigger,
      scheduledAt: scheduledAt || new Date(),
      createdBy: userId,
      status: 'queued',
      payload,
      lookbackHours: lookbackHours || 24
    });

    return job;
  }

  async runJob(jobId, { payload } = {}) {
    const job = await TenderDiscoveryJob.findById(jobId);
    if (!job || job.isDeleted) {
      throw new Error('Discovery job not found');
    }

    if (['running', 'completed'].includes(job.status)) {
      return job;
    }

    job.status = 'running';
    job.startedAt = new Date();
    await job.save();

    const batch = await TenderImportBatch.create({
      companyId: job.companyId,
      jobId: job._id,
      connectorType: job.connectorType,
      status: 'processing',
      lookbackHours: job.lookbackHours || 24
    });

    try {
      let source = null;
      let connectorType = job.connectorType;
      let connectorConfig = payload?.connectorConfig || {};

      if (job.sourceId) {
        source = await TenderSource.findOne({
          _id: job.sourceId,
          companyId: job.companyId,
          isDeleted: false
        });
        if (source) {
          connectorType = resolveConnectorType(source);
          const company = await Company.findById(job.companyId).select('settings.discovery').lean();
          connectorConfig = buildConnectorConfigFromSource(source, company);
          job.lookbackHours = connectorConfig.lookbackHours || 24;
          batch.lookbackHours = job.lookbackHours;
          await job.save();
          await batch.save();

          if (connectorType === 'sam_gov' && !connectorConfig.apiKey) {
            connectorConfig.apiKey = process.env.SAM_GOV_API_KEY;
          }
          if (connectorType === 'govwin' && !connectorConfig.apiKey) {
            connectorConfig.apiKey = process.env.GOVWIN_API_KEY;
            if (!connectorConfig.baseUrl) {
              connectorConfig.baseUrl = process.env.GOVWIN_BASE_URL;
            }
          }

          await appendLog(
            job.companyId,
            job._id,
            'info',
            `TB-002: Scanning bids modified in last ${connectorConfig.lookbackHours}h (modifiedSince ${connectorConfig.modifiedSince})`
          );
        }
      }

      const connector = getConnector(connectorType);
      job.connectorType = connectorType;
      await job.save();

      const result = await connector.discover({
        companyId: job.companyId,
        config: connectorConfig,
        cursor: job.incrementalCursor,
        limit: connectorConfig.pageSize || 25,
        payload: payload || job.payload
      });

      for (const log of result.logs || []) {
        await appendLog(job.companyId, job._id, log.level || 'info', log.message, log.metadata);
      }

      const samFallbackConfig =
        connectorType === 'sam_gov'
          ? connectorConfig
          : buildSamFallbackConfig(job.companyId);

      const importStats = await importOpportunities({
        companyId: job.companyId,
        userId: job.createdBy,
        job,
        batch,
        opportunities: result.opportunities || [],
        connectorConfig,
        samFallbackConfig
      });

      job.incrementalCursor = result.nextCursor || job.incrementalCursor;
      await job.save();

      if (source) {
        await source.updateSyncStatus(true);
        source.newTenders = (source.newTenders || 0) + importStats.recordsNew;
        source.totalTenders = (source.totalTenders || 0) + importStats.recordsNew;
        await source.save();
      }

      if (importStats.attachmentsDownloaded) {
        await appendLog(
          job.companyId,
          job._id,
          'info',
          `TB-004: Downloaded ${importStats.attachmentsDownloaded} attachment(s)${
            importStats.samFallbackCount ? ' (TB-005 SAM.gov fallback used)' : ''
          }`
        );
      }

      return job;
    } catch (error) {
      job.status = 'failed';
      job.errorMessage = error.message;
      job.completedAt = new Date();
      await job.save();

      batch.status = 'failed';
      batch.errorMessage = error.message;
      batch.completedAt = new Date();
      await batch.save();

      await appendLog(job.companyId, job._id, 'error', error.message);
      throw error;
    }
  }

  async listJobs(companyId, { status, limit = 20 } = {}) {
    const query = { companyId, isDeleted: false };
    if (status) query.status = status;
    return TenderDiscoveryJob.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }

  async listLogs(companyId, jobId, limit = 100) {
    return TenderDiscoveryLog.find({ companyId, jobId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async listBatches(companyId, limit = 20) {
    return TenderImportBatch.find({ companyId }).sort({ createdAt: -1 }).limit(limit).lean();
  }

  async getProspectingRtmSummary(companyId) {
    const [sources, recentJobs, recentBatches, metadataTenders] = await Promise.all([
      TenderSource.find({ companyId, isDeleted: false }).lean(),
      this.listJobs(companyId, { limit: 5 }),
      this.listBatches(companyId, 5),
      Tender.find({
        companyId,
        isDeleted: false,
        'discovery.metadata.extractedAt': { $exists: true }
      })
        .select('title reference discovery organization')
        .sort({ 'discovery.metadata.extractedAt': -1 })
        .limit(10)
        .lean()
    ]);

    const lookbackConfigured = sources.filter(
      (s) => (s.discoveryConfig?.lookbackHours ?? 24) === 24
    ).length;

    const totals = recentBatches.reduce(
      (acc, b) => ({
        new: acc.new + (b.recordsNew || 0),
        updated: acc.updated + (b.recordsUpdated || 0),
        attachments: acc.attachments + (b.attachmentsDownloaded || 0),
        samFallback: acc.samFallback + (b.samFallbackUsed ? 1 : 0)
      }),
      { new: 0, updated: 0, attachments: 0, samFallback: 0 }
    );

    return {
      sources,
      recentJobs,
      recentBatches,
      metadataTenders,
      totals,
      lookbackConfigured,
      schedulerPolicy: {
        defaultLookbackHours: 24,
        dailyScanSupported: true
      }
    };
  }
}

module.exports = new DiscoveryService();
