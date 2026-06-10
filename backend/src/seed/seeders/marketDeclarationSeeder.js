const mongoose = require('mongoose');
const MarketDeclaration = require('../../models/MarketDeclaration');
const Company = require('../../models/Company');
const User = require('../../models/User');

const marketDeclarationsData = [
  {
    title: 'Infrastructure Development Market Analysis',
    description: 'Comprehensive analysis of infrastructure development market trends and opportunities in the current economic landscape.',
    type: 'Market Analysis',
    category: 'Infrastructure',
    priority: 'High',
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    marketSize: 5000000000,
    currency: 'USD',
    growthRate: 8.5,
    riskLevel: 'Low',
    aiInsights: 'Strong growth potential with increasing government investments in infrastructure projects across multiple sectors.',
    aiConfidence: 91,
    keyTrends: [
      'Digital transformation in construction',
      'Sustainable infrastructure development',
      'Public-private partnerships increase',
      'Smart city initiatives expansion',
      'Green infrastructure focus'
    ],
    opportunities: [
      'Highway and bridge construction',
      'Renewable energy infrastructure',
      'Digital infrastructure projects',
      'Water management systems',
      'Transportation modernization'
    ],
    threats: [
      'Regulatory compliance challenges',
      'Supply chain disruptions',
      'Skilled labor shortage',
      'Environmental regulations',
      'Funding constraints'
    ],
    targetRegions: ['North America', 'Europe', 'Asia Pacific'],
    targetSectors: ['Construction', 'Energy', 'Transportation'],
    keywords: ['infrastructure', 'construction', 'development', 'public works'],
    tags: ['Infrastructure', 'Construction', 'Public Sector'],
    author: 'Market Research Team',
    coAuthors: ['Senior Analyst', 'Industry Expert'],
    isPublic: true,
    isFeatured: true
  },
  {
    title: 'Technology Services Market Outlook',
    description: 'Technology services market trends and digital transformation opportunities in the post-pandemic era.',
    type: 'Market Outlook',
    category: 'Technology',
    priority: 'Medium',
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months from now
    marketSize: 3000000000,
    currency: 'USD',
    growthRate: 12.3,
    riskLevel: 'Medium',
    aiInsights: 'Rapid digital transformation driving demand for technology services across all industries.',
    aiConfidence: 87,
    keyTrends: [
      'Cloud computing adoption',
      'AI and machine learning integration',
      'Cybersecurity focus increase',
      'Remote work solutions demand',
      'Edge computing growth'
    ],
    opportunities: [
      'Cloud migration services',
      'AI implementation projects',
      'Cybersecurity solutions',
      'Digital transformation consulting',
      'IoT platform development'
    ],
    threats: [
      'Rapid technology changes',
      'Competition from global players',
      'Data privacy regulations',
      'Talent acquisition challenges',
      'Economic uncertainty'
    ],
    targetRegions: ['Global', 'North America', 'Europe'],
    targetSectors: ['Technology', 'Finance', 'Healthcare'],
    keywords: ['technology', 'digital transformation', 'cloud', 'AI'],
    tags: ['Technology', 'Digital', 'Innovation'],
    author: 'Technology Analysis Team',
    coAuthors: ['Tech Lead', 'Market Analyst'],
    isPublic: true,
    isFeatured: false
  },
  {
    title: 'Healthcare Market Intelligence Report',
    description: 'Healthcare sector market intelligence and regulatory landscape analysis with focus on digital health.',
    type: 'Intelligence Report',
    category: 'Healthcare',
    priority: 'High',
    expiryDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000), // 5 months from now
    marketSize: 2500000000,
    currency: 'USD',
    growthRate: 6.8,
    riskLevel: 'Medium',
    aiInsights: 'Healthcare digitization and regulatory changes creating new opportunities for technology providers.',
    aiConfidence: 89,
    keyTrends: [
      'Telemedicine expansion',
      'Digital health records adoption',
      'Precision medicine growth',
      'Healthcare AI applications',
      'Patient data analytics'
    ],
    opportunities: [
      'Electronic health record systems',
      'Telemedicine platforms',
      'Medical device integration',
      'Healthcare analytics solutions',
      'Remote patient monitoring'
    ],
    threats: [
      'Regulatory compliance complexity',
      'Data security concerns',
      'Interoperability challenges',
      'Budget constraints',
      'Privacy regulations'
    ],
    targetRegions: ['North America', 'Europe', 'Asia Pacific'],
    targetSectors: ['Healthcare', 'Technology', 'Pharmaceuticals'],
    keywords: ['healthcare', 'digital health', 'telemedicine', 'medical technology'],
    tags: ['Healthcare', 'Digital Health', 'Medical Technology'],
    author: 'Healthcare Research Team',
    coAuthors: ['Medical Advisor', 'Regulatory Expert'],
    isPublic: true,
    isFeatured: true
  },
  {
    title: 'Financial Services Digital Transformation',
    description: 'Analysis of digital transformation trends in financial services and fintech market opportunities.',
    type: 'Market Analysis',
    category: 'Finance',
    priority: 'Medium',
    expiryDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000), // 6.5 months from now
    marketSize: 1800000000,
    currency: 'USD',
    growthRate: 15.2,
    riskLevel: 'Medium',
    aiInsights: 'Fintech innovation and regulatory changes driving significant market growth in digital financial services.',
    aiConfidence: 85,
    keyTrends: [
      'Digital banking adoption',
      'Cryptocurrency integration',
      'AI-powered financial services',
      'Regulatory technology (RegTech)',
      'Open banking initiatives'
    ],
    opportunities: [
      'Digital payment solutions',
      'Robo-advisory services',
      'Blockchain applications',
      'Financial data analytics',
      'Compliance automation'
    ],
    threats: [
      'Regulatory uncertainty',
      'Cybersecurity risks',
      'Competition from big tech',
      'Economic volatility',
      'Data privacy concerns'
    ],
    targetRegions: ['Global', 'North America', 'Europe'],
    targetSectors: ['Banking', 'Insurance', 'Investment'],
    keywords: ['fintech', 'digital banking', 'financial services', 'blockchain'],
    tags: ['Finance', 'Fintech', 'Digital Banking'],
    author: 'Financial Services Team',
    coAuthors: ['Fintech Expert', 'Regulatory Analyst'],
    isPublic: false,
    isFeatured: false
  },
  {
    title: 'Manufacturing Industry 4.0 Trends',
    description: 'Comprehensive analysis of Industry 4.0 adoption and smart manufacturing market opportunities.',
    type: 'Intelligence Report',
    category: 'Manufacturing',
    priority: 'High',
    expiryDate: new Date(Date.now() + 160 * 24 * 60 * 60 * 1000), // 5.5 months from now
    marketSize: 2200000000,
    currency: 'USD',
    growthRate: 9.7,
    riskLevel: 'Low',
    aiInsights: 'Manufacturing sector showing strong adoption of Industry 4.0 technologies with significant ROI potential.',
    aiConfidence: 92,
    keyTrends: [
      'IoT in manufacturing',
      'Predictive maintenance',
      'Automated quality control',
      'Supply chain digitization',
      'Sustainable manufacturing'
    ],
    opportunities: [
      'Smart factory solutions',
      'Industrial IoT platforms',
      'Manufacturing analytics',
      'Robotic process automation',
      'Supply chain optimization'
    ],
    threats: [
      'High implementation costs',
      'Skills gap challenges',
      'Cybersecurity vulnerabilities',
      'Technology integration complexity',
      'Market competition'
    ],
    targetRegions: ['North America', 'Europe', 'Asia Pacific'],
    targetSectors: ['Automotive', 'Electronics', 'Aerospace'],
    keywords: ['manufacturing', 'Industry 4.0', 'smart factory', 'IoT'],
    tags: ['Manufacturing', 'Industry 4.0', 'Smart Factory'],
    author: 'Manufacturing Intelligence Team',
    coAuthors: ['Industry Expert', 'Technology Analyst'],
    isPublic: true,
    isFeatured: true
  },
  {
    title: 'Energy Sector Transition Analysis',
    description: 'Analysis of energy sector transition to renewable sources and clean technology market opportunities.',
    type: 'Market Outlook',
    category: 'Energy',
    priority: 'Critical',
    expiryDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000), // 8 months from now
    marketSize: 4000000000,
    currency: 'USD',
    growthRate: 11.8,
    riskLevel: 'Medium',
    aiInsights: 'Energy transition accelerating with significant investment in renewable energy and clean technologies.',
    aiConfidence: 88,
    keyTrends: [
      'Renewable energy growth',
      'Energy storage solutions',
      'Grid modernization',
      'Carbon capture technology',
      'Electric vehicle adoption'
    ],
    opportunities: [
      'Solar and wind projects',
      'Energy storage systems',
      'Smart grid technology',
      'Electric vehicle infrastructure',
      'Carbon management solutions'
    ],
    threats: [
      'Policy uncertainty',
      'Technology costs',
      'Grid integration challenges',
      'Resource availability',
      'Market volatility'
    ],
    targetRegions: ['Global', 'North America', 'Europe', 'Asia Pacific'],
    targetSectors: ['Energy', 'Utilities', 'Transportation'],
    keywords: ['renewable energy', 'clean technology', 'energy transition', 'sustainability'],
    tags: ['Energy', 'Renewable', 'Clean Technology'],
    author: 'Energy Research Team',
    coAuthors: ['Energy Expert', 'Policy Analyst'],
    isPublic: true,
    isFeatured: true
  }
];

const seedMarketDeclarations = async () => {
  try {
    console.log('🌱 Starting market declarations seeding...');

    // Get all companies
    const companies = await Company.find();
    console.log(`📊 Found ${companies.length} companies`);

    for (const company of companies) {
      console.log(`\n🏢 Seeding market declarations for: ${company.name}`);
      
      // Get admin user for this company
      const adminUser = await User.findOne({ 
        companyId: company._id, 
        email: { $regex: /admin@/i }
      });

      if (!adminUser) {
        console.log(`❌ No admin user found for ${company.name}`);
        continue;
      }

      // Clear existing market declarations for this company
      await MarketDeclaration.deleteMany({ companyId: company._id });
      console.log(`🗑️ Cleared existing market declarations for ${company.name}`);

      // Create market declarations with company and user references
      const declarationsToCreate = marketDeclarationsData.map((declarationData, index) => ({
        ...declarationData,
        companyId: company._id,
        createdBy: adminUser._id,
        updatedBy: adminUser._id,
        status: index % 3 === 0 ? 'Published' : index % 3 === 1 ? 'Draft' : 'Review',
        publishDate: index % 3 === 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
        analytics: {
          views: Math.floor(Math.random() * 500) + 50,
          downloads: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5,
          lastViewed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      }));

      const createdDeclarations = await MarketDeclaration.insertMany(declarationsToCreate);
      console.log(`✅ Created ${createdDeclarations.length} market declarations for ${company.name}`);

      // Log created declarations
      createdDeclarations.forEach(declaration => {
        console.log(`   - ${declaration.title} (${declaration.category}) - ${declaration.status} - ${declaration.growthRate}% growth`);
      });
    }

    console.log('\n🎉 Market declarations seeding completed for all companies!');
    console.log('You can now test the Market Declarations page in the frontend for any company.');

  } catch (error) {
    console.error('❌ Error seeding market declarations:', error);
  }
};

module.exports = { seedMarketDeclarations };
