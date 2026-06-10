const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Company = require('../../models/Company');
const {
  resolveSeedOwner,
  seedSourcesWatchlistsForCompany
} = require('../data/sourcesWatchlistsSeedData');

async function seedSourcesWatchlistsDemo() {
  const companies = await Company.find({ organizationKind: { $ne: 'supplier' }, isDeleted: false });
  if (!companies.length) {
    console.log('No buyer companies found for sources and watchlists seeding');
    return;
  }

  for (const company of companies) {
    const owner = await resolveSeedOwner(company._id);
    if (!owner) {
      console.log(`Skipping ${company.name}: no active owner user found`);
      continue;
    }

    await seedSourcesWatchlistsForCompany(company, owner._id);
    console.log(`Seeded sources and watchlists for ${company.name}`);
  }
}

if (require.main === module) {
  dotenv.config({ path: path.join(__dirname, '../../../.env') });
  require('../../models');

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => seedSourcesWatchlistsDemo())
    .then(() => mongoose.disconnect())
    .then(() => {
      console.log('Sources and watchlists demo seed complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Sources and watchlists demo seed failed:', error);
      process.exit(1);
    });
}

module.exports = seedSourcesWatchlistsDemo;
