const { seedAll } = require('./index');

console.log('🚀 Starting development seeding...');
console.log('This will create all necessary data for Tender360 to run properly.\n');

seedAll()
  .then(() => {
    console.log('\n🎉 Development seeding completed successfully!');
    console.log('\n📋 What was created:');
    console.log('   ✅ 6 User Roles (ADMIN, TENDER_MANAGER, REVIEWER, APPROVER, PRICING_ANALYST, GUEST)');
    console.log('   ✅ 6 Default Users with different roles');
    console.log('   ✅ 5 Sample Tenders across different sectors');
    console.log('   ✅ Sample Documents, Evaluations, Pricing, Calendar Events');
    console.log('   ✅ Sample Contracts, Reports, and System Settings');
    console.log('\n🔑 Default Login Credentials:');
    console.log('   👑 Admin: admin@tender360.com / Admin@123');
    console.log('   👨‍💼 Manager: manager@tender360.com / Manager@123');
    console.log('   👩‍💼 Reviewer: reviewer@tender360.com / Reviewer@123');
    console.log('   👨‍💼 Approver: approver@tender360.com / Approver@123');
    console.log('   👩‍💼 Pricing: pricing@tender360.com / Pricing@123');
    console.log('   👤 Guest: guest@tender360.com / Guest@123');
    console.log('\n🚀 You can now start the application!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
