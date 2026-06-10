const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { ROLES } = require('../config/constants');

// Verify JWT access token
const requireAuth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware - checking token...');
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      console.log('❌ JWT_ACCESS_SECRET not configured');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log('✅ Token verified for user ID:', decoded.id);
    console.log('🔍 Decoded token structure:', decoded);
    
    // Fetch complete user object from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      console.log('❌ User not found or inactive:', decoded.id);
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    const company = await Company.findById(user.companyId).select('organizationKind').lean();
    const organizationKind =
      company?.organizationKind || decoded.organizationKind || 'buyer';
    
    console.log('✅ User fetched successfully:', { userId: user._id, roles: user.roles });
    
    // Set the complete user object and companyId
    req.user = user;
    req.companyId = user.companyId || decoded.companyId; // Use user's companyId first, fallback to token's companyId
    req.organizationKind = organizationKind;
    
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Normalize requireRoles('A', 'B') and requireRoles(['A', 'B']) to the same flat list
function normalizeRequiredRoles(roles) {
  if (roles.length === 1 && Array.isArray(roles[0])) {
    return roles[0];
  }
  return roles;
}

// Check if user has specific role(s)
const requireRoles = (...roles) => {
  const requiredRoles = normalizeRequiredRoles(roles);

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }

    const hasRequiredRole = req.user.hasAnyRole(requiredRoles);

    if (!hasRequiredRole) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Access denied. Required roles: ${requiredRoles.join(', ')}`
      });
    }

    next();
  };
};

// Check if user has specific role
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }

    if (!req.user.hasRole(role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Access denied. Required role: ${role}`
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  requireAuth,
  requireRoles,
  requireRole,
  optionalAuth
};
