require('dotenv').config();
require('../src/models');
const mongoose = require('mongoose');
const Company = require('../src/models/Company');
const TenderSource = require('../src/models/TenderSource');
const Watchlist = require('../src/models/Watchlist');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const companies = await Company.find({ organizationKind: { $ne: 'supplier' }, isDeleted: false }).select('name code _id');
  const out = [];
  for (const company of companies) {
    out.push({
      name: company.name,
      code: company.code,
      id: String(company._id),
      sources: await TenderSource.countDocuments({ companyId: company._id, isDeleted: false }),
      watchlists: await Watchlist.countDocuments({ companyId: company._id, isDeleted: false })
    });
  }
  const total = await TenderSource.countDocuments({});
  const sample = await TenderSource.find({}).limit(5).select('name companyId isDeleted');
  console.log(JSON.stringify({
    companies: out,
    totalSourcesInDb: total,
    sample: sample.map((source) => ({
      name: source.name,
      companyId: String(source.companyId),
      isDeleted: source.isDeleted
    }))
  }, null, 2));
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
