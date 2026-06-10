const Report = require('../../models/Report');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedReports = async () => {
  try {
    // Get all companies and create reports for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('⚠️ No companies found, skipping report seeding');
      return;
    }

    console.log(`📊 Creating reports for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\n📊 Creating reports for ${company.name}...`);
      
      // Get admin user for this company
      const admin = await User.findOne({ 
        companyId: company._id, 
        roles: 'SYSTEM ADMINISTRATOR' 
      });
      
      if (!admin) {
        console.log(`⚠️ No admin user found for ${company.name}, skipping...`);
        continue;
      }

      const reports = [
        {
          companyId: company._id,
          title: `${company.code} - Monthly Tender Performance Report`,
          type: 'PERFORMANCE',
          description: `Monthly overview of tender performance metrics and KPIs for ${company.name}`,
          parameters: {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
            includeCharts: true,
            includeDetails: true
          },
          status: 'ACTIVE',
          schedule: 'MONTHLY',
          lastGenerated: new Date(),
          nextGeneration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          title: `${company.code} - Win/Loss Analysis Report`,
          type: 'ANALYTICS',
          description: `Comprehensive analysis of tender win/loss patterns and trends for ${company.name}`,
          parameters: {
            timeRange: 'QUARTERLY',
            includeTrends: true,
            includeRecommendations: true
          },
          status: 'ACTIVE',
          schedule: 'QUARTERLY',
          lastGenerated: new Date(),
          nextGeneration: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        }
      ];

      for (const report of reports) {
        const existingReport = await Report.findOne({ 
          companyId: company._id,
          title: report.title,
          type: report.type 
        });
        if (!existingReport) {
          await Report.create(report);
          console.log(`✅ Created report: ${report.title}`);
        } else {
          console.log(`ℹ️ Report already exists: ${report.title}`);
        }
      }
      
      console.log(`✅ Reports seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All reports seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding reports:', error);
    throw error;
  }
};

module.exports = seedReports;
