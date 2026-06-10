const User = require('../../models/User');
const Role = require('../../models/Role');
const Company = require('../../models/Company');

const seedUsers = async () => {
  try {
    // Get companies first
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      throw new Error('No companies found. Please seed companies first.');
    }

    // Get role references
    const adminRole = await Role.findOne({ name: 'SYSTEM ADMINISTRATOR' });
    const managerRole = await Role.findOne({ name: 'TENDER MANAGER' });
    const reviewerRole = await Role.findOne({ name: 'REVIEWER' });
    const approverRole = await Role.findOne({ name: 'APPROVER' });
    const pricingRole = await Role.findOne({ name: 'PRICING ANALYST' });
    const guestRole = await Role.findOne({ name: 'GUEST' });

    if (!adminRole || !managerRole) {
      throw new Error('Required roles not found. Please seed roles first.');
    }

    // Use plain passwords - User model will hash them automatically
    const adminPassword = 'Admin@123';
    const managerPassword = 'Manager@123';
    const reviewerPassword = 'Reviewer@123';
    const approverPassword = 'Approver@123';
    const pricingPassword = 'Pricing@123';
    const guestPassword = 'Guest@123';

    // Create users for each company
    for (const company of companies) {
      console.log(`👥 Creating users for company: ${company.name} (${company.code})`);
      
      // Define users for this company
      const users = [
        {
          companyId: company._id,
          name: `${company.name} Administrator`,
          email: `admin@${company.code.toLowerCase()}.com`,
          password: adminPassword,
          roles: [adminRole.name],
          profile: {
            phone: '+91-9876543210',
            department: 'IT',
            position: 'System Administrator'
          },
          isActive: true,
          lastLoginAt: new Date()
        },
        {
          companyId: company._id,
          name: `John Manager`,
          email: `manager@${company.code.toLowerCase()}.com`,
          password: managerPassword,
          roles: [managerRole.name],
          profile: {
            phone: '+91-9876543211',
            department: 'Tender Management',
            position: 'Senior Tender Manager'
          },
          isActive: true,
          lastLoginAt: new Date()
        },
        {
          companyId: company._id,
          name: `Sarah Reviewer`,
          email: `reviewer@${company.code.toLowerCase()}.com`,
          password: reviewerPassword,
          roles: [reviewerRole.name],
          profile: {
            phone: '+91-9876543212',
            department: 'Quality Assurance',
            position: 'Tender Reviewer'
          },
          isActive: true,
          lastLoginAt: new Date()
        },
        {
          companyId: company._id,
          name: `Michael Approver`,
          email: `approver@${company.code.toLowerCase()}.com`,
          password: approverPassword,
          roles: [approverRole.name],
          profile: {
            phone: '+91-9876543213',
            department: 'Management',
            position: 'Senior Manager'
          },
          isActive: true,
          lastLoginAt: new Date()
        },
        {
          companyId: company._id,
          name: `Lisa Analyst`,
          email: `pricing@${company.code.toLowerCase()}.com`,
          password: pricingPassword,
          roles: [pricingRole.name],
          profile: {
            phone: '+91-9876543214',
            department: 'Finance',
            position: 'Pricing Analyst'
          },
          isActive: true,
          lastLoginAt: new Date()
        },
        {
          companyId: company._id,
          name: `Guest User`,
          email: `guest@${company.code.toLowerCase()}.com`,
          password: guestPassword,
          roles: [guestRole.name],
          profile: {
            phone: '+91-9876543215',
            department: 'General',
            position: 'Guest User'
          },
          isActive: true,
          lastLoginAt: new Date()
        }
      ];

      // Insert or update users for this company
      for (const user of users) {
        const existingUser = await User.findOne({ 
          companyId: user.companyId, 
          email: user.email 
        });
        
        if (!existingUser) {
          const createdUser = await User.create(user);
          console.log(`✅ Created user: ${user.email} (${user.name}) for ${company.name} with ID: ${createdUser._id}`);
          console.log(`🔑 Password hash for ${user.email}: ${createdUser.password?.substring(0, 20)}...`);
        } else {
          // Update existing user with fresh password and data
          existingUser.password = user.password; // This will trigger the pre-save hook to hash
          existingUser.name = user.name;
          existingUser.roles = user.roles;
          existingUser.profile = user.profile;
          existingUser.isActive = user.isActive;
          existingUser.lastLoginAt = user.lastLoginAt;
          
          await existingUser.save();
          console.log(`🔄 Updated existing user: ${user.email} (${user.name}) for ${company.name} with ID: ${existingUser._id}`);
          console.log(`🔑 New password hash for ${user.email}: ${existingUser.password?.substring(0, 20)}...`);
        }
      }
      
      console.log(`✅ Users seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All users seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

module.exports = seedUsers;
