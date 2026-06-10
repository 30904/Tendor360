const Calendar = require('../../models/Calendar');
const Tender = require('../../models/Tender');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedCalendar = async () => {
  try {
    // Get all companies and create calendar events for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('⚠️ No companies found, skipping calendar seeding');
      return;
    }

    console.log(`📅 Creating calendar events for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\n📅 Creating calendar events for ${company.name}...`);
      
      // Get tenders and managers for this company
      const tenders = await Tender.find({ companyId: company._id }).limit(2);
      const manager = await User.findOne({ 
        companyId: company._id, 
        roles: 'TENDER MANAGER' 
      });
      
      if (tenders.length === 0 || !manager) {
        console.log(`⚠️ No tenders or manager found for ${company.name}, skipping...`);
        continue;
      }

      // Create calendar events for each tender
      for (const tender of tenders) {
        const events = [
          {
            companyId: company._id,
            tenderId: tender._id,
            title: `${company.code} - Tender Submission Deadline - ${tender.reference}`,
            description: `Final submission deadline for ${tender.title}`,
            date: tender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            endDate: tender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            type: 'DEADLINE',
            priority: 'HIGH',
            status: 'UPCOMING',
            createdBy: manager._id,
            updatedBy: manager._id
          },
          {
            companyId: company._id,
            tenderId: tender._id,
            title: `${company.code} - Technical Evaluation Meeting - ${tender.reference}`,
            description: `Review technical proposals and conduct evaluation for ${tender.title}`,
            date: new Date((tender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).getTime() + 2 * 24 * 60 * 60 * 1000),
            endDate: new Date((tender.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
            type: 'MEETING',
            priority: 'MEDIUM',
            status: 'UPCOMING',
            createdBy: manager._id,
            updatedBy: manager._id
          }
        ];

        for (const event of events) {
          const existingEvent = await Calendar.findOne({ 
            companyId: company._id,
            title: event.title,
            date: event.date 
          });
          if (!existingEvent) {
            await Calendar.create(event);
            console.log(`✅ Created calendar event: ${event.title}`);
          } else {
            console.log(`ℹ️ Calendar event already exists: ${event.title}`);
          }
        }
      }
      
      console.log(`✅ Calendar events seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All calendar events seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding calendar events:', error);
    throw error;
  }
};

module.exports = seedCalendar;
