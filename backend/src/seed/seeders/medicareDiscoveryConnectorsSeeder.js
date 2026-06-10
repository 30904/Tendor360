/**
 * Seeds MediCare Innovations Healthcare Pvt Ltd intelligence platform data:
 * - Discovery connectors (TenderSource) + watchlists
 * - Integration connector catalog (configured flags on platform config)
 * - Scoring profile + rules
 *
 * Run: npm run seed:medicare-connectors
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const {
  resolveMedicareCompany,
  seedIntelligencePlatformForCompany
} = require('../data/intelligencePlatformSeed');
const { resolveSeedOwner } = require('../data/sourcesWatchlistsSeedData');

async function seedMedicareIntelligencePlatform() {
  const company = await resolveMedicareCompany();

  if (!company) {
    console.log(
      'MediCare company not found (code MEDICARE or displayName "MediCare Innovations Healthcare Pvt Ltd"). Run company seeder first.'
    );
    return;
  }

  const owner = await resolveSeedOwner(company._id);
  if (!owner) {
    console.log('No active user found for MediCare — run user seeder first.');
    return;
  }

  const result = await seedIntelligencePlatformForCompany(company, owner._id);

  console.log(`\nSeeded ${result.company.displayName || result.company.name} intelligence platform:\n`);

  console.log('Connector credentials (Discovery Connectors page):');
  (result.discovery.sources || []).forEach((s) => {
    console.log(`  • ${s.name} [${s.connectorTemplate}] — ${s.status}`);
  });

  console.log('\nConnector credentials (Intelligence Platform catalog):');
  result.integrationConnectors.forEach((c) => {
    console.log(`  • ${c.displayName} — ${c.status} / configured`);
  });

  console.log('\nScoring profiles:');
  console.log(`  • ${result.scoringProfile.name}`);

  console.log('\nRefresh Admin → Intelligence Platform and Discovery Connectors to see updates.\n');
}

if (require.main === module) {
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
  require('../../models');

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => seedMedicareIntelligencePlatform())
    .then(() => mongoose.disconnect())
    .then(() => {
      console.log('MediCare intelligence platform seed complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('MediCare intelligence platform seed failed:', error);
      process.exit(1);
    });
}

module.exports = seedMedicareIntelligencePlatform;
