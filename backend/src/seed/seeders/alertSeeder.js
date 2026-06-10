const mongoose = require('mongoose');
const Alert = require('../../models/Alert');
const User = require('../../models/User');

const seedAlerts = async () => {
  try {
    console.log('🔔 Seeding alerts...');
    
    // Get some users to create alerts for
    const users = await User.find({}).limit(5);
    if (users.length === 0) {
      console.log('⚠️ No users found, skipping alert seeding');
      return;
    }

    const alertData = [
      {
        companyId: users[0].companyId,
        user: users[0]._id,
        name: 'High Value Tenders',
        type: 'new_tender',
        criteria: {
          aiMatchScore: { min: 80, max: 100 },
          estimatedValue: { min: 1000000, max: 10000000 },
          therapeuticAreas: ['Oncology', 'Cardiovascular'],
          tenderTypes: ['Government RFP', 'Hospital Tender']
        },
        frequency: 'daily',
        channels: ['email', 'in_app'],
        isActive: true
      },
      {
        companyId: users[0].companyId,
        user: users[0]._id,
        name: 'Deadline Reminders',
        type: 'deadline_reminder',
        criteria: {
          status: ['active', 'evaluating'],
          pipelineStage: ['identified', 'evaluating', 'pursuing']
        },
        frequency: 'daily',
        channels: ['email', 'in_app'],
        isActive: true
      },
      {
        companyId: users[1] ? users[1].companyId : users[0].companyId,
        user: users[1] ? users[1]._id : users[0]._id,
        name: 'Diabetes Tenders',
        type: 'new_tender',
        criteria: {
          therapeuticAreas: ['Diabetes'],
          aiMatchScore: { min: 70, max: 100 },
          regions: ['North America', 'Europe']
        },
        frequency: 'weekly',
        channels: ['email'],
        isActive: true
      },
      {
        companyId: users[1] ? users[1].companyId : users[0].companyId,
        user: users[1] ? users[1]._id : users[0]._id,
        name: 'Status Change Notifications',
        type: 'status_change',
        criteria: {
          status: ['awarded', 'cancelled'],
          pipelineStage: ['submitted', 'awarded', 'lost']
        },
        frequency: 'immediate',
        channels: ['email', 'in_app', 'sms'],
        isActive: true
      },
      {
        companyId: users[2] ? users[2].companyId : users[0].companyId,
        user: users[2] ? users[2]._id : users[0]._id,
        name: 'Rare Diseases Opportunities',
        type: 'new_tender',
        criteria: {
          therapeuticAreas: ['Rare Diseases'],
          aiMatchScore: { min: 75, max: 100 },
          estimatedValue: { min: 500000, max: 5000000 }
        },
        frequency: 'daily',
        channels: ['email', 'in_app'],
        isActive: true
      },
      {
        companyId: users[2] ? users[2].companyId : users[0].companyId,
        user: users[2] ? users[2]._id : users[0]._id,
        name: 'Custom Search Alert',
        type: 'custom',
        criteria: {
          searchQuery: 'pharmaceutical equipment',
          organizations: ['Mayo Clinic', 'Johns Hopkins'],
          tenderTypes: ['Hospital Tender', 'Private Tender']
        },
        frequency: 'weekly',
        channels: ['email'],
        isActive: true
      },
      {
        companyId: users[3] ? users[3].companyId : users[0].companyId,
        user: users[3] ? users[3]._id : users[0]._id,
        name: 'High Priority Tenders',
        type: 'new_tender',
        criteria: {
          priority: ['high', 'critical'],
          aiMatchScore: { min: 85, max: 100 },
          status: ['active']
        },
        frequency: 'immediate',
        channels: ['email', 'in_app', 'sms'],
        isActive: true
      },
      {
        companyId: users[4] ? users[4].companyId : users[0].companyId,
        user: users[4] ? users[4]._id : users[0]._id,
        name: 'Monthly Summary',
        type: 'custom',
        criteria: {
          status: ['active', 'awarded', 'lost'],
          pipelineStage: ['identified', 'evaluating', 'pursuing', 'submitted', 'awarded', 'lost']
        },
        frequency: 'monthly',
        channels: ['email'],
        isActive: true
      }
    ];

    // Clear existing alerts
    await Alert.deleteMany({});
    console.log('🗑️ Cleared existing alerts');

    // Create alerts
    const alerts = await Alert.insertMany(alertData);
    console.log(`✅ Created ${alerts.length} alerts`);

    // Update some alerts with trigger data
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await Alert.updateMany(
      { frequency: 'daily' },
      { 
        lastTriggered: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
        nextTrigger: tomorrow,
        triggerCount: Math.floor(Math.random() * 10) + 1
      }
    );

    await Alert.updateMany(
      { frequency: 'weekly' },
      { 
        lastTriggered: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        nextTrigger: nextWeek,
        triggerCount: Math.floor(Math.random() * 5) + 1
      }
    );

    await Alert.updateMany(
      { frequency: 'immediate' },
      { 
        lastTriggered: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        triggerCount: Math.floor(Math.random() * 20) + 5
      }
    );

    console.log('✅ Updated alert trigger data');

  } catch (error) {
    console.error('❌ Error seeding alerts:', error);
    throw error;
  }
};

module.exports = seedAlerts;
