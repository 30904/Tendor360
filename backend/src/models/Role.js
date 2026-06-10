const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      // User Management
      'user:create', 'user:read', 'user:update', 'user:delete',
      'user:activate', 'user:deactivate', 'user:reset_password',
      
      // Role Management
      'role:create', 'role:read', 'role:update', 'role:delete',
      
      // Tender Management
      'tender:create', 'tender:read', 'tender:update', 'tender:delete',
      'tender:publish', 'tender:close', 'tender:evaluate',
      
      // Document Management
      'document:upload', 'document:read', 'document:update', 'document:delete',
      'document:approve', 'document:reject',
      
      // Evaluation Management
      'evaluation:create', 'evaluation:read', 'evaluation:update', 'evaluation:delete',
      'evaluation:approve', 'evaluation:reject',
      
      // Pricing Management
      'pricing:create', 'pricing:read', 'pricing:update', 'pricing:delete',
      
      // Contract Management
      'contract:create', 'contract:read', 'contract:update', 'contract:delete',
      
      // Report Management
      'report:create', 'report:read', 'report:update', 'report:delete',
      
      // Setting Management
      'setting:create', 'setting:read', 'setting:update', 'setting:delete',
      
      // System Management
      'system:admin', 'system:config',
      
      // Calendar Management
      'calendar:create', 'calendar:read', 'calendar:update',
      
      // Support Management
      'support_ticket:create', 'support_ticket:read', 'support_ticket:update', 'support_ticket:delete',
      'support_ticket:assign', 'support_ticket:resolve',
      'faq:create', 'faq:read', 'faq:update', 'faq:delete',
      
      // All permissions (super admin)
      'ALL'
    ],
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'Role'
});

// Indexes
roleSchema.index({ name: 1 });
roleSchema.index({ isActive: 1 });
roleSchema.index({ priority: -1 });

// Virtual for user count
roleSchema.virtual('userCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'roles',
  count: true
});

// Ensure virtual fields are serialized
roleSchema.set('toJSON', { virtuals: true });
roleSchema.set('toObject', { virtuals: true });

// Pre-save middleware
roleSchema.pre('save', function(next) {
  // Ensure name is uppercase
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  
  // Set priority based on role name
  if (this.name === 'SUPER_ADMIN') {
    this.priority = 1000;
  } else if (this.name === 'ADMIN') {
    this.priority = 900;
  } else if (this.name === 'TENDER_MANAGER') {
    this.priority = 800;
  } else if (this.name === 'ANALYST') {
    this.priority = 600;
  } else if (this.name === 'USER') {
    this.priority = 100;
  }
  
  next();
});

// Static methods
roleSchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ priority: -1 });
};

roleSchema.statics.findByName = function(name) {
  return this.findOne({ name: name.toUpperCase(), isActive: true });
};

roleSchema.statics.findSystemRoles = function() {
  return this.find({ isSystem: true, isActive: true }).sort({ priority: -1 });
};

// Instance methods
roleSchema.methods.hasPermission = function(permission) {
  if (this.permissions.includes('ALL')) {
    return true;
  }
  return this.permissions.includes(permission);
};

roleSchema.methods.hasAnyPermission = function(permissions) {
  if (this.permissions.includes('ALL')) {
    return true;
  }
  return permissions.some(permission => this.permissions.includes(permission));
};

roleSchema.methods.addPermission = function(permission) {
  if (!this.permissions.includes(permission)) {
    this.permissions.push(permission);
  }
  return this;
};

roleSchema.methods.removePermission = function(permission) {
  this.permissions = this.permissions.filter(p => p !== permission);
  return this;
};

// Create default roles if they don't exist
roleSchema.statics.initializeDefaultRoles = async function() {
  const defaultRoles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Full system access and control',
      permissions: ['ALL'],
      isSystem: true,
      priority: 1000
    },
    {
      name: 'ADMIN',
      description: 'System administration and user management',
      permissions: [
        'user:create', 'user:read', 'user:update', 'user:delete',
        'role:create', 'role:read', 'role:update', 'role:delete',
        'system:admin', 'system:config'
      ],
      isSystem: true,
      priority: 900
    },
    {
      name: 'TENDER_MANAGER',
      description: 'Manage tenders and oversee operations',
      permissions: [
        'tender:create', 'tender:read', 'tender:update', 'tender:publish',
        'tender:close', 'document:read', 'document:approve', 'document:reject',
        'evaluation:read', 'report:read'
      ],
      isSystem: true,
      priority: 800
    },
    {
      name: 'ANALYST',
      description: 'Analyze data and generate reports',
      permissions: [
        'tender:read', 'document:read', 'evaluation:read',
        'report:read'
      ],
      isSystem: true,
      priority: 600
    },
    {
      name: 'USER',
      description: 'Basic user access',
      permissions: [
        'tender:read', 'document:read', 'support_ticket:create',
        'support_ticket:read', 'faq:read'
      ],
      isSystem: true,
      priority: 100
    }
  ];

  for (const roleData of defaultRoles) {
    const existingRole = await this.findOne({ name: roleData.name });
    if (!existingRole) {
      await this.create({
        ...roleData,
        createdBy: '000000000000000000000000' // System user ID
      });
    }
  }
};

module.exports = mongoose.model('Role', roleSchema);
