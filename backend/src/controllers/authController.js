const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Role = require('../models/Role');
const { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/jwt');
const { ROLES } = require('../config/constants');

// Register supplier/respondent org + user (participant onboarding)
const registerRespondent = async (req, res) => {
  try {
    const { email, password, name, companyName, displayName } = req.body;

    if (!email || !password || !name || !companyName) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'email, password, name, and companyName are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    const baseName = companyName.trim();
    let uniqueName = baseName;
    let n = 1;
    while (await Company.findOne({ name: uniqueName })) {
      uniqueName = `${baseName} (${n})`;
      n += 1;
    }

    const company = await Company.create({
      name: uniqueName,
      displayName: (displayName || companyName).trim(),
      contact: {
        email: email.toLowerCase().trim()
      },
      organizationKind: 'supplier'
    });

    const user = new User({
      email: email.toLowerCase().trim(),
      password,
      name: name.trim(),
      companyId: company._id,
      roles: [ROLES.GUEST]
    });

    await user.save();

    const accessToken = generateAccessToken(user._id, company._id, 'supplier');
    const refreshToken = generateRefreshToken(user._id, company._id, 'supplier');
    setRefreshTokenCookie(res, refreshToken);

    user.lastLoginAt = new Date();
    await user.save();

    res.status(201).json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isActive: user.isActive,
          company: {
            id: company._id,
            name: company.name,
            code: company.code,
            displayName: company.displayName,
            organizationKind: 'supplier'
          }
        },
        accessToken
      },
      message: 'Participant account created successfully'
    });
  } catch (error) {
    console.error('registerRespondent error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message || 'Internal server error during registration'
    });
  }
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, name, companyId, roles = [ROLES.GUEST] } = req.body;

    // Validate companyId
    if (!companyId) {
      return res.status(400).json({
        error: 'Company required',
        message: 'Company ID is required for registration'
      });
    }

    // Check if user already exists in this company
    const existingUser = await User.findOne({ companyId, email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'A user with this email already exists in this company'
      });
    }

    // Validate roles
    const validRoles = await Role.find({ key: { $in: roles } });
    if (validRoles.length !== roles.length) {
      return res.status(400).json({
        error: 'Invalid roles',
        message: 'One or more specified roles are invalid'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      name,
      companyId,
      roles
    });

    await user.save();

    // Generate tokens with companyId
    const accessToken = generateAccessToken(user._id, companyId);
    const refreshToken = generateRefreshToken(user._id, companyId);

    // Set refresh token as httpOnly cookie
    setRefreshTokenCookie(res, refreshToken);

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Return user data and access token
    res.status(201).json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isActive: user.isActive
        },
        accessToken
      },
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt received:', { 
      email: req.body.email, 
      hasPassword: !!req.body.password,
      body: req.body 
    });

    // Check MongoDB connection status
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected. Connection state:', mongoose.connection.readyState);
      return res.status(500).json({
        error: 'Database connection error',
        message: 'Database is not available. Please try again later.'
      });
    }
    console.log('✅ MongoDB connection verified');

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    console.log('🔍 Searching for user with email:', email);
    
    // Find user by email and populate company
    const user = await User.findOne({ email }).populate(
      'companyId',
      'name code displayName organizationKind'
    );
    console.log('👤 User search result:', { 
      found: !!user, 
      userId: user?._id, 
      companyId: user?.companyId?._id,
      companyName: user?.companyId?.name,
      isActive: user?.isActive,
      hasPassword: !!user?.password 
    });

    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive');
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    console.log('🔑 Comparing password for user:', user._id);
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('🔐 Password validation result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', user._id);
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Login successful, generating tokens for user:', user._id);
    
    const orgKind = user.companyId.organizationKind || 'buyer';
    const accessToken = generateAccessToken(user._id, user.companyId._id, orgKind);
    const refreshToken = generateRefreshToken(user._id, user.companyId._id, orgKind);
    
    console.log('🎫 Tokens generated:', { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken 
    });

    // Set refresh token as httpOnly cookie
    setRefreshTokenCookie(res, refreshToken);
    console.log('🍪 Refresh token cookie set');

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    console.log('📅 Last login updated');

    // Return user data and access token
    const responseData = {
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isActive: user.isActive,
          preferences: user.preferences,
          company: {
            id: user.companyId._id,
            name: user.companyId.name,
            code: user.companyId.code,
            displayName: user.companyId.displayName,
            organizationKind: orgKind
          }
        },
        accessToken
      },
      message: 'Login successful'
    };
    
    console.log('📤 Sending successful login response:', {
      userId: user._id,
      userEmail: user.email,
      userRoles: user.roles
    });
    
    res.json(responseData);

  } catch (error) {
    console.error('❌ Login error occurred:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      error: 'Login failed',
      message: 'Internal server error during login'
    });
  }
};

// Refresh access token
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token required',
        message: 'No refresh token provided'
      });
    }

    // Verify refresh token
    const { valid, userId, companyId, error } = require('../utils/jwt').verifyRefreshToken(refreshToken);
    
    if (!valid) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Refresh token is invalid or expired'
      });
    }

    // Check if user exists and is active
    const user = await User.findById(userId).populate('companyId', 'organizationKind').select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User not found or inactive',
        message: 'User account is not available'
      });
    }

    const orgKind = user.companyId?.organizationKind || 'buyer';
    const cid = user.companyId._id || companyId;
    // Generate new access token with companyId
    const newAccessToken = generateAccessToken(user._id, cid, orgKind);

    res.json({
      data: {
        accessToken: newAccessToken
      },
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Internal server error during token refresh'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Clear refresh token cookie
    clearRefreshTokenCookie(res);

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Internal server error during logout'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'companyId',
      'name code displayName organizationKind'
    ).select('-password');

    const orgKindProfile = user.companyId.organizationKind || 'buyer';
    
    res.json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isActive: user.isActive,
          profile: user.profile,
          preferences: user.preferences,
          lastLoginAt: user.lastLoginAt,
          company: {
            id: user.companyId._id,
            name: user.companyId.name,
            code: user.companyId.code,
            displayName: user.companyId.displayName,
            organizationKind: orgKindProfile
          }
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'Internal server error while retrieving profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, profile, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (profile) updateData.profile = profile;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          isActive: user.isActive,
          profile: user.profile,
          preferences: user.preferences
        }
      },
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Internal server error while updating profile'
    });
  }
};

module.exports = {
  register,
  registerRespondent,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile
};
