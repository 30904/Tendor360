const Document = require('../../models/Document');
const Tender = require('../../models/Tender');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedDocuments = async () => {
  try {
    // Get all companies and create documents for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('⚠️ No companies found, skipping document seeding');
      return;
    }

    console.log(`📁 Creating documents for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\n📁 Creating documents for ${company.name}...`);
      
      // Get tenders and users for this company
      const tenders = await Tender.find({ companyId: company._id }).limit(3);
      const manager = await User.findOne({ 
        companyId: company._id, 
        roles: 'TENDER MANAGER' 
      });
      
      if (tenders.length === 0 || !manager) {
        console.log(`⚠️ No tenders or manager found for ${company.name}, skipping...`);
        continue;
      }

      // Create documents for each tender
      for (const tender of tenders) {
        const documents = [
          {
            companyId: company._id,
            tenderId: tender._id,
            name: `${company.code} - Technical Specifications - ${tender.reference}`,
            type: 'SPECIFICATION',
            storage: {
              filename: `${company.code.toLowerCase()}_tech_specs_${tender.reference}.pdf`,
              originalName: `${company.code.toLowerCase()}_tech_specs_${tender.reference}.pdf`,
              mimeType: 'application/pdf',
              size: 2048576 // 2MB
            },
            category: 'Technical',
            version: 1,
            status: 'UPLOADED',
            uploadedBy: manager._id,
            tags: ['technical', 'specifications', 'requirements']
          },
          {
            companyId: company._id,
            tenderId: tender._id,
            name: `${company.code} - Financial Requirements - ${tender.reference}`,
            type: 'TENDER_DOCUMENT',
            storage: {
              filename: `${company.code.toLowerCase()}_financial_req_${tender.reference}.pdf`,
              originalName: `${company.code.toLowerCase()}_financial_req_${tender.reference}.pdf`,
              mimeType: 'application/pdf',
              size: 1048576 // 1MB
            },
            category: 'Financial',
            version: 1,
            status: 'UPLOADED',
            uploadedBy: manager._id,
            tags: ['financial', 'requirements', 'budget']
          },
          {
            companyId: company._id,
            tenderId: tender._id,
            name: `${company.code} - Quality Certifications - ${tender.reference}`,
            type: 'OTHER',
            storage: {
              filename: `${company.code.toLowerCase()}_quality_certs_${tender.reference}.zip`,
              originalName: `${company.code.toLowerCase()}_quality_certs_${tender.reference}.zip`,
              mimeType: 'application/zip',
              size: 5242880 // 5MB
            },
            category: 'Certification',
            version: 1,
            status: 'UPLOADED',
            uploadedBy: manager._id,
            tags: ['quality', 'certifications', 'compliance']
          }
        ];

        // Insert documents for this tender
        for (const doc of documents) {
          const existingDoc = await Document.findOne({ 
            companyId: company._id,
            name: doc.name,
            version: doc.version 
          });
          if (!existingDoc) {
            await Document.create(doc);
            console.log(`✅ Created document: ${doc.name} for tender ${tender.reference}`);
          } else {
            console.log(`ℹ️ Document already exists: ${doc.name}`);
          }
        }
      }
      
      console.log(`✅ Documents seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All documents seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding documents:', error);
    throw error;
  }
};

module.exports = seedDocuments;
