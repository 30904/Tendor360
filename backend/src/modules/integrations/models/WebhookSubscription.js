const mongoose = require('mongoose');

const webhookSubscriptionSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true },
    targetUrl: { type: String, required: true, trim: true },
    events: [{ type: String, trim: true }],
    secret: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true, collection: 'WebhookSubscription' }
);

module.exports = mongoose.model('WebhookSubscription', webhookSubscriptionSchema);
