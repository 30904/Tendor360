const discoveryScheduler = require('../modules/tender-discovery/services/DiscoveryScheduler');

function setupSchedulers() {
  if (process.env.DISCOVERY_SCHEDULER_ENABLED !== 'false') {
    discoveryScheduler.start();
  }
}

module.exports = { setupSchedulers };
