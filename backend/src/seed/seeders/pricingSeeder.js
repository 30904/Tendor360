const Pricing = require('../../models/Pricing');
const Tender = require('../../models/Tender');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedPricing = async () => {
  try {
    // Get all companies and create pricing for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('⚠️ No companies found, skipping pricing seeding');
      return;
    }

    console.log(`💰 Creating pricing for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\n💰 Creating pricing for ${company.name}...`);
      
      // Get tenders and pricing analysts for this company
      const tenders = await Tender.find({ companyId: company._id }).limit(2);
      const analyst = await User.findOne({ 
        companyId: company._id, 
        roles: 'PRICING ANALYST' 
      });
      
      if (tenders.length === 0 || !analyst) {
        console.log(`⚠️ No tenders or pricing analyst found for ${company.name}, skipping...`);
        continue;
      }

      // Create pricing for each tender
      for (const tender of tenders) {
        const pricing = [
          {
            companyId: company._id,
            tenderId: tender._id,
            items: [
              {
                name: `${company.code} - Main Equipment`,
                description: 'Primary equipment/solution for the tender',
                quantity: 1,
                unit: 'set',
                cost: 2000000,
                price: 2300000,
                margin: 15
              },
              {
                name: `${company.code} - Installation Services`,
                description: 'Installation and setup services',
                quantity: 1,
                unit: 'service',
                cost: 300000,
                price: 345000,
                margin: 15
              },
              {
                name: `${company.code} - Training Program`,
                description: 'Staff training and knowledge transfer',
                quantity: 1,
                unit: 'program',
                cost: 100000,
                price: 115000,
                margin: 15
              },
              {
                name: `${company.code} - Support Contract`,
                description: 'Annual support and maintenance',
                quantity: 1,
                unit: 'year',
                cost: 100000,
                price: 115000,
                margin: 15
              }
            ],
            totalCost: 2500000,
            markup: 15,
            finalPrice: 2875000,
            currency: tender.currency || 'USD',
            winProbability: 75,
            competitorAnalysis: 'Competitive pricing with strong value proposition',
            recommendations: ['Maintain current pricing', 'Highlight after-sales support'],
            status: 'APPROVED',
            createdBy: analyst._id,
            updatedBy: analyst._id
          }
        ];

        for (const price of pricing) {
          const existingPrice = await Pricing.findOne({ 
            companyId: company._id,
            tenderId: price.tenderId 
          });
          if (!existingPrice) {
            await Pricing.create(price);
            console.log(`✅ Created pricing for tender ${tender.reference}`);
          } else {
            console.log(`ℹ️ Pricing already exists for tender ${tender.reference}`);
          }
        }
      }
      
      console.log(`✅ Pricing seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All pricing seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding pricing:', error);
    throw error;
  }
};

module.exports = seedPricing;
