const mongoose = require('mongoose');

const webhookDeliverySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WebhookSubscription',
      required: true,
      index: true
    },
    event: { type: String, required: true, trim: true },
    targetUrl: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true
    },
    statusCode: { type: Number },
    errorMessage: { type: String, trim: true },
    durationMs: { type: Number, min: 0 },
    payloadSummary: { type: String, trim: true }
  },
  { timestamps: true, collection: 'WebhookDelivery' }
);

webhookDeliverySchema.index({ companyId: 1, createdAt: -1 });

module.exports = mongoose.model('WebhookDelivery', webhookDeliverySchema);
