const mongoose = require('mongoose');
const Role = require('../models/Role');
const User = require('../models/User');

// Get all roles with filtering, pagination, and search
const getRoles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      isSystem,
      sortBy = 'priority',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      if (status === 'Active') {
        filter.isActive = true;
      } else if (status === 'Inactive') {
        filter.isActive = false;
      }
    }
    
    if (isSystem !== undefined) {
      filter.isSystem = isSystem === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination and populate user counts
    const roles = await Role.find(filter)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Role.countDocuments(filter);

    // Get user counts for each role
    const rolesWithUserCounts = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({ 
          roles: { $in: [role.name] },
          isActive: true,
          isDeleted: false
        });
        
        return {
          id: role._id,
          name: role.name,
          displayName: role.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
          description: role.description,
          permissions: role.permissions,
          isActive: role.isActive,
          isSystem: role.isSystem,
          priority: role.priority,
          userCount,
          createdBy: role.createdBy,
          updatedBy: role.updatedBy,
          createdAt: role.createdAt,
          updatedAt: role.updatedAt
        };
      })
    );

    res.json({
      success: true,
      data: {
        roles: rolesWithUserCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Roles retrieved successfully'
    });

  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve roles',
      message: error.message
    });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
        message: 'The requested role does not exist'
      });
    }

    // Get user count for this role
    const userCount = await User.countDocuments({ 
      roles: { $in: [role.name] },
      isActive: true,
      isDeleted: false
    });

    // Transform role data
    const transformedRole = {
      id: role._id,
      name: role.name,
      displayName: role.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
      isSystem: role.isSystem,
      priority: role.priority,
      userCount,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    res.json({
      success: true,
      data: { role: transformedRole },
      message: 'Role retrieved successfully'
    });

  } catch (error) {
    console.error('Get role by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve role',
      message: error.message
    });
  }
};

// Create new role
const createRole = async (req, res) => {
  try {
    const {
      name,
      description,
      permissions = [],
      isActive = true,
      priority = 0
    } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Name and description are required'
      });
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ name: name.toUpperCase() });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role already exists',
        message: 'A role with this name already exists'
      });
    }

    // Validate permissions
    const validPermissions = [
      'user:create', 'user:read', 'user:update', 'user:delete',
      'user:activate', 'user:deactivate', 'user:reset_password',
      'role:create', 'role:read', 'role:update', 'role:delete',
      'tender:create', 'tender:read', 'tender:update', 'tender:delete',
      'tender:publish', 'tender:close', 'tender:evaluate',
      'document:upload', 'document:read', 'document:update', 'document:delete',
      'document:approve', 'document:reject',
      'evaluation:create', 'evaluation:read', 'evaluation:update', 'evaluation:delete',
      'evaluation:approve', 'evaluation:reject',
      'pricing:create', 'pricing:read', 'pricing:update', 'pricing:delete',
      'contract:create', 'contract:read', 'contract:update', 'contract:delete',
      'report:create', 'report:read', 'report:update', 'report:delete',
      'setting:create', 'setting:read', 'setting:update', 'setting:delete',
      'system:admin', 'system:config',
      'calendar:create', 'calendar:read', 'calendar:update',
      'support_ticket:create', 'support_ticket:read', 'support_ticket:update', 'support_ticket:delete',
      'support_ticket:assign', 'support_ticket:resolve',
      'faq:create', 'faq:read', 'faq:update', 'faq:delete',
      'ALL'
    ];

    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid permissions',
        message: `Invalid permissions: ${invalidPermissions.join(', ')}`
      });
    }

    // Create role
    const role = new Role({
      name: name.toUpperCase(),
      description,
      permissions,
      isActive,
      priority,
      isSystem: false, // Custom roles are not system roles
      createdBy: req.user._id
    });

    await role.save();

    // Transform role data for response
    const transformedRole = {
      id: role._id,
      name: role.name,
      displayName: role.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
      isSystem: role.isSystem,
      priority: role.priority,
      userCount: 0,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    res.status(201).json({
      success: true,
      data: { role: transformedRole },
      message: 'Role created successfully'
    });

  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create role',
      message: error.message
    });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      permissions,
      isActive,
      priority
    } = req.body;

    // Find role
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
        message: 'The requested role does not exist'
      });
    }

    // Prevent modification of system roles
    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify system role',
        message: 'System roles cannot be modified'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name.toUpperCase() !== role.name) {
      const existingRole = await Role.findOne({ 
        name: name.toUpperCase(),
        _id: { $ne: id }
      });
      
      if (existingRole) {
        return res.status(400).json({
          success: false,
          error: 'Role name already exists',
          message: 'A role with this name already exists'
        });
      }
    }

    // Validate permissions if provided
    if (permissions) {
      const validPermissions = [
        'user:create', 'user:read', 'user:update', 'user:delete',
        'user:activate', 'user:deactivate', 'user:reset_password',
        'role:create', 'role:read', 'role:update', 'role:delete',
        'tender:create', 'tender:read', 'tender:update', 'tender:delete',
        'tender:publish', 'tender:close', 'tender:evaluate',
        'document:upload', 'document:read', 'document:update', 'document:delete',
        'document:approve', 'document:reject',
        'evaluation:create', 'evaluation:read', 'evaluation:update', 'evaluation:delete',
        'evaluation:approve', 'evaluation:reject',
        'pricing:create', 'pricing:read', 'pricing:update', 'pricing:delete',
        'contract:create', 'contract:read', 'contract:update', 'contract:delete',
        'report:create', 'report:read', 'report:update', 'report:delete',
        'setting:create', 'setting:read', 'setting:update', 'setting:delete',
        'system:admin', 'system:config',
        'calendar:create', 'calendar:read', 'calendar:update',
        'support_ticket:create', 'support_ticket:read', 'support_ticket:update', 'support_ticket:delete',
        'support_ticket:assign', 'support_ticket:resolve',
        'faq:create', 'faq:read', 'faq:update', 'faq:delete',
        'ALL'
      ];

      const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
      if (invalidPermissions.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid permissions',
          message: `Invalid permissions: ${invalidPermissions.join(', ')}`
        });
      }
    }

    // Update role fields
    if (name) role.name = name.toUpperCase();
    if (description) role.description = description;
    if (permissions) role.permissions = permissions;
    if (typeof isActive === 'boolean') role.isActive = isActive;
    if (typeof priority === 'number') role.priority = priority;
    
    role.updatedBy = req.user._id;
    await role.save();

    // Get user count for this role
    const userCount = await User.countDocuments({ 
      roles: { $in: [role.name] },
      isActive: true,
      isDeleted: false
    });

    // Transform role data for response
    const transformedRole = {
      id: role._id,
      name: role.name,
      displayName: role.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      description: role.description,
      permissions: role.permissions,
      isActive: role.isActive,
      isSystem: role.isSystem,
      priority: role.priority,
      userCount,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt
    };

    res.json({
      success: true,
      data: { role: transformedRole },
      message: 'Role updated successfully'
    });

  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update role',
      message: error.message
    });
  }
};

// Delete role
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Find role
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
        message: 'The requested role does not exist'
      });
    }

    // Prevent deletion of system roles
    if (role.isSystem) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete system role',
        message: 'System roles cannot be deleted'
      });
    }

    // Check if any users are assigned to this role
    const userCount = await User.countDocuments({ 
      roles: { $in: [role.name] },
      isActive: true,
      isDeleted: false
    });

    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete role with assigned users',
        message: `Cannot delete role "${role.name}" because ${userCount} user(s) are assigned to it`
      });
    }

    // Delete role
    await Role.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });

  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete role',
      message: error.message
    });
  }
};

// Copy role
const copyRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find source role
    const sourceRole = await Role.findById(id);
    if (!sourceRole) {
      return res.status(404).json({
        success: false,
        error: 'Source role not found',
        message: 'The role to copy does not exist'
      });
    }

    // Check if new role name already exists
    const existingRole = await Role.findOne({ name: name.toUpperCase() });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        error: 'Role name already exists',
        message: 'A role with this name already exists'
      });
    }

    // Create new role based on source role
    const newRole = new Role({
      name: name.toUpperCase(),
      description: description || `${sourceRole.description} (Copy)`,
      permissions: sourceRole.permissions,
      isActive: true,
      isSystem: false,
      priority: sourceRole.priority,
      createdBy: req.user._id
    });

    await newRole.save();

    // Transform role data for response
    const transformedRole = {
      id: newRole._id,
      name: newRole.name,
      displayName: newRole.name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      description: newRole.description,
      permissions: newRole.permissions,
      isActive: newRole.isActive,
      isSystem: newRole.isSystem,
      priority: newRole.priority,
      userCount: 0,
      createdBy: newRole.createdBy,
      updatedBy: newRole.updatedBy,
      createdAt: newRole.createdAt,
      updatedAt: newRole.updatedAt
    };

    res.status(201).json({
      success: true,
      data: { role: transformedRole },
      message: 'Role copied successfully'
    });

  } catch (error) {
    console.error('Copy role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to copy role',
      message: error.message
    });
  }
};

// Get role statistics
const getRoleStats = async (req, res) => {
  try {
    // Get role counts
    const totalRoles = await Role.countDocuments();
    const activeRoles = await Role.countDocuments({ isActive: true });
    const systemRoles = await Role.countDocuments({ isSystem: true });
    const customRoles = await Role.countDocuments({ isSystem: false });

    // Get total users across all roles
    const totalUsers = await User.countDocuments({ isActive: true, isDeleted: false });

    // Get role distribution
    const roleDistribution = await Role.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'name',
          foreignField: 'roles',
          as: 'users'
        }
      },
      {
        $project: {
          name: 1,
          userCount: { $size: '$users' },
          priority: 1
        }
      },
      { $sort: { priority: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalRoles,
          activeRoles,
          systemRoles,
          customRoles,
          totalUsers
        },
        roleDistribution
      },
      message: 'Role statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get role stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve role statistics',
      message: error.message
    });
  }
};

// Get available permissions
const getPermissions = async (req, res) => {
  try {
    const permissions = [
      {
        category: 'User Management',
        permissions: [
          { key: 'user:create', label: 'Create Users', description: 'Create new user accounts' },
          { key: 'user:read', label: 'View Users', description: 'View user information' },
          { key: 'user:update', label: 'Update Users', description: 'Modify user information' },
          { key: 'user:delete', label: 'Delete Users', description: 'Remove user accounts' },
          { key: 'user:activate', label: 'Activate Users', description: 'Activate user accounts' },
          { key: 'user:deactivate', label: 'Deactivate Users', description: 'Deactivate user accounts' },
          { key: 'user:reset_password', label: 'Reset Passwords', description: 'Reset user passwords' }
        ]
      },
      {
        category: 'Role Management',
        permissions: [
          { key: 'role:create', label: 'Create Roles', description: 'Create new roles' },
          { key: 'role:read', label: 'View Roles', description: 'View role information' },
          { key: 'role:update', label: 'Update Roles', description: 'Modify role permissions' },
          { key: 'role:delete', label: 'Delete Roles', description: 'Remove roles' }
        ]
      },
      {
        category: 'Tender Management',
        permissions: [
          { key: 'tender:create', label: 'Create Tenders', description: 'Create new tenders' },
          { key: 'tender:read', label: 'View Tenders', description: 'View tender information' },
          { key: 'tender:update', label: 'Update Tenders', description: 'Modify tender details' },
          { key: 'tender:delete', label: 'Delete Tenders', description: 'Remove tenders' },
          { key: 'tender:publish', label: 'Publish Tenders', description: 'Publish tenders' },
          { key: 'tender:close', label: 'Close Tenders', description: 'Close tender submissions' },
          { key: 'tender:evaluate', label: 'Evaluate Tenders', description: 'Evaluate tender submissions' }
        ]
      },
      {
        category: 'Document Management',
        permissions: [
          { key: 'document:upload', label: 'Upload Documents', description: 'Upload tender documents' },
          { key: 'document:read', label: 'View Documents', description: 'View document information' },
          { key: 'document:update', label: 'Update Documents', description: 'Modify document details' },
          { key: 'document:delete', label: 'Delete Documents', description: 'Remove documents' },
          { key: 'document:approve', label: 'Approve Documents', description: 'Approve document submissions' },
          { key: 'document:reject', label: 'Reject Documents', description: 'Reject document submissions' }
        ]
      },
      {
        category: 'Evaluation Management',
        permissions: [
          { key: 'evaluation:create', label: 'Create Evaluations', description: 'Create evaluation criteria' },
          { key: 'evaluation:read', label: 'View Evaluations', description: 'View evaluation information' },
          { key: 'evaluation:update', label: 'Update Evaluations', description: 'Modify evaluation details' },
          { key: 'evaluation:delete', label: 'Delete Evaluations', description: 'Remove evaluations' },
          { key: 'evaluation:approve', label: 'Approve Evaluations', description: 'Approve evaluation results' },
          { key: 'evaluation:reject', label: 'Reject Evaluations', description: 'Reject evaluation results' }
        ]
      },
      {
        category: 'System Administration',
        permissions: [
          { key: 'system:admin', label: 'System Administration', description: 'Full system administration access' },
          { key: 'system:config', label: 'System Configuration', description: 'Configure system settings' },
          { key: 'ALL', label: 'All Permissions', description: 'Grant all system permissions' }
        ]
      }
    ];

    res.json({
      success: true,
      data: { permissions },
      message: 'Permissions retrieved successfully'
    });

  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve permissions',
      message: error.message
    });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  copyRole,
  getRoleStats,
  getPermissions
};
