const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // Company association
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  key: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['GENERAL', 'SECURITY', 'UI', 'UPLOAD', 'NOTIFICATIONS', 'INTEGRATIONS', 'CUSTOM'],
    default: 'GENERAL'
  },
  dataType: {
    type: String,
    enum: ['STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY', 'DATE'],
    default: 'STRING'
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  validation: {
    required: Boolean,
    min: Number,
    max: Number,
    pattern: String,
    enum: [mongoose.Schema.Types.Mixed]
  },
  metadata: {
    group: String,
    order: Number,
    helpText: String,
    examples: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'Setting'
});

// Indexes
settingSchema.index({ companyId: 1, key: 1 }, { unique: true }); // Unique key per company
settingSchema.index({ companyId: 1, category: 1 });
settingSchema.index({ companyId: 1, isActive: 1 });

// Static method to get setting value
settingSchema.statics.getValue = async function(companyId, key, defaultValue = null) {
  try {
    const setting = await this.findOne({ companyId, key, isActive: true });
    return setting ? setting.value : defaultValue;
  } catch (error) {
    console.error(`Error getting setting value for key: ${key}`, error);
    return defaultValue;
  }
};

// Static method to set setting value
settingSchema.statics.setValue = async function(companyId, key, value, description = null) {
  try {
    const setting = await this.findOneAndUpdate(
      { companyId, key },
      { 
        value, 
        description: description || undefined,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
    return setting;
  } catch (error) {
    console.error(`Error setting value for key: ${key}`, error);
    throw error;
  }
};

// Static method to get settings by category
settingSchema.statics.getByCategory = async function(companyId, category) {
  try {
    return await this.find({ companyId, category, isActive: true }).sort('metadata.order');
  } catch (error) {
    console.error(`Error getting settings for category: ${category}`, error);
    return [];
  }
};

// Static method to get all active settings
settingSchema.statics.getAllActive = async function(companyId) {
  try {
    return await this.find({ companyId, isActive: true }).sort('metadata.order');
  } catch (error) {
    console.error('Error getting all active settings', error);
    return [];
  }
};

// Instance method to validate value
settingSchema.methods.validateValue = function(value) {
  if (this.validation.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: 'Value is required' };
  }

  if (this.dataType === 'NUMBER') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { isValid: false, error: 'Value must be a number' };
    }
    if (this.validation.min !== undefined && numValue < this.validation.min) {
      return { isValid: false, error: `Value must be at least ${this.validation.min}` };
    }
    if (this.validation.max !== undefined && numValue > this.validation.max) {
      return { isValid: false, error: `Value must be at most ${this.validation.max}` };
    }
  }

  if (this.dataType === 'BOOLEAN') {
    if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
      return { isValid: false, error: 'Value must be a boolean' };
    }
  }

  if (this.validation.enum && !this.validation.enum.includes(value)) {
    return { isValid: false, error: `Value must be one of: ${this.validation.enum.join(', ')}` };
  }

  return { isValid: true };
};

module.exports = mongoose.model('Setting', settingSchema);
