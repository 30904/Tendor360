const mongoose = require('mongoose');
const SavedSearch = require('../../models/SavedSearch');
const User = require('../../models/User');

const seedSavedSearches = async () => {
  try {
    console.log('🔍 Seeding saved searches...');
    
    // Get some users to create saved searches for
    const users = await User.find({}).limit(5);
    if (users.length === 0) {
      console.log('⚠️ No users found, skipping saved search seeding');
      return;
    }

    const savedSearchData = [
      {
        companyId: users[0].companyId,
        name: 'High Value Oncology Tenders',
        description: 'Search for high-value oncology tenders with good AI match scores',
        user: users[0]._id,
        filters: {
          therapeuticAreas: ['Oncology'],
          aiMatchScore: { min: 80, max: 100 },
          estimatedValue: { min: 1000000, max: 10000000 },
          tenderTypes: ['Government RFP', 'Hospital Tender'],
          status: ['active'],
          pipelineStage: ['identified', 'evaluating']
        },
        isDefault: true,
        isPublic: false,
        lastUsed: new Date(),
        useCount: 15
      },
      {
        companyId: users[0].companyId,
        name: 'Diabetes Equipment Tenders',
        description: 'Find diabetes-related equipment and supply tenders',
        user: users[0]._id,
        filters: {
          searchQuery: 'diabetes equipment supplies',
          therapeuticAreas: ['Diabetes'],
          aiMatchScore: { min: 70, max: 100 },
          regions: ['North America', 'Europe'],
          tenderTypes: ['Hospital Tender', 'Private Tender']
        },
        isDefault: false,
        isPublic: false,
        lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        useCount: 8
      },
      {
        companyId: users[1] ? users[1].companyId : users[0].companyId,
        name: 'Urgent Deadlines',
        description: 'Tenders with deadlines in the next 30 days',
        user: users[1] ? users[1]._id : users[0]._id,
        filters: {
          status: ['active'],
          pipelineStage: ['identified', 'evaluating', 'pursuing'],
          urgency: ['high', 'critical']
        },
        isDefault: false,
        isPublic: false,
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        useCount: 12
      },
      {
        companyId: users[1] ? users[1].companyId : users[0].companyId,
        name: 'Cardiovascular Research',
        description: 'Cardiovascular research and clinical trial opportunities',
        user: users[1] ? users[1]._id : users[0]._id,
        filters: {
          therapeuticAreas: ['Cardiovascular'],
          searchQuery: 'research clinical trial',
          aiMatchScore: { min: 75, max: 100 },
          tenderTypes: ['Government RFP', 'Framework Agreement']
        },
        isDefault: false,
        isPublic: true,
        sharedWith: [
          {
            user: users[2] ? users[2]._id : users[0]._id,
            permission: 'view'
          }
        ],
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        useCount: 6
      },
      {
        companyId: users[2] ? users[2].companyId : users[0].companyId,
        name: 'Rare Diseases Opportunities',
        description: 'Specialized search for rare disease tenders',
        user: users[2] ? users[2]._id : users[0]._id,
        filters: {
          therapeuticAreas: ['Rare Diseases'],
          aiMatchScore: { min: 80, max: 100 },
          estimatedValue: { min: 500000, max: 5000000 },
          organizations: ['NIH', 'FDA', 'EMA']
        },
        isDefault: true,
        isPublic: false,
        lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        useCount: 4
      },
      {
        companyId: users[2] ? users[2].companyId : users[0].companyId,
        name: 'Neurology Equipment',
        description: 'Neurology equipment and diagnostic tools',
        user: users[2] ? users[2]._id : users[0]._id,
        filters: {
          therapeuticAreas: ['Neurology'],
          searchQuery: 'equipment diagnostic imaging',
          aiMatchScore: { min: 70, max: 100 },
          tenderTypes: ['Hospital Tender', 'Supply Agreement']
        },
        isDefault: false,
        isPublic: false,
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        useCount: 3
      },
      {
        companyId: users[3] ? users[3].companyId : users[0].companyId,
        name: 'Respiratory Care Tenders',
        description: 'Respiratory care and pulmonary medicine tenders',
        user: users[3] ? users[3]._id : users[0]._id,
        filters: {
          therapeuticAreas: ['Respiratory'],
          aiMatchScore: { min: 75, max: 100 },
          regions: ['North America', 'Europe', 'Asia'],
          status: ['active']
        },
        isDefault: false,
        isPublic: true,
        sharedWith: [
          {
            user: users[0]._id,
            permission: 'view'
          },
          {
            user: users[1] ? users[1]._id : users[0]._id,
            permission: 'edit'
          }
        ],
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        useCount: 9
      },
      {
        companyId: users[4] ? users[4].companyId : users[0].companyId,
        name: 'High Priority Active Tenders',
        description: 'All high priority active tenders for quick review',
        user: users[4] ? users[4]._id : users[0]._id,
        filters: {
          priority: ['high', 'critical'],
          status: ['active'],
          pipelineStage: ['identified', 'evaluating', 'pursuing']
        },
        isDefault: true,
        isPublic: false,
        lastUsed: new Date(),
        useCount: 25
      },
      {
        companyId: users[4] ? users[4].companyId : users[0].companyId,
        name: 'Awarded Tenders Analysis',
        description: 'Recently awarded tenders for competitive analysis',
        user: users[4] ? users[4]._id : users[0]._id,
        filters: {
          status: ['awarded'],
          pipelineStage: ['awarded']
        },
        isDefault: false,
        isPublic: false,
        lastUsed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        useCount: 2
      },
      {
        companyId: users[0].companyId,
        name: 'Public Procurement Opportunities',
        description: 'Government and public sector procurement opportunities',
        user: users[0]._id,
        filters: {
          tenderTypes: ['Public Procurement', 'Government RFP'],
          aiMatchScore: { min: 60, max: 100 },
          estimatedValue: { min: 100000, max: 5000000 }
        },
        isDefault: false,
        isPublic: true,
        sharedWith: [
          {
            user: users[1] ? users[1]._id : users[0]._id,
            permission: 'view'
          },
          {
            user: users[2] ? users[2]._id : users[0]._id,
            permission: 'view'
          }
        ],
        lastUsed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        useCount: 7
      }
    ];

    // Clear existing saved searches
    await SavedSearch.deleteMany({});
    console.log('🗑️ Cleared existing saved searches');

    // Create saved searches
    const savedSearches = await SavedSearch.insertMany(savedSearchData);
    console.log(`✅ Created ${savedSearches.length} saved searches`);

    // Update use counts and last used dates for some searches
    const popularSearches = savedSearches.slice(0, 5);
    for (const search of popularSearches) {
      const randomUseCount = Math.floor(Math.random() * 20) + 5;
      const randomDaysAgo = Math.floor(Math.random() * 7);
      const lastUsed = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      await SavedSearch.findByIdAndUpdate(search._id, {
        useCount: randomUseCount,
        lastUsed: lastUsed
      });
    }

    console.log('✅ Updated saved search usage data');

  } catch (error) {
    console.error('❌ Error seeding saved searches:', error);
    throw error;
  }
};

module.exports = seedSavedSearches;
