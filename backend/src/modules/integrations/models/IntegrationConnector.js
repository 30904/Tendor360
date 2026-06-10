const mongoose = require('mongoose');

const integrationConnectorSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    key: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['discovery', 'crm', 'bi', 'eprocurement', 'webhook', 'ai'],
      default: 'discovery'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'error'],
      default: 'inactive',
      index: true
    },
    health: {
      type: String,
      enum: ['healthy', 'degraded', 'down', 'unknown'],
      default: 'unknown'
    },
    config: mongoose.Schema.Types.Mixed,
    lastCheckedAt: Date,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'IntegrationConnector' }
);

integrationConnectorSchema.index({ companyId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('IntegrationConnector', integrationConnectorSchema);
