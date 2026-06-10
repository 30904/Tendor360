const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const { ROLES } = require('../config/constants');

// Get all users with filtering, pagination, and search
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      department,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { companyId: req.user.companyId };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.department': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      filter.roles = { $in: [role] };
    }
    
    if (status) {
      if (status === 'Active') {
        filter.isActive = true;
      } else if (status === 'Inactive') {
        filter.isActive = false;
      }
    }
    
    if (department) {
      filter['profile.department'] = department;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(filter)
      .populate('companyId', 'name code displayName')
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Transform users data for frontend
    const transformedUsers = users.map(user => ({
      id: user._id,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      role: user.roles[0] || 'GUEST', // Primary role
      roles: user.roles,
      status: user.isActive ? 'Active' : 'Inactive',
      lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString().split('T')[0] : null,
      department: user.profile?.department || '',
      position: user.profile?.position || '',
      phone: user.profile?.phone || '',
      avatar: user.profile?.avatar || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.json({
      success: true,
      data: {
        users: transformedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      },
      message: 'Users retrieved successfully'
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: error.message
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findOne({ 
      _id: id, 
      companyId: req.user.companyId 
    })
    .populate('companyId', 'name code displayName')
    .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Transform user data
    const transformedUser = {
      id: user._id,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      role: user.roles[0] || 'GUEST',
      roles: user.roles,
      status: user.isActive ? 'Active' : 'Inactive',
      lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString().split('T')[0] : null,
      department: user.profile?.department || '',
      position: user.profile?.position || '',
      phone: user.profile?.phone || '',
      avatar: user.profile?.avatar || '',
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      company: user.companyId
    };

    res.json({
      success: true,
      data: { user: transformedUser },
      message: 'User retrieved successfully'
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
      message: error.message
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      position,
      phone,
      isActive = true
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'First name, last name, email, and password are required'
      });
    }

    // Check if user already exists in this company
    const existingUser = await User.findOne({ 
      companyId: req.user.companyId, 
      email: email.toLowerCase() 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
        message: 'A user with this email already exists in this company'
      });
    }

    // Validate role
    const validRoles = Object.values(ROLES);
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
        message: 'The specified role is not valid'
      });
    }

    // Create user
    const user = new User({
      companyId: req.user.companyId,
      email: email.toLowerCase(),
      password,
      name: `${firstName} ${lastName}`.trim(),
      roles: role ? [role] : [ROLES.GUEST],
      isActive,
      profile: {
        department: department || '',
        position: position || '',
        phone: phone || ''
      }
    });

    await user.save();

    // Transform user data for response
    const transformedUser = {
      id: user._id,
      firstName,
      lastName,
      email: user.email,
      role: user.roles[0],
      roles: user.roles,
      status: user.isActive ? 'Active' : 'Inactive',
      department: user.profile.department,
      position: user.profile.position,
      phone: user.profile.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      success: true,
      data: { user: transformedUser },
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      message: error.message
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      role,
      department,
      position,
      phone,
      isActive,
      preferences
    } = req.body;

    // Find user
    const user = await User.findOne({ 
      _id: id, 
      companyId: req.user.companyId 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ 
        companyId: req.user.companyId, 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists',
          message: 'A user with this email already exists in this company'
        });
      }
    }

    // Validate role
    if (role) {
      const validRoles = Object.values(ROLES);
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role',
          message: 'The specified role is not valid'
        });
      }
    }

    // Update user fields
    if (firstName || lastName) {
      const newName = `${firstName || user.name.split(' ')[0]} ${lastName || user.name.split(' ').slice(1).join(' ')}`.trim();
      user.name = newName;
    }
    
    if (email) user.email = email.toLowerCase();
    if (role) user.roles = [role];
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    // Update profile
    if (department !== undefined) user.profile.department = department;
    if (position !== undefined) user.profile.position = position;
    if (phone !== undefined) user.profile.phone = phone;

    await user.save();

    // Transform user data for response
    const transformedUser = {
      id: user._id,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      role: user.roles[0],
      roles: user.roles,
      status: user.isActive ? 'Active' : 'Inactive',
      lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString().split('T')[0] : null,
      department: user.profile.department,
      position: user.profile.position,
      phone: user.profile.phone,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      data: { user: transformedUser },
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
};

// Delete user (soft delete)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findOne({ 
      _id: id, 
      companyId: req.user.companyId 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Prevent deleting the current user
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete current user',
        message: 'You cannot delete your own account'
      });
    }

    // Soft delete
    user.isDeleted = true;
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
      message: error.message
    });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Password required',
        message: 'New password is required'
      });
    }

    // Find user
    const user = await User.findOne({ 
      _id: id, 
      companyId: req.user.companyId 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      message: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // Get user counts by status
    const totalUsers = await User.countDocuments({ companyId });
    const activeUsers = await User.countDocuments({ companyId, isActive: true });
    const inactiveUsers = await User.countDocuments({ companyId, isActive: false });

    // Get user counts by role
    const roleStats = await User.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      { $unwind: '$roles' },
      { $group: { _id: '$roles', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get department stats
    const departmentStats = await User.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      { $group: { 
        _id: '$profile.department', 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);

    // Get recent activity (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActiveUsers = await User.countDocuments({
      companyId,
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          recentActiveUsers
        },
        roleDistribution: roleStats,
        departmentDistribution: departmentStats
      },
      message: 'User statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user statistics',
      message: error.message
    });
  }
};

// Get available roles
const getRoles = async (req, res) => {
  try {
    const roles = Object.values(ROLES).map(role => ({
      value: role,
      label: role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }));

    res.json({
      success: true,
      data: { roles },
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  getUserStats,
  getRoles
};
