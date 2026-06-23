const mongoose = require('mongoose');

const crmAccountSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    salesforceId: { type: String, trim: true, index: true },
    accountNumber: { type: String, trim: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    division: { type: String, trim: true },
    relationshipStatus: {
      type: String,
      enum: ['Strategic', 'Active', 'Developing', 'Prospect', 'Inactive'],
      default: 'Prospect'
    },
    billingAddress: { type: String, trim: true },
    shippingAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'US' },
    contacts: [
      {
        name: String,
        email: String,
        phone: String,
        title: String
      }
    ],
    annualRevenue: { type: Number, default: 0 },
    previousContracts: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ['salesforce_api', 'seed', 'manual'],
      default: 'seed'
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'CrmAccount' }
);

crmAccountSchema.index({ companyId: 1, name: 1 });
crmAccountSchema.index({ companyId: 1, 'contacts.email': 1 });

module.exports = mongoose.model('CrmAccount', crmAccountSchema);
