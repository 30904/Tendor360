const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  roles: [{
    type: String,
    enum: Object.values(ROLES),
    default: [ROLES.GUEST]
  }],
  lastLoginAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  profile: {
    avatar: String,
    phone: String,
    department: String,
    position: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  collection: 'User'
});

// Indexes for performance and constraints
userSchema.index({ isDeleted: 1 });
userSchema.index({ companyId: 1, email: 1 }, { unique: true }); // Unique email per company
userSchema.index({ companyId: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  console.log('🔐 Hashing password for user:', this._id || 'new user');
  console.log('🔐 Original password:', this.password);
  console.log('🔐 Original password length:', this.password?.length);
  
  // Check MongoDB connection status
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected during password hashing');
    return next(new Error('Database connection lost'));
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔐 Password hashed successfully, new hash length:', this.password?.length);
    console.log('🔐 New hash starts with:', this.password?.substring(0, 20));
    next();
  } catch (error) {
    console.error('❌ Password hashing error:', error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('🔑 Comparing passwords for user:', this._id);
  console.log('🔑 Candidate password:', candidatePassword);
  console.log('🔑 Candidate password length:', candidatePassword?.length);
  console.log('🔑 Stored password hash:', this.password);
  console.log('🔑 Stored password hash length:', this.password?.length);
  
  // Check MongoDB connection status
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected during password comparison');
    throw new Error('Database connection lost');
  }
  
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔑 Password comparison result:', result);
    return result;
  } catch (error) {
    console.error('❌ Password comparison error:', error);
    return false;
  }
};

// Check if user has role
userSchema.methods.hasRole = function(role) {
  return this.roles.includes(role);
};

// Check if user has any of the roles (accepts flat array or nested array from legacy callers)
userSchema.methods.hasAnyRole = function(roles) {
  const required = Array.isArray(roles?.[0]) ? roles[0] : roles;
  if (!required?.length) return false;
  const normalizedRequired = required.map((r) => String(r).trim().toUpperCase().replace(/_/g, ' '));
  const userRoles = (this.roles || []).map((r) => String(r).trim().toUpperCase().replace(/_/g, ' '));
  return userRoles.some((role) => normalizedRequired.includes(role));
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Filter out deleted users by default
userSchema.pre(/^find/, function(next) {
  // Check MongoDB connection status
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected during user query');
    return next(new Error('Database connection lost'));
  }
  
  if (this.getQuery().isDeleted !== true) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
