require('dotenv').config();
require('../src/models');
const mongoose = require('mongoose');
const Company = require('../src/models/Company');
const TenderSource = require('../src/models/TenderSource');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const ids = ['68ce3d9d4ed88667407d88b2', '68ce3d9d4ed88667407d88a8'];
  for (const id of ids) {
    const company = await Company.findById(id).select('name code');
    const sources = await TenderSource.countDocuments({ companyId: id, isDeleted: false });
    console.log(JSON.stringify({ id, company: company ? { name: company.name, code: company.code } : null, sources }));
  }
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
