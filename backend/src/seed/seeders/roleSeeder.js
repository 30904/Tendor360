const Role = require('../../models/Role');

const seedRoles = async () => {
  try {
    console.log('🛡️ Starting role seeding...');

    // Define comprehensive roles with detailed permissions
    const roles = [
      {
        name: 'SYSTEM ADMINISTRATOR',
        description: 'Full system access with all administrative privileges and complete control over all system functions',
        permissions: ['ALL'],
        isSystem: true,
        priority: 1000
      },
      {
        name: 'ADMIN',
        description: 'System administration and user management with comprehensive access to user operations',
        permissions: [
          'user:create', 'user:read', 'user:update', 'user:delete',
          'user:activate', 'user:deactivate', 'user:reset_password',
          'role:create', 'role:read', 'role:update', 'role:delete',
          'system:admin', 'system:config',
          'tender:read', 'document:read', 'report:read',
          'support_ticket:create', 'support_ticket:read', 'support_ticket:update',
          'faq:read'
        ],
        isSystem: true,
        priority: 950
      },
      {
        name: 'TENDER MANAGER',
        description: 'Manage tender processes, oversee tender operations, and coordinate with various stakeholders',
        permissions: [
          'user:create', 'user:read', 'user:update', 'user:activate', 'user:deactivate',
          'role:read',
          'tender:create', 'tender:read', 'tender:update', 'tender:publish', 'tender:close', 'tender:evaluate',
          'document:upload', 'document:read', 'document:update', 'document:approve', 'document:reject',
          'evaluation:create', 'evaluation:read', 'evaluation:update', 'evaluation:approve', 'evaluation:reject',
          'pricing:create', 'pricing:read', 'pricing:update',
          'contract:create', 'contract:read', 'contract:update',
          'report:create', 'report:read', 'report:update',
          'calendar:create', 'calendar:read', 'calendar:update',
          'support_ticket:create', 'support_ticket:read', 'support_ticket:update', 'support_ticket:assign', 'support_ticket:resolve',
          'faq:create', 'faq:read', 'faq:update'
        ],
        isSystem: true,
        priority: 900
      },
      {
        name: 'REVIEWER',
        description: 'Review and evaluate tender submissions, assess compliance, and provide recommendations',
        permissions: [
          'tender:read', 'tender:evaluate',
          'document:read', 'document:approve', 'document:reject',
          'evaluation:create', 'evaluation:read', 'evaluation:update',
          'report:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 800
      },
      {
        name: 'APPROVER',
        description: 'Approve tender decisions, authorize financial commitments, and make final determinations',
        permissions: [
          'tender:read', 'tender:evaluate',
          'document:read', 'document:approve', 'document:reject',
          'evaluation:read', 'evaluation:approve', 'evaluation:reject',
          'pricing:read',
          'contract:read', 'contract:update',
          'report:read',
          'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 750
      },
      {
        name: 'PRICING ANALYST',
        description: 'Analyze pricing data, prepare cost estimates, and provide financial insights for tender decisions',
        permissions: [
          'tender:read',
          'document:read',
          'evaluation:read',
          'pricing:create', 'pricing:read', 'pricing:update',
          'report:create', 'report:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 700
      },
      {
        name: 'TENDER SPECIALIST',
        description: 'Specialized role for tender preparation, document management, and submission coordination',
        permissions: [
          'tender:create', 'tender:read', 'tender:update',
          'document:upload', 'document:read', 'document:update',
          'evaluation:read',
          'report:read',
          'calendar:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 600
      },
      {
        name: 'DOCUMENT MANAGER',
        description: 'Manage document lifecycle, ensure compliance, and maintain document repositories',
        permissions: [
          'tender:read',
          'document:upload', 'document:read', 'document:update', 'document:delete', 'document:approve', 'document:reject',
          'evaluation:read',
          'report:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 500
      },
      {
        name: 'FINANCE MANAGER',
        description: 'Financial oversight, budget management, cost analysis, and payment processing',
        permissions: [
          'tender:read',
          'document:read',
          'evaluation:read',
          'pricing:read',
          'contract:read', 'contract:update',
          'report:create', 'report:read', 'report:update',
          'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 400
      },
      {
        name: 'COMPLIANCE OFFICER',
        description: 'Ensure regulatory compliance, manage audit requirements, and monitor risk assessment',
        permissions: [
          'tender:read',
          'document:read', 'document:approve', 'document:reject',
          'evaluation:read',
          'report:create', 'report:read', 'report:update',
          'support_ticket:create', 'support_ticket:read',
          'faq:create', 'faq:read', 'faq:update'
        ],
        isSystem: true,
        priority: 300
      },
      {
        name: 'PROJECT MANAGER',
        description: 'Coordinate project activities, manage timelines, and ensure project deliverables',
        permissions: [
          'tender:read', 'tender:update',
          'document:read', 'document:update',
          'evaluation:read',
          'report:read',
          'calendar:create', 'calendar:read', 'calendar:update',
          'support_ticket:create', 'support_ticket:read', 'support_ticket:update',
          'faq:read'
        ],
        isSystem: true,
        priority: 200
      },
      {
        name: 'GUEST',
        description: 'Limited access for external stakeholders, vendors, and temporary users',
        permissions: [
          'tender:read',
          'document:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: true,
        priority: 100
      },
      {
        name: 'CONTRACT MANAGER',
        description: 'Manage contract lifecycle, negotiate terms, and ensure contract compliance',
        permissions: [
          'tender:read',
          'document:read',
          'evaluation:read',
          'contract:create', 'contract:read', 'contract:update', 'contract:delete',
          'report:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: false,
        priority: 350
      },
      {
        name: 'QUALITY ASSURANCE',
        description: 'Ensure quality standards, conduct audits, and maintain quality processes',
        permissions: [
          'tender:read',
          'document:read', 'document:approve', 'document:reject',
          'evaluation:read',
          'report:create', 'report:read',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: false,
        priority: 250
      },
      {
        name: 'BUSINESS ANALYST',
        description: 'Analyze business processes, identify improvements, and provide strategic insights',
        permissions: [
          'tender:read',
          'document:read',
          'evaluation:read',
          'report:create', 'report:read', 'report:update',
          'support_ticket:create', 'support_ticket:read',
          'faq:read'
        ],
        isSystem: false,
        priority: 150
      }
    ];

    // Insert or update roles
    for (const roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      
      if (!existingRole) {
        const role = new Role({
          ...roleData,
          createdBy: '000000000000000000000000' // System user ID
        });
        
        await role.save();
        console.log(`✅ Created role: ${roleData.name} with ${roleData.permissions.length} permissions`);
      } else {
        // Update existing role with new permissions if needed
        const hasChanges = 
          existingRole.description !== roleData.description ||
          JSON.stringify(existingRole.permissions.sort()) !== JSON.stringify(roleData.permissions.sort()) ||
          existingRole.priority !== roleData.priority;

        if (hasChanges) {
          existingRole.description = roleData.description;
          existingRole.permissions = roleData.permissions;
          existingRole.priority = roleData.priority;
          existingRole.updatedBy = '000000000000000000000000';
          
          await existingRole.save();
          console.log(`🔄 Updated role: ${roleData.name} with ${roleData.permissions.length} permissions`);
        } else {
          console.log(`⏭️ Role already exists: ${roleData.name}`);
        }
      }
    }

    // Get final statistics
    const totalRoles = await Role.countDocuments();
    const systemRoles = await Role.countDocuments({ isSystem: true });
    const customRoles = await Role.countDocuments({ isSystem: false });
    const activeRoles = await Role.countDocuments({ isActive: true });

    console.log('✅ Role seeding completed successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total Roles: ${totalRoles}`);
    console.log(`   - System Roles: ${systemRoles}`);
    console.log(`   - Custom Roles: ${customRoles}`);
    console.log(`   - Active Roles: ${activeRoles}`);

    // Display role summary
    console.log('\n📋 Role Summary:');
    const allRoles = await Role.find().sort({ priority: -1 });
    allRoles.forEach(role => {
      const type = role.isSystem ? 'System' : 'Custom';
      const status = role.isActive ? 'Active' : 'Inactive';
      console.log(`   - ${role.name} (${type}, ${status}, Priority: ${role.priority}, Permissions: ${role.permissions.length})`);
    });

  } catch (error) {
    console.error('❌ Error seeding roles:', error);
    throw error;
  }
};

module.exports = seedRoles;