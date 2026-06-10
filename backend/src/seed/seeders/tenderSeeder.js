const Tender = require('../../models/Tender');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedTenders = async () => {
  try {
    // Clear existing tenders to avoid validation conflicts
    await Tender.deleteMany({});
    console.log('🗑️ Cleared existing tenders');
    
    // Get all companies and their manager users
    const companies = await Company.find();
    if (companies.length === 0) {
      console.log('⚠️ No companies found. Please seed companies first.');
      return;
    }
    
    console.log(`🏢 Found ${companies.length} companies, creating tenders for each...`);

    // Create tenders for each company
    for (const company of companies) {
      console.log(`\n🏢 Creating tenders for ${company.name}...`);
      
      // Get manager user for this company
      const manager = await User.findOne({ 
        companyId: company._id, 
        roles: 'TENDER MANAGER' 
      });
      
      if (!manager) {
        console.log(`⚠️ No manager found for ${company.name}, skipping...`);
        continue;
      }
      
      console.log(`👤 Using manager: ${manager.email} for ${company.name}`);
      
      const tenders = [
        {
          companyId: company._id,
          reference: `${company.code}-2024-001`,
          title: 'Diabetes Management System Implementation',
          organization: 'City General Hospital',
          location: 'Mumbai, Maharashtra',
          description: 'Implementation of comprehensive diabetes management system including patient monitoring, treatment tracking, and analytics dashboard for healthcare professionals.',
          estimatedValue: 5200000, // 5.2M USD
          currency: 'USD',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          tenderType: 'Hospital Tender',
          therapeuticArea: 'Diabetes',
          aiMatchScore: 85,
          status: 'active',
          tags: ['diabetes', 'healthcare', 'management', 'analytics'],
          source: 'Hospital Procurement Portal',
          dueDates: {
            submission: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          requirements: {
            technical: ['EMR integration', 'Blood glucose monitoring', 'Real-time alerts', 'Mobile app support'],
            financial: ['Minimum 3 years financial stability', 'Insurance coverage', 'Performance bonds'],
            legal: ['HIPAA compliance', 'Data protection', 'Medical device regulations']
          },
          pipelineStage: 'identified',
          priority: 'high',
          winProbability: 75,
          urgency: 'medium',
          owner: manager._id,
          assignedTo: manager._id,
          publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          companyId: company._id,
          reference: `${company.code}-2024-002`,
          title: 'Rare Disease Drug Supply Contract',
          organization: 'National Health Institute',
          location: 'Delhi, NCR',
          description: 'Long-term supply contract for rare disease medications including storage, distribution, and patient support services across multiple states.',
          estimatedValue: 15000000, // 15M USD
          currency: 'USD',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
          tenderType: 'Government RFP',
          therapeuticArea: 'Rare Diseases',
          aiMatchScore: 92,
          status: 'active',
          tags: ['rare diseases', 'pharmaceuticals', 'supply chain', 'government'],
          source: 'Government Procurement Portal',
          dueDates: {
            submission: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
          },
          requirements: {
            technical: ['Cold chain management', 'Quality assurance', 'Patient support programs', 'Training services'],
            financial: ['Minimum 5 years financial stability', 'Performance guarantees', 'Insurance coverage'],
            legal: ['FDA compliance', 'Import licenses', 'Quality certifications']
          },
          pipelineStage: 'evaluating',
          priority: 'critical',
          winProbability: 60,
          urgency: 'high',
          owner: manager._id,
          assignedTo: manager._id,
          publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        {
          companyId: company._id,
          reference: `${company.code}-2024-003`,
          title: 'Cardiovascular Equipment Maintenance',
          organization: 'Metro Heart Center',
          location: 'Bangalore, Karnataka',
          description: 'Comprehensive maintenance and support services for cardiovascular imaging equipment including CT scanners, MRI machines, and cardiac monitoring devices.',
          estimatedValue: 3200000, // 3.2M USD
          currency: 'USD',
          deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
          tenderType: 'Private Tender',
          therapeuticArea: 'Cardiovascular',
          aiMatchScore: 78,
          status: 'active',
          tags: ['cardiovascular', 'equipment', 'maintenance', 'imaging'],
          source: 'Private Hospital Network',
          dueDates: {
            submission: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
          },
          requirements: {
            technical: ['Equipment certification', '24/7 support', 'Preventive maintenance', 'Emergency response'],
            financial: ['Minimum 3 years financial stability', 'Performance bonds', 'Insurance coverage'],
            legal: ['Service agreements', 'Liability coverage', 'Compliance certificates']
          },
          pipelineStage: 'pursuing',
          priority: 'medium',
          winProbability: 70,
          urgency: 'medium',
          owner: manager._id,
          assignedTo: manager._id,
          publishedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
        }
      ];

      // Insert tenders for this company
      for (const tender of tenders) {
        await Tender.create(tender);
        console.log(`✅ Created tender: ${tender.title} - ${tender.organization} for ${company.name}`);
      }
    }

    console.log('✅ Tenders seeded successfully for all companies');
  } catch (error) {
    console.error('❌ Error seeding tenders:', error);
    throw error;
  }
};

module.exports = seedTenders;