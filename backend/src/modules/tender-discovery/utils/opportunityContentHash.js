const crypto = require('crypto');

function buildOpportunityContentHash(opportunity = {}) {
  const payload = [
    opportunity.title,
    opportunity.organization,
    opportunity.description,
    opportunity.deadline ? String(opportunity.deadline) : '',
    opportunity.estimatedValue,
    opportunity.location,
    opportunity.programSummary || ''
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex').slice(0, 24);
}

module.exports = { buildOpportunityContentHash };
