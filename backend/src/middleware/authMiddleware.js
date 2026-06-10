const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token

    // Check for token in headers or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No access token provided'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    
    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password')
    if (!user || user.isDeleted) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      })
    }

    // Grant access to protected route
    req.user = user
    req.companyId = decoded.companyId // Add companyId to request object
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      })
    }

    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route'
    })
  }
}

// Restrict access to specific roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not authenticated'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      })
    }

    next()
  }
}

// Optional authentication - doesn't block if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      if (user && !user.isDeleted) {
        req.user = user
        req.companyId = decoded.companyId // Add companyId to request object
      }
    }

    next()
  } catch (error) {
    // Continue without authentication
    next()
  }
}
