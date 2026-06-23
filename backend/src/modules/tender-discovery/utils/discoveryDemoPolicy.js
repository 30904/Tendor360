/**
 * Controls when curated DEMO-* discovery opportunities may be persisted as tenders.
 * Connector demoMode enables API bypass / preview only; import requires explicit env policy.
 */

function isDemoOpportunity(opportunity = {}) {
  return (
    opportunity.metadata?.isDemo === true ||
    String(opportunity.externalId || '').startsWith('DEMO-')
  );
}

function isDemoImportAllowed(connectorConfig = {}) {
  if (connectorConfig.demoMode !== true) {
    return false;
  }
  if (process.env.DISCOVERY_DEMO_FALLBACK === 'true') {
    return true;
  }
  return process.env.NODE_ENV === 'development';
}

function getDemoImportPolicyHint() {
  if (process.env.DISCOVERY_DEMO_FALLBACK === 'true') {
    return 'DISCOVERY_DEMO_FALLBACK is enabled.';
  }
  if (process.env.NODE_ENV === 'development') {
    return 'Running in development mode.';
  }
  return 'Set DISCOVERY_DEMO_FALLBACK=true or NODE_ENV=development to import demo tenders.';
}

function getDemoSkipReason(connectorConfig = {}) {
  if (connectorConfig.demoMode !== true) {
    return 'connector is not in explicit demo mode';
  }
  return `demo import disabled for this environment (${getDemoImportPolicyHint()})`;
}

module.exports = {
  isDemoOpportunity,
  isDemoImportAllowed,
  getDemoImportPolicyHint,
  getDemoSkipReason
};
