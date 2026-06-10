const mongoose = require('mongoose');

const apiCredentialSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    connectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IntegrationConnector',
      index: true
    },
    name: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    secretRef: { type: String, trim: true },
    metadata: mongoose.Schema.Types.Mixed,
    expiresAt: Date,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'ApiCredential' }
);

module.exports = mongoose.model('ApiCredential', apiCredentialSchema);
