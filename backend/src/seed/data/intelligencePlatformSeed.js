const Company = require('../../models/Company');
const TenderSource = require('../../models/TenderSource');
const {
  resolveSeedOwner,
  seedSourcesWatchlistsForCompany
} = require('./sourcesWatchlistsSeedData');
const {
  seedIntegrationConnectorsForCompany,
  seedScoringProfileForCompany
} = require('./medicareIntelligencePlatformSeed');
const { seedSalesforceCrmForCompany } = require('./salesforceCrmSeed');
const { seedEmailTenderDemoForCompany } = require('./emailTenderDemoSeed');

async function resolveMedicareCompany() {
  return Company.findOne({
    isDeleted: false,
    $or: [
      { code: 'MEDICARE' },
      { displayName: /MediCare Innovations Healthcare/i },
      { name: /MediCare Innovations/i }
    ]
  });
}

/**
 * Seed discovery connectors, integration catalog, and scoring for a buyer company.
 * Uses healthcare templates when industry is HEALTHCARE or code is MEDICARE.
 */
async function seedIntelligencePlatformForCompany(company, ownerId) {
  const discovery = await seedSourcesWatchlistsForCompany(company, ownerId);
  const integrationConnectors = await seedIntegrationConnectorsForCompany(company._id);
  const scoringProfile = await seedScoringProfileForCompany(company._id);
  const crmAccounts = await seedSalesforceCrmForCompany(company._id);
  const emailTenderDemo = await seedEmailTenderDemoForCompany(company._id);

  return {
    company: {
      id: company._id,
      name: company.name,
      displayName: company.displayName,
      code: company.code
    },
    discovery,
    integrationConnectors,
    scoringProfile,
    crmAccounts,
    emailTenderDemo,
    connectorCount: (discovery.sources || []).length
  };
}

async function ensureIntelligencePlatformForCompanyId(companyId) {
  const company = await Company.findById(companyId);
  if (!company || company.isDeleted) return null;

  const count = await TenderSource.countDocuments({
    companyId: company._id,
    isDeleted: false
  });
  if (count > 0) return { skipped: true, company, connectorCount: count };

  const owner = await resolveSeedOwner(company._id);
  if (!owner) return { skipped: true, company, reason: 'no_owner' };

  const result = await seedIntelligencePlatformForCompany(company, owner._id);
  return { skipped: false, ...result };
}

async function ensureIntelligencePlatformForAllBuyers() {
  const companies = await Company.find({
    isDeleted: false,
    organizationKind: { $ne: 'supplier' }
  });

  const results = [];
  for (const company of companies) {
    const outcome = await ensureIntelligencePlatformForCompanyId(company._id);
    if (outcome && !outcome.skipped) {
      results.push(outcome);
      console.log(
        `  ✓ Seeded ${outcome.connectorCount} discovery connectors for ${outcome.company.displayName || outcome.company.name}`
      );
    }
  }
  return results;
}

module.exports = {
  resolveMedicareCompany,
  seedIntelligencePlatformForCompany,
  ensureIntelligencePlatformForCompanyId,
  ensureIntelligencePlatformForAllBuyers
};
