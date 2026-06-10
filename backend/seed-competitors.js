const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import models
const Competitor = require('./src/models/Competitor');
const Company = require('./src/models/Company');
const User = require('./src/models/User');

// Sample competitor data
const competitorsData = [
  {
    name: 'TechCorp Solutions',
    description: 'Leading technology solutions provider specializing in enterprise software and cloud infrastructure.',
    website: 'https://techcorp-solutions.com',
    industry: 'Technology',
    size: 'Large',
    location: {
      country: 'United States',
      region: 'North America',
      city: 'San Francisco'
    },
    contactInfo: {
      email: 'info@techcorp-solutions.com',
      phone: '+1-555-0123',
      address: '123 Tech Street, San Francisco, CA 94105'
    },
    financialInfo: {
      revenue: 2500000000,
      currency: 'USD',
      employees: 15000,
      foundedYear: 1995
    },
    capabilities: [
      {
        category: 'Cloud Infrastructure',
        description: 'Enterprise cloud solutions and migration services',
        strength: 'Strong'
      },
      {
        category: 'Software Development',
        description: 'Custom software development and integration',
        strength: 'Strong'
      }
    ],
    marketPosition: 'Leader',
    threatLevel: 'High',
    strengths: [
      'Strong brand recognition',
      'Extensive enterprise client base',
      'Advanced cloud infrastructure',
      'Strong financial backing'
    ],
    weaknesses: [
      'High pricing',
      'Complex implementation process',
      'Limited customization options'
    ],
    opportunities: [
      'AI and machine learning integration',
      'Edge computing solutions',
      'Cybersecurity services expansion'
    ],
    threats: [
      'Increased competition from startups',
      'Economic downturns affecting enterprise spending',
      'Technology disruption'
    ],
    tags: ['Enterprise', 'Cloud', 'Software', 'Technology', 'Global'],
    winRate: 75,
    totalTenders: 45,
    wonTenders: 34,
    lostTenders: 11
  },
  {
    name: 'InnovateTech Systems',
    description: 'Innovative technology company focused on AI-driven solutions and digital transformation.',
    website: 'https://innovatetech-systems.com',
    industry: 'Technology',
    size: 'Medium',
    location: {
      country: 'Canada',
      region: 'North America',
      city: 'Toronto'
    },
    contactInfo: {
      email: 'contact@innovatetech-systems.com',
      phone: '+1-416-555-0456',
      address: '456 Innovation Drive, Toronto, ON M5H 2N2'
    },
    financialInfo: {
      revenue: 500000000,
      currency: 'USD',
      employees: 2500,
      foundedYear: 2010
    },
    capabilities: [
      {
        category: 'Artificial Intelligence',
        description: 'AI-powered solutions and machine learning platforms',
        strength: 'Strong'
      },
      {
        category: 'Digital Transformation',
        description: 'End-to-end digital transformation consulting',
        strength: 'Strong'
      }
    ],
    marketPosition: 'Challenger',
    threatLevel: 'Medium',
    strengths: [
      'Cutting-edge AI technology',
      'Agile development approach',
      'Strong innovation culture',
      'Competitive pricing'
    ],
    weaknesses: [
      'Limited enterprise experience',
      'Smaller market presence',
      'Limited global reach'
    ],
    opportunities: [
      'AI market expansion',
      'SME market penetration',
      'Partnership opportunities'
    ],
    threats: [
      'Larger competitors entering AI space',
      'Talent acquisition challenges',
      'Technology obsolescence risk'
    ],
    tags: ['AI', 'Innovation', 'Digital', 'SME', 'Agile'],
    winRate: 60,
    totalTenders: 28,
    wonTenders: 17,
    lostTenders: 11
  },
  {
    name: 'GlobalData Analytics',
    description: 'Specialized data analytics and business intelligence company serving Fortune 500 clients.',
    website: 'https://globaldata-analytics.com',
    industry: 'Data Analytics',
    size: 'Large',
    location: {
      country: 'United Kingdom',
      region: 'Europe',
      city: 'London'
    },
    contactInfo: {
      email: 'info@globaldata-analytics.com',
      phone: '+44-20-7946-0958',
      address: '789 Data Street, London EC1A 4HD'
    },
    financialInfo: {
      revenue: 1800000000,
      currency: 'USD',
      employees: 8000,
      foundedYear: 2000
    },
    capabilities: [
      {
        category: 'Data Analytics',
        description: 'Advanced analytics and predictive modeling',
        strength: 'Strong'
      },
      {
        category: 'Business Intelligence',
        description: 'Comprehensive BI solutions and dashboards',
        strength: 'Strong'
      }
    ],
    marketPosition: 'Leader',
    threatLevel: 'High',
    strengths: [
      'Deep domain expertise',
      'Strong client relationships',
      'Comprehensive data platform',
      'Global delivery model'
    ],
    weaknesses: [
      'High client concentration risk',
      'Complex pricing models',
      'Long implementation timelines'
    ],
    opportunities: [
      'Real-time analytics expansion',
      'Cloud-native solutions',
      'Industry-specific solutions'
    ],
    threats: [
      'Cloud providers entering analytics space',
      'Open-source alternatives',
      'Data privacy regulations'
    ],
    tags: ['Analytics', 'BI', 'Data', 'Enterprise', 'Global'],
    winRate: 68,
    totalTenders: 52,
    wonTenders: 35,
    lostTenders: 17
  },
  {
    name: 'SecureNet Technologies',
    description: 'Cybersecurity specialist providing comprehensive security solutions for enterprise clients.',
    website: 'https://securenet-technologies.com',
    industry: 'Cybersecurity',
    size: 'Medium',
    location: {
      country: 'Germany',
      region: 'Europe',
      city: 'Berlin'
    },
    contactInfo: {
      email: 'security@securenet-technologies.com',
      phone: '+49-30-12345678',
      address: '321 Security Boulevard, Berlin 10115'
    },
    financialInfo: {
      revenue: 750000000,
      currency: 'USD',
      employees: 3500,
      foundedYear: 2008
    },
    capabilities: [
      {
        category: 'Network Security',
        description: 'Advanced network security and monitoring solutions',
        strength: 'Strong'
      },
      {
        category: 'Endpoint Protection',
        description: 'Comprehensive endpoint security and management',
        strength: 'Strong'
      }
    ],
    marketPosition: 'Challenger',
    threatLevel: 'Medium',
    strengths: [
      'Specialized security expertise',
      'Strong compliance knowledge',
      'Rapid response capabilities',
      'Competitive pricing'
    ],
    weaknesses: [
      'Limited global presence',
      'Smaller scale compared to leaders',
      'Dependency on security talent'
    ],
    opportunities: [
      'Growing cybersecurity market',
      'GDPR compliance services',
      'Cloud security expansion'
    ],
    threats: [
      'Large security vendors competition',
      'Constantly evolving threat landscape',
      'Talent shortage in cybersecurity'
    ],
    tags: ['Security', 'Cybersecurity', 'Compliance', 'Network', 'European'],
    winRate: 55,
    totalTenders: 31,
    wonTenders: 17,
    lostTenders: 14
  },
  {
    name: 'CloudFirst Solutions',
    description: 'Cloud-native solutions provider specializing in multi-cloud and hybrid cloud architectures.',
    website: 'https://cloudfirst-solutions.com',
    industry: 'Cloud Computing',
    size: 'Small',
    location: {
      country: 'Australia',
      region: 'Asia-Pacific',
      city: 'Sydney'
    },
    contactInfo: {
      email: 'hello@cloudfirst-solutions.com',
      phone: '+61-2-9876-5432',
      address: '654 Cloud Avenue, Sydney NSW 2000'
    },
    financialInfo: {
      revenue: 120000000,
      currency: 'USD',
      employees: 800,
      foundedYear: 2015
    },
    capabilities: [
      {
        category: 'Cloud Migration',
        description: 'End-to-end cloud migration and optimization services',
        strength: 'Strong'
      },
      {
        category: 'Multi-Cloud Management',
        description: 'Multi-cloud orchestration and management platforms',
        strength: 'Medium'
      }
    ],
    marketPosition: 'Follower',
    threatLevel: 'Low',
    strengths: [
      'Cloud-native expertise',
      'Agile and flexible approach',
      'Strong local market presence',
      'Cost-effective solutions'
    ],
    weaknesses: [
      'Limited enterprise experience',
      'Small team size',
      'Limited global reach',
      'Dependency on cloud providers'
    ],
    opportunities: [
      'Cloud adoption acceleration',
      'SME market expansion',
      'Regional partnerships'
    ],
    threats: [
      'Large cloud providers direct competition',
      'Economic uncertainty',
      'Talent acquisition challenges'
    ],
    tags: ['Cloud', 'Migration', 'DevOps', 'SME', 'Asia-Pacific'],
    winRate: 45,
    totalTenders: 22,
    wonTenders: 10,
    lostTenders: 12
  }
];

const seedCompetitors = async () => {
  try {
    console.log('🌱 Starting competitor seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the first company and user for seeding
    const company = await Company.findOne();
    const user = await User.findOne();

    if (!company || !user) {
      console.log('❌ No company or user found. Please seed companies and users first.');
      return;
    }

    console.log(`📊 Using company: ${company.name}`);
    console.log(`👤 Using user: ${user.name}`);

    // Clear existing competitors for this company
    await Competitor.deleteMany({ companyId: company._id });
    console.log('🗑️ Cleared existing competitors');

    // Create competitors with company and user references
    const competitorsToCreate = competitorsData.map(competitorData => ({
      ...competitorData,
      companyId: company._id,
      createdBy: user._id,
      updatedBy: user._id
    }));

    const createdCompetitors = await Competitor.insertMany(competitorsToCreate);
    console.log(`✅ Created ${createdCompetitors.length} competitors successfully!`);

    // Log created competitors
    createdCompetitors.forEach(competitor => {
      console.log(`   - ${competitor.name} (${competitor.industry}) - ${competitor.threatLevel} threat - ${competitor.winRate}% win rate`);
    });

    console.log('\n🎉 Competitor seeding completed!');
    console.log('You can now test the Competitors page in the frontend.');

  } catch (error) {
    console.error('❌ Error seeding competitors:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
};

// Run the seeder
seedCompetitors();
