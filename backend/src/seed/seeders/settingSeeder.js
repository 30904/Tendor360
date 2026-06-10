const Setting = require('../../models/Setting');
const User = require('../../models/User');
const Company = require('../../models/Company');

const seedSettings = async () => {
  try {
    // Get all companies and create settings for each
    const companies = await Company.find({ isDeleted: false });
    if (companies.length === 0) {
      console.log('⚠️ No companies found, skipping setting seeding');
      return;
    }

    console.log(`⚙️ Creating settings for ${companies.length} companies...`);

    for (const company of companies) {
      console.log(`\n⚙️ Creating settings for ${company.name}...`);
      
      // Get admin user for this company
      const admin = await User.findOne({ 
        companyId: company._id, 
        roles: 'SYSTEM ADMINISTRATOR' 
      });
      
      if (!admin) {
        console.log(`⚠️ No admin user found for ${company.name}, skipping...`);
        continue;
      }

      const settings = [
        {
          companyId: company._id,
          key: 'SYSTEM_NAME',
          value: company.name,
          description: 'System display name',
          category: 'GENERAL',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'SYSTEM_VERSION',
          value: '1.0.0',
          description: 'Current system version',
          category: 'GENERAL',
          isEditable: false,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'MAX_FILE_SIZE',
          value: '10485760',
          description: 'Maximum file upload size in bytes (10MB)',
          category: 'UPLOAD',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'ALLOWED_FILE_TYPES',
          value: 'pdf,doc,docx,xls,xlsx,zip,rar,jpg,jpeg,png',
          description: 'Comma-separated list of allowed file extensions',
          category: 'UPLOAD',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'SESSION_TIMEOUT',
          value: '900',
          description: 'Session timeout in seconds (15 minutes)',
          category: 'SECURITY',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'PASSWORD_EXPIRY_DAYS',
          value: '90',
          description: 'Password expiry period in days',
          category: 'SECURITY',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'ENABLE_2FA',
          value: 'false',
          description: 'Enable two-factor authentication',
          category: 'SECURITY',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'SMTP_ENABLED',
          value: 'true',
          description: 'Enable SMTP email notifications',
          category: 'NOTIFICATIONS',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'DEFAULT_PAGE_SIZE',
          value: '20',
          description: 'Default number of items per page in lists',
          category: 'UI',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        },
        {
          companyId: company._id,
          key: 'THEME_COLOR',
          value: company.branding?.primaryColor || '#4678be',
          description: 'Primary theme color for the application',
          category: 'UI',
          isEditable: true,
          isActive: true,
          createdBy: admin._id,
          updatedBy: admin._id
        }
      ];

      for (const setting of settings) {
        const existingSetting = await Setting.findOne({ 
          companyId: company._id,
          key: setting.key 
        });
        if (!existingSetting) {
          await Setting.create(setting);
          console.log(`✅ Created setting: ${setting.key}`);
        } else {
          console.log(`ℹ️ Setting already exists: ${setting.key}`);
        }
      }
      
      console.log(`✅ Settings seeded successfully for ${company.name}`);
      console.log('---');
    }

    console.log('✅ All settings seeded successfully across all companies');
  } catch (error) {
    console.error('❌ Error seeding settings:', error);
    throw error;
  }
};

module.exports = seedSettings;
