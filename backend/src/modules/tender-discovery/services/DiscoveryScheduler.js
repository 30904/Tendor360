const TenderSource = require('../../../models/TenderSource');
const TenderDiscoveryJob = require('../models/TenderDiscoveryJob');
const discoveryService = require('./DiscoveryService');

const { resolveConnectorType } = require('../utils/resolveConnectorType');

class DiscoveryScheduler {
  constructor() {
    this.timer = null;
    this.running = false;
    this.intervalMs = Number(process.env.DISCOVERY_SCHEDULER_INTERVAL_MS || 60000);
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick().catch((error) => {
        console.error('Discovery scheduler tick failed:', error.message);
      });
    }, this.intervalMs);
    console.log(`🕒 Discovery scheduler started (${this.intervalMs}ms interval)`);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async tick() {
    if (this.running) return;
    this.running = true;

    try {
      const dueSources = await TenderSource.find({
        status: 'active',
        isDeleted: false,
        integrationMode: { $ne: 'manual' },
        'discoveryConfig.scheduleEnabled': { $ne: false },
        $or: [{ nextSync: { $lte: new Date() } }, { nextSync: null }, { lastSync: null }]
      })
        .limit(10)
        .lean();

      for (const source of dueSources) {
        const existingQueued = await TenderDiscoveryJob.findOne({
          companyId: source.companyId,
          sourceId: source._id,
          status: { $in: ['queued', 'running'] }
        }).lean();

        if (existingQueued) continue;

        const connectorType = resolveConnectorType(source);
        const job = await discoveryService.createJob({
          companyId: source.companyId,
          userId: source.owner,
          connectorType,
          sourceId: source._id,
          trigger: 'scheduled'
        });

        await discoveryService.runJob(job._id).catch(() => null);
      }
    } finally {
      this.running = false;
    }
  }
}

module.exports = new DiscoveryScheduler();
