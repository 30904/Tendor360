require('dotenv').config();
require('../src/models');
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({ email: { $in: ['admin@medicare.com', 'admin@techcorp.com'] } }).select('email companyId isActive isDeleted createdAt');
  console.log(JSON.stringify(users.map((user) => ({
    email: user.email,
    id: String(user._id),
    companyId: String(user.companyId),
    isActive: user.isActive,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt
  })), null, 2));
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
