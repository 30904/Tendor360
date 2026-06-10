const mongoose = require('mongoose');
require('dotenv').config();

const RegulatoryDeclaration = require('./src/models/RegulatoryDeclaration');
const Certificate = require('./src/models/Certificate');
const Vendor = require('./src/models/Vendor');
const Company = require('./src/models/Company');
const User = require('./src/models/User');

// Sample data for regulatory declarations
const regulatoryDeclarationsData = [
  {
    title: 'GDPR Data Processing Declaration',
    description: 'Declaration of compliance with General Data Protection Regulation for processing personal data of EU citizens.',
    type: 'Data Processing (GDPR)',
    category: 'Data Protection',
    priority: 'High',
    jurisdiction: 'European Union',
    regulatoryBody: 'European Data Protection Board',
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    complianceRequirements: [
      {
        requirement: 'Data Protection Impact Assessment',
        description: 'Conduct DPIA for high-risk processing activities',
        status: 'Completed',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        requirement: 'Privacy Policy Update',
        description: 'Update privacy policy to reflect current processing activities',
        status: 'Completed',
        dueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        requirement: 'Data Subject Rights Implementation',
        description: 'Implement procedures for data subject rights requests',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ],
    stakeholders: [
      {
        name: 'Data Protection Officer',
        role: 'Primary Contact',
        email: 'dpo@company.com',
        isPrimary: true
      },
      {
        name: 'Legal Counsel',
        role: 'Reviewer',
        email: 'legal@company.com'
      }
    ],
    tags: ['GDPR', 'Data Protection', 'EU Compliance']
  },
  {
    title: 'Conflict of Interest Declaration - Board Members',
    description: 'Annual declaration of conflicts of interest by board members and senior executives.',
    type: 'Conflict of Interest',
    category: 'Legal',
    priority: 'Medium',
    jurisdiction: 'United States',
    regulatoryBody: 'SEC',
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    complianceRequirements: [
      {
        requirement: 'Board Member Declarations',
        description: 'Collect conflict of interest declarations from all board members',
        status: 'Completed',
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        requirement: 'Executive Declarations',
        description: 'Collect conflict of interest declarations from senior executives',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ],
    stakeholders: [
      {
        name: 'Corporate Secretary',
        role: 'Primary Contact',
        email: 'corpsec@company.com',
        isPrimary: true
      }
    ],
    tags: ['Conflict of Interest', 'Board Governance', 'SEC Compliance']
  },
  {
    title: 'Export Control Compliance Declaration',
    description: 'Declaration of compliance with International Traffic in Arms Regulations (ITAR) and Export Administration Regulations (EAR).',
    type: 'Export Control',
    category: 'Legal',
    priority: 'Critical',
    jurisdiction: 'United States',
    regulatoryBody: 'Bureau of Industry and Security',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
    complianceRequirements: [
      {
        requirement: 'Export Control Training',
        description: 'Complete export control training for all relevant personnel',
        status: 'Completed',
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        requirement: 'Technology Control Plan',
        description: 'Develop and implement technology control plan',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      }
    ],
    stakeholders: [
      {
        name: 'Export Control Officer',
        role: 'Primary Contact',
        email: 'export@company.com',
        isPrimary: true
      }
    ],
    tags: ['Export Control', 'ITAR', 'EAR', 'Compliance']
  }
];

// Sample data for certificates
const certificatesData = [
  {
    certificateNumber: 'ISO-9001-2024-001',
    name: 'ISO 9001:2015 Quality Management System',
    description: 'Quality management system certification for manufacturing operations',
    type: 'ISO 9001',
    category: 'Quality Management',
    issuingBody: 'Bureau Veritas',
    scope: 'Design, development, and manufacture of electronic components',
    issueDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000), // 10 months ago
    expiryDate: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000), // ~2 months from now
    renewalRequired: true,
    renewalFrequency: 'Tri-annually',
    cost: {
      amount: 15000,
      currency: 'USD',
      renewalCost: 12000
    },
    requirements: [
      {
        requirement: 'Management Review',
        description: 'Conduct annual management review',
        status: 'Completed',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      },
      {
        requirement: 'Internal Audit',
        description: 'Complete internal audit program',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ],
    tags: ['ISO 9001', 'Quality Management', 'Manufacturing']
  },
  {
    certificateNumber: 'ISO-14001-2024-002',
    name: 'ISO 14001:2015 Environmental Management System',
    description: 'Environmental management system certification',
    type: 'ISO 14001',
    category: 'Environmental',
    issuingBody: 'SGS',
    scope: 'Environmental management for all company operations',
    issueDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // ~7 months ago
    expiryDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000), // ~5.5 months from now
    renewalRequired: true,
    renewalFrequency: 'Tri-annually',
    cost: {
      amount: 18000,
      currency: 'USD',
      renewalCost: 15000
    },
    requirements: [
      {
        requirement: 'Environmental Impact Assessment',
        description: 'Update environmental impact assessment',
        status: 'Completed',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ],
    tags: ['ISO 14001', 'Environmental', 'Sustainability']
  },
  {
    certificateNumber: 'CE-2024-003',
    name: 'CE Marking - Medical Device Directive',
    description: 'CE marking for medical device compliance with EU regulations',
    type: 'CE Marking',
    category: 'Product Safety',
    issuingBody: 'TÜV SÜD',
    scope: 'Medical device manufacturing and distribution',
    issueDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // ~5 months ago
    expiryDate: new Date(Date.now() + 215 * 24 * 60 * 60 * 1000), // ~7 months from now
    renewalRequired: true,
    renewalFrequency: 'Annually',
    cost: {
      amount: 25000,
      currency: 'USD',
      renewalCost: 20000
    },
    requirements: [
      {
        requirement: 'Technical Documentation Review',
        description: 'Annual review of technical documentation',
        status: 'Not Started',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ],
    tags: ['CE Marking', 'Medical Device', 'EU Compliance']
  }
];

// Sample data for vendors
const vendorsData = [
  {
    vendorId: 'VEND-001',
    companyName: 'TechSolutions Inc.',
    legalName: 'TechSolutions Incorporated',
    businessType: 'Corporation',
    industry: 'Information Technology',
    category: 'Technology Provider',
    status: 'Approved',
    preQualificationStatus: 'Completed',
    preQualificationDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
    preQualificationExpiry: new Date(Date.now() + 245 * 24 * 60 * 60 * 1000), // 8 months from now
    contactInformation: {
      primaryContact: {
        name: 'John Smith',
        title: 'Business Development Manager',
        email: 'john.smith@techsolutions.com',
        phone: '+1-555-0123'
      },
      address: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'United States'
      }
    },
    businessInformation: {
      registrationNumber: 'C1234567',
      taxId: '12-3456789',
      website: 'https://www.techsolutions.com',
      establishedYear: 2015,
      numberOfEmployees: { min: 50, max: 100 }
    },
    capabilities: [
      {
        category: 'Software Development',
        description: 'Custom software development and integration services',
        experience: 'Expert',
        yearsOfExperience: 8
      },
      {
        category: 'Cloud Services',
        description: 'Cloud migration and management services',
        experience: 'Advanced',
        yearsOfExperience: 5
      }
    ],
    complianceRequirements: [
      {
        requirement: 'ISO 27001 Certification',
        description: 'Information security management system certification',
        status: 'Completed',
        dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        isRequired: true
      },
      {
        requirement: 'SOC 2 Type II Report',
        description: 'Service organization control report',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isRequired: true
      }
    ],
    performanceMetrics: {
      onTimeDelivery: 95,
      qualityRating: 4.5,
      costCompetitiveness: 4.0,
      communicationRating: 4.8,
      overallRating: 4.3
    },
    tags: ['Technology', 'Software', 'Cloud Services']
  },
  {
    vendorId: 'VEND-002',
    companyName: 'Global Manufacturing Corp.',
    legalName: 'Global Manufacturing Corporation',
    businessType: 'Corporation',
    industry: 'Manufacturing',
    category: 'Goods Supplier',
    status: 'Approved',
    preQualificationStatus: 'Completed',
    preQualificationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
    preQualificationExpiry: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000), // 9 months from now
    contactInformation: {
      primaryContact: {
        name: 'Sarah Johnson',
        title: 'Sales Director',
        email: 'sarah.johnson@globalmfg.com',
        phone: '+1-555-0456'
      },
      address: {
        street: '456 Industrial Blvd',
        city: 'Detroit',
        state: 'MI',
        postalCode: '48201',
        country: 'United States'
      }
    },
    businessInformation: {
      registrationNumber: 'C2345678',
      taxId: '23-4567890',
      website: 'https://www.globalmfg.com',
      establishedYear: 2010,
      numberOfEmployees: { min: 200, max: 500 }
    },
    capabilities: [
      {
        category: 'Precision Manufacturing',
        description: 'High-precision manufacturing of metal components',
        experience: 'Expert',
        yearsOfExperience: 12
      }
    ],
    complianceRequirements: [
      {
        requirement: 'ISO 9001 Certification',
        description: 'Quality management system certification',
        status: 'Completed',
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        isRequired: true
      },
      {
        requirement: 'Environmental Compliance',
        description: 'Environmental permits and compliance documentation',
        status: 'Completed',
        dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        completedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        isRequired: true
      }
    ],
    performanceMetrics: {
      onTimeDelivery: 98,
      qualityRating: 4.7,
      costCompetitiveness: 4.2,
      communicationRating: 4.5,
      overallRating: 4.5
    },
    tags: ['Manufacturing', 'Precision', 'Metal Components']
  }
];

const seedRegulatoryCompliance = async () => {
  try {
    console.log('🌱 Starting Regulatory Compliance seeding...');

    // Get all companies
    const companies = await Company.find();
    console.log(`📊 Found ${companies.length} companies`);

    for (const company of companies) {
      console.log(`\n🏢 Seeding regulatory compliance for: ${company.name}`);
      
      // Get admin user for this company
      const adminUser = await User.findOne({ 
        companyId: company._id, 
        email: { $regex: /admin@/i }
      });

      if (!adminUser) {
        console.log(`❌ No admin user found for ${company.name}`);
        continue;
      }

      // Clear existing data for this company
      await RegulatoryDeclaration.deleteMany({ companyId: company._id });
      await Certificate.deleteMany({ companyId: company._id });
      await Vendor.deleteMany({ companyId: company._id });
      console.log(`🗑️ Cleared existing regulatory compliance data for ${company.name}`);

      // Create regulatory declarations
      const declarationsToCreate = regulatoryDeclarationsData.map((declarationData, index) => ({
        ...declarationData,
        companyId: company._id,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        status: index === 0 ? 'Approved' : index === 1 ? 'Under Review' : 'Draft'
      }));

      const createdDeclarations = await RegulatoryDeclaration.insertMany(declarationsToCreate);
      console.log(`✅ Created ${createdDeclarations.length} regulatory declarations for ${company.name}`);

      // Create certificates with unique certificate numbers per company
      const certificatesToCreate = certificatesData.map((certificateData, index) => ({
        ...certificateData,
        certificateNumber: `${certificateData.certificateNumber}-${company.name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`,
        companyId: company._id,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        status: index === 0 ? 'Active' : index === 1 ? 'Active' : 'Pending Renewal'
      }));

      const createdCertificates = await Certificate.insertMany(certificatesToCreate);
      console.log(`✅ Created ${createdCertificates.length} certificates for ${company.name}`);

      // Create vendors with unique vendor IDs per company
      const vendorsToCreate = vendorsData.map((vendorData, index) => ({
        ...vendorData,
        vendorId: `${vendorData.vendorId}-${company.name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`,
        companyId: company._id,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        approvedBy: adminUser._id
      }));

      const createdVendors = await Vendor.insertMany(vendorsToCreate);
      console.log(`✅ Created ${createdVendors.length} vendors for ${company.name}`);

      // Log created items
      createdDeclarations.forEach(declaration => {
        console.log(`   - Declaration: ${declaration.title} (${declaration.type}) - ${declaration.status}`);
      });
      createdCertificates.forEach(certificate => {
        console.log(`   - Certificate: ${certificate.name} (${certificate.type}) - ${certificate.status}`);
      });
      createdVendors.forEach(vendor => {
        console.log(`   - Vendor: ${vendor.companyName} (${vendor.category}) - ${vendor.status}`);
      });
    }

    console.log('\n🎉 Regulatory Compliance seeding completed for all companies!');
    console.log('You can now test the Market Declarations page in the frontend for any company.');

  } catch (error) {
    console.error('❌ Error seeding regulatory compliance:', error);
  }
};

// Connect to database and run seeding
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB');
    
    await seedRegulatoryCompliance();
    
    console.log('✅ Regulatory Compliance seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection or seeding failed:', error);
    process.exit(1);
  }
};

connectDB();
