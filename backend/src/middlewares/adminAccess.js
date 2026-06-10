// Admin access middleware - gives admin users full access to all operations
const { ROLES } = require('../config/constants');

// Check if user is admin (has any admin-related role)
const isAdmin = (user) => {
  if (!user || !user.roles) return false;
  
  const adminRoles = [
    ROLES.SYSTEM_ADMINISTRATOR,
    ROLES.ADMIN,
    'ADMIN',
    'SYSTEM ADMINISTRATOR',
    'System Administrator',
    'Administrator'
  ];
  
  return user.roles.some(role => adminRoles.includes(role));
};

// Middleware to allow admin access or specific roles
const requireAdminOrRoles = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }

    // Check if user is admin
    if (isAdmin(req.user)) {
      console.log('✅ Admin user granted full access:', req.user.email);
      return next();
    }

    // Check if user has required roles
    const hasRequiredRole = req.user.hasAnyRole(requiredRoles);
    
    if (!hasRequiredRole) {
      console.log('❌ Access denied for user:', req.user.email, 'Required roles:', requiredRoles);
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Access denied. Required roles: ${requiredRoles.join(', ')} or Admin access`
      });
    }

    console.log('✅ User has required role:', req.user.email);
    next();
  };
};

// Middleware to allow only admin access
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'User must be authenticated'
    });
  }

  if (!isAdmin(req.user)) {
    console.log('❌ Admin access required for user:', req.user.email);
    return res.status(403).json({
      error: 'Admin access required',
      message: 'This operation requires administrator privileges'
    });
  }

  console.log('✅ Admin access granted:', req.user.email);
  next();
};

module.exports = {
  isAdmin,
  requireAdminOrRoles,
  requireAdmin
};
