const Contract = require('../../models/Contract');
const Tender = require('../../models/Tender');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedContracts = async () => {
  try {
    // Get all companies and create contracts for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('⚠️ No companies found, skipping contract seeding');
      return;
    }

    console.log(`📋 Creating contracts for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\n📋 Creating contracts for ${company.name}...`);
      
      // Get tenders and users for this company
      const tenders = await Tender.find({ companyId: company._id }).limit(3);
      const manager = await User.findOne({ 
        companyId: company._id, 
        roles: 'TENDER MANAGER' 
      });
      const approver = await User.findOne({ 
        companyId: company._id, 
        roles: 'APPROVER' 
      });
      
      if (tenders.length === 0 || !manager) {
        console.log(`⚠️ No tenders or manager found for ${company.name}, skipping...`);
        continue;
      }

      // Create contracts for each tender
      for (let i = 0; i < tenders.length; i++) {
        const tender = tenders[i];
        const contracts = [
          {
            companyId: company._id,
            tender: tender._id,
            contractNumber: `${company.code}-CON-2024-${String(i + 1).padStart(3, '0')}`,
            title: `${company.code} - ${tender.title} Contract`,
            vendor: `${company.name} Solutions Pvt Ltd`,
            contractValue: tender.estimatedValue || 2500000,
            currency: tender.currency || 'USD',
            startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 155 * 24 * 60 * 60 * 1000), // 120 days duration
            status: 'ACTIVE',
            milestones: [
              {
                title: 'Initial Delivery',
                dueDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
                status: 'PENDING'
              },
              {
                title: 'Installation & Testing',
                dueDate: new Date(Date.now() + 95 * 24 * 60 * 60 * 1000),
                status: 'PENDING'
              },
              {
                title: 'Training & Handover',
                dueDate: new Date(Date.now() + 125 * 24 * 60 * 60 * 1000),
                status: 'PENDING'
              }
            ],
            isActive: true,
            createdBy: manager._id,
            updatedBy: approver?._id || manager._id
          }
        ];

        for (const contract of contracts) {
          const existingContract = await Contract.findOne({ 
            companyId: company._id,
            contractNumber: contract.contractNumber 
          });
          if (!existingContract) {
            await Contract.create(contract);
            console.log(`✅ Created contract: ${contract.contractNumber}`);
          } else {
            console.log(`ℹ️ Contract already exists: ${contract.contractNumber}`);
          }
        }
      }
      
      console.log(`✅ Contracts seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All contracts seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding contracts:', error);
    throw error;
  }
};

module.exports = seedContracts;
