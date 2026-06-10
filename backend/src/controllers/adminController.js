const User = require('../models/User');
const Role = require('../models/Role');
const SystemConfig = require('../models/SystemConfig');
const AuditLog = require('../models/AuditLog');
const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');
const bcrypt = require('bcryptjs');

// System Statistics
const getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalRoles,
      totalTickets,
      openTickets,
      totalFAQs,
      systemConfig
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Role.countDocuments(),
      SupportTicket.countDocuments(),
      SupportTicket.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
      FAQ.countDocuments(),
      SystemConfig.findOne()
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      totalRoles,
      totalTickets,
      openTickets,
      totalFAQs,
      uptime: process.uptime ? `${Math.floor(process.uptime / 3600)}h ${Math.floor((process.uptime % 3600) / 60)}m` : 'N/A',
      version: process.version,
      platform: process.platform,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch system statistics' });
  }
};

// User Management
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', role = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.isActive = status === 'ACTIVE';
    if (role) query.roles = role;

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    // Format user data for frontend
    const formattedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles || [],
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      lastLoginAt: user.lastLoginAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile || {}
    }));

    res.json({
      success: true,
      data: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Format user data for frontend
    const formattedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles || [],
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      lastLoginAt: user.lastLoginAt || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile || {}
    };
    
    res.json({ success: true, data: formattedUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, roles, status = 'ACTIVE' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      roles,
      isActive: status === 'ACTIVE'
    });

    await user.save();

    // Log the action
    await AuditLog.create({
      action: 'USER_CREATED',
      resource: 'USER',
      resourceId: user._id,
      resourceType: 'USER',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { name, email, roles, status },
      responseStatus: 201,
      status: 'SUCCESS'
    });

    res.status(201).json({ success: true, data: user, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, roles, status, password } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (roles) user.roles = roles;
    if (status !== undefined) user.isActive = status === 'ACTIVE';
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    // Note: updatedAt is automatically handled by timestamps

    await user.save();

    // Log the action
    await AuditLog.create({
      action: 'USER_UPDATED',
      resource: 'USER',
      resourceId: user._id,
      resourceType: 'USER',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { name, email, roles, status },
      responseStatus: 200,
      status: 'SUCCESS'
    });

    res.json({ success: true, data: user, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting the current user
    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(userId);

    // Log the action
    await AuditLog.create({
      action: 'USER_DELETED',
      resource: 'USER',
      resourceId: userId,
      resourceType: 'USER',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { email: user.email },
      responseStatus: 200,
      status: 'SUCCESS'
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = status === 'ACTIVE';
    // Note: updatedAt is automatically handled by timestamps

    await user.save();

    // Log the action
    await AuditLog.create({
      action: 'USER_STATUS_UPDATED',
      resource: 'USER',
      resourceId: user._id,
      resourceType: 'USER',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { status },
      responseStatus: 200,
      status: 'SUCCESS'
    });

    res.json({ success: true, data: user, message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

// Role Management
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    
    // Add user count for each role
    const rolesWithUserCount = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({ roles: role._id });
        return {
          ...role.toObject(),
          userCount
        };
      })
    );
    
    res.json({ success: true, data: rolesWithUserCount });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
};

const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.json({ success: true, data: role });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch role' });
  }
};

const getAvailablePermissions = async (req, res) => {
  try {
    // Get all available permissions from the Role model schema
    const permissions = [
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
    ];
    
    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch permissions' });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'Role with this name already exists' });
    }

    const role = new Role({
      name,
      description,
      permissions,
      createdBy: req.user.id
    });

    await role.save();

    // Log the action
    await AuditLog.create({
      action: 'ROLE_CREATED',
      resource: 'ROLE',
      resourceId: role._id,
      resourceType: 'ROLE',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { name, description, permissions },
      responseStatus: 201,
      status: 'SUCCESS'
    });

    res.status(201).json({ success: true, data: role, message: 'Role created successfully' });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ success: false, message: 'Failed to create role' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const roleId = req.params.id;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    // Prevent updating system roles
    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot modify system roles' });
    }

    if (name) role.name = name;
    if (description) role.description = description;
    if (permissions) role.permissions = permissions;

    role.updatedBy = req.user.id;
    role.updatedAt = new Date();

    await role.save();

    // Log the action
    await AuditLog.create({
      action: 'ROLE_UPDATED',
      resource: 'ROLE',
      resourceId: role._id,
      resourceType: 'ROLE',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { name, description, permissions },
      responseStatus: 200,
      status: 'SUCCESS'
    });

    res.json({ success: true, data: role, message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ success: false, message: 'Failed to update role' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    // Prevent deleting system roles
    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot delete system roles' });
    }

    // Check if role is assigned to any users
    const usersWithRole = await User.countDocuments({ roles: roleId });
    if (usersWithRole > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete role that is assigned to users' });
    }

    await Role.findByIdAndDelete(roleId);

    // Log the action
    await AuditLog.create({
      action: 'ROLE_DELETED',
      resource: 'ROLE',
      resourceId: roleId,
      resourceType: 'ROLE',
      userId: req.user.id,
      userEmail: req.user.email || 'unknown',
      userName: req.user.name || 'unknown',
      userRoles: req.user.roles || [],
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      requestBody: { name: role.name },
      responseStatus: 200,
      status: 'SUCCESS'
    });

    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ success: false, message: 'Failed to delete role' });
  }
};

// Security Settings
const getSecuritySettings = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    const securitySettings = config?.securitySettings || {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true
      },
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      lockoutDuration: 900,
      twoFactorAuth: false,
      auditLogging: true
    };

    res.json({ success: true, data: securitySettings });
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch security settings' });
  }
};

const updateSecuritySettings = async (req, res) => {
  try {
    const securitySettings = req.body;

    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
    }

    config.securitySettings = securitySettings;
    config.updatedBy = req.user.id;
    config.updatedAt = new Date();

    await config.save();

    // Log the action
    await AuditLog.create({
      action: 'SECURITY_SETTINGS_UPDATED',
      entityType: 'SYSTEM_CONFIG',
      entityId: config._id,
      userId: req.user.id,
      details: securitySettings,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, data: config, message: 'Security settings updated successfully' });
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update security settings' });
  }
};

// System Configuration
const getSystemConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();
    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Error fetching system config:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch system configuration' });
  }
};

const updateSystemConfig = async (req, res) => {
  try {
    const configData = req.body;

    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
    }

    Object.assign(config, configData);
    config.updatedBy = req.user.id;
    config.updatedAt = new Date();

    await config.save();

    // Log the action
    await AuditLog.create({
      action: 'SYSTEM_CONFIG_UPDATED',
      entityType: 'SYSTEM_CONFIG',
      entityId: config._id,
      userId: req.user.id,
      details: configData,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({ success: true, data: config, message: 'System configuration updated successfully' });
  } catch (error) {
    console.error('Error updating system config:', error);
    res.status(500).json({ success: false, message: 'Failed to update system configuration' });
  }
};

// Audit Logs
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action = '', entityType = '', userId = '', startDate = '', endDate = '' } = req.query;
    
    const query = {};
    if (action) query.action = action;
    if (entityType) query.entityType = entityType;
    if (userId) query.userId = userId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
};

const exportAuditLogs = async (req, res) => {
  try {
    const { startDate = '', endDate = '' } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvData = logs.map(log => ({
      Timestamp: log.createdAt.toISOString(),
      Action: log.action,
      EntityType: log.entityType,
      EntityID: log.entityId,
      User: log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'System',
      Email: log.userId?.email || 'N/A',
      IPAddress: log.ipAddress,
      UserAgent: log.userAgent,
      Details: JSON.stringify(log.details)
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Simple CSV conversion
    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    res.send(csv);
  } catch (error) {
    console.error('Error exporting audit logs:', error);
    res.status(500).json({ success: false, message: 'Failed to export audit logs' });
  }
};

module.exports = {
  getSystemStats,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  getRoles,
  getRoleById,
  getAvailablePermissions,
  createRole,
  updateRole,
  deleteRole,
  getSecuritySettings,
  updateSecuritySettings,
  getSystemConfig,
  updateSystemConfig,
  getAuditLogs,
  exportAuditLogs
};
