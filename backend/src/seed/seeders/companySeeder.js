const Company = require('../../models/Company');

const seedCompanies = async () => {
  try {
    console.log('🏢 Starting company seeding...');

    // Define companies with comprehensive details
    const companies = [
      {
        name: 'TechCorp Solutions',
        displayName: 'TechCorp Solutions Pvt Ltd',
        code: 'TECHCORP',
        description: 'Leading technology solutions provider specializing in enterprise software and digital transformation.',
        industry: 'IT_SOFTWARE',
        companySize: 'LARGE',
        contact: {
          email: 'admin@techcorp.com',
          phone: '+91-11-2345-6789',
          website: 'https://www.techcorp.com',
          address: {
            street: '123 Tech Park, Sector 5',
            city: 'Gurgaon',
            state: 'Haryana',
            country: 'India',
            postalCode: '122001'
          }
        },
        branding: {
          primaryColor: '#2563eb',
          secondaryColor: '#1e40af',
          customDomain: 'techcorp.tender360.com'
        },
        subscription: {
          plan: 'ENTERPRISE',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          maxUsers: 100,
          maxTenders: 1000,
          maxStorage: 10000
        },
        settings: {
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY',
          currency: 'INR',
          language: 'en',
          notifications: {
            email: true,
            sms: true,
            push: true
          },
          features: {
            aiExtraction: true,
            advancedAnalytics: true,
            customReports: true,
            apiAccess: true,
            whiteLabel: true
          }
        },
        status: 'ACTIVE',
        metadata: {
          foundedYear: 2015,
          registrationNumber: 'U72900DL2015PTC123456',
          taxId: '29AABCT1234C1Z5',
          legalEntityType: 'PRIVATE_LIMITED',
          compliance: {
            gstRegistered: true,
            gstNumber: '29AABCT1234C1Z5',
            panNumber: 'AABCT1234C',
            udyamNumber: 'UDYAM-DL-12-3456789'
          }
        }
      },
      {
        name: 'BuildRight Construction',
        displayName: 'BuildRight Construction & Engineering Ltd',
        code: 'BUILDRIGHT',
        description: 'Premier construction company specializing in infrastructure development and commercial projects.',
        industry: 'CONSTRUCTION',
        companySize: 'MEDIUM',
        contact: {
          email: 'info@buildright.in',
          phone: '+91-22-9876-5432',
          website: 'https://www.buildright.in',
          address: {
            street: '456 Construction Plaza, Andheri East',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            postalCode: '400069'
          }
        },
        branding: {
          primaryColor: '#dc2626',
          secondaryColor: '#991b1b',
          customDomain: 'buildright.tender360.com'
        },
        subscription: {
          plan: 'PROFESSIONAL',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
          maxUsers: 25,
          maxTenders: 500,
          maxStorage: 5000
        },
        settings: {
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY',
          currency: 'INR',
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: true
          },
          features: {
            aiExtraction: true,
            advancedAnalytics: true,
            customReports: false,
            apiAccess: false,
            whiteLabel: false
          }
        },
        status: 'ACTIVE',
        metadata: {
          foundedYear: 2018,
          registrationNumber: 'U45200MH2018PTC234567',
          taxId: '27AABCB2345D1Z6',
          legalEntityType: 'PRIVATE_LIMITED',
          compliance: {
            gstRegistered: true,
            gstNumber: '27AABCB2345D1Z6',
            panNumber: 'AABCB2345D',
            udyamNumber: 'UDYAM-MH-23-4567890'
          }
        }
      },
      {
        name: 'MediCare Innovations',
        displayName: 'MediCare Innovations Healthcare Pvt Ltd',
        code: 'MEDICARE',
        description: 'Innovative healthcare solutions provider focused on medical technology and patient care systems.',
        industry: 'HEALTHCARE',
        companySize: 'SMALL',
        contact: {
          email: 'contact@medicareinnovations.com',
          phone: '+91-80-1234-5678',
          website: 'https://www.medicareinnovations.com',
          address: {
            street: '789 Health Tech Hub, Electronic City',
            city: 'Bangalore',
            state: 'Karnataka',
            country: 'India',
            postalCode: '560100'
          }
        },
        branding: {
          primaryColor: '#059669',
          secondaryColor: '#047857',
          customDomain: 'medicare.tender360.com'
        },
        subscription: {
          plan: 'BASIC',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
          maxUsers: 10,
          maxTenders: 100,
          maxStorage: 2000
        },
        settings: {
          timezone: 'Asia/Kolkata',
          dateFormat: 'DD/MM/YYYY',
          currency: 'INR',
          language: 'en',
          notifications: {
            email: true,
            sms: false,
            push: false
          },
          features: {
            aiExtraction: true,
            advancedAnalytics: false,
            customReports: false,
            apiAccess: false,
            whiteLabel: false
          }
        },
        status: 'ACTIVE',
        metadata: {
          foundedYear: 2020,
          registrationNumber: 'U85110KA2020PTC345678',
          taxId: '29AABCD3456E1Z7',
          legalEntityType: 'PRIVATE_LIMITED',
          compliance: {
            gstRegistered: true,
            gstNumber: '29AABCD3456E1Z7',
            panNumber: 'AABCD3456E',
            udyamNumber: 'UDYAM-KA-34-5678901'
          }
        }
      }
    ];

    // Insert or update companies
    for (const companyData of companies) {
      const existingCompany = await Company.findOne({ code: companyData.code });
      
      if (!existingCompany) {
        const createdCompany = await Company.create(companyData);
        console.log(`✅ Created company: ${createdCompany.name} (${createdCompany.code}) with ID: ${createdCompany._id}`);
        console.log(`📧 Admin email: ${createdCompany.contact.email}`);
        console.log(`🏢 Industry: ${createdCompany.industry}, Size: ${createdCompany.companySize}`);
        console.log(`💳 Plan: ${createdCompany.subscription.plan}, Max Users: ${createdCompany.subscription.maxUsers}`);
        console.log(`🌐 Custom Domain: ${createdCompany.branding.customDomain || 'Not set'}`);
        console.log('---');
      } else {
        // Update existing company with fresh data
        Object.assign(existingCompany, companyData);
        await existingCompany.save();
        console.log(`🔄 Updated existing company: ${existingCompany.name} (${existingCompany.code}) with ID: ${existingCompany._id}`);
        console.log('---');
      }
    }

    // Get all companies for admin user creation
    const allCompanies = await Company.find({ isDeleted: false });
    console.log(`✅ Companies seeded successfully. Total companies: ${allCompanies.length}`);
    
    return allCompanies;
  } catch (error) {
    console.error('❌ Error seeding companies:', error);
    throw error;
  }
};

module.exports = seedCompanies;
