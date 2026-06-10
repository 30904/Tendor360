require('dotenv').config();
require('../src/models');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const TenderSource = require('../src/models/TenderSource');

async function main() {
  const email = 'admin@medicare.com';
  const password = 'Admin@123';
  const base = 'http://localhost:5025/api';

  const login = await axios.post(`${base}/auth/login`, { email, password });
  const token = login.data?.data?.accessToken;
  const apiCompany = login.data?.data?.user?.company;
  const sources = await axios.get(`${base}/sources-watchlists/sources`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  await mongoose.connect(process.env.MONGO_URI);
  const dbUser = await User.findOne({ email }).select('companyId email');
  const dbSources = await TenderSource.countDocuments({ companyId: dbUser.companyId, isDeleted: false });

  console.log(JSON.stringify({
    apiCompany,
    apiSources: sources.data?.data?.pagination?.totalItems,
    envMongoUri: process.env.MONGO_URI?.replace(/\/\/.*@/, '//***@'),
    dbUserCompanyId: String(dbUser.companyId),
    dbSources
  }, null, 2));

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error.response?.data || error.message);
  process.exit(1);
});
