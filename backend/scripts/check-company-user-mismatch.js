require('dotenv').config();
require('../src/models');
const mongoose = require('mongoose');
const Company = require('../src/models/Company');
const User = require('../src/models/User');
const TenderSource = require('../src/models/TenderSource');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const companies = await Company.find({ code: { $in: ['MEDICARE', 'TECHCORP', 'BUILDRIGHT'] } }).select('name code _id isDeleted organizationKind');
  const users = await User.find({ email: { $in: ['admin@medicare.com', 'admin@techcorp.com', 'admin@buildright.com'] } }).select('email companyId isActive');
  const out = [];
  for (const user of users) {
    const company = companies.find((item) => String(item._id) === String(user.companyId));
    out.push({
      email: user.email,
      userCompanyId: String(user.companyId),
      matchedCompany: company ? { id: String(company._id), name: company.name, code: company.code } : null,
      sourcesForUserCompany: await TenderSource.countDocuments({ companyId: user.companyId, isDeleted: false })
    });
  }
  console.log(JSON.stringify({ companies: companies.map((company) => ({
    id: String(company._id),
    name: company.name,
    code: company.code,
    isDeleted: company.isDeleted,
    organizationKind: company.organizationKind,
    sources: 0
  })), users: out }, null, 2));
  for (const company of companies) {
    company.sources = await TenderSource.countDocuments({ companyId: company._id, isDeleted: false });
  }
  console.log(JSON.stringify({ companiesWithSources: companies.map((company) => ({
    id: String(company._id),
    code: company.code,
    sources: company.sources
  })) }, null, 2));
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
