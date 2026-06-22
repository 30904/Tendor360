const crypto = require('crypto');
const axios = require('axios');
const WebhookSubscription = require('../models/WebhookSubscription');
const WebhookDelivery = require('../models/WebhookDelivery');
const { isSupportedWebhookEvent } = require('../constants/webhookEvents');

const DELIVERY_TIMEOUT_MS = 15000;

function isValidWebhookUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function subscriptionMatchesEvent(subscription, event) {
  const events = subscription.events || [];
  return events.includes('*') || events.includes(event);
}

function buildSignature(secret, body) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

function summarizePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const parts = [];
  if (payload.tenderId) parts.push(`tenderId=${payload.tenderId}`);
  if (payload.watchlistId) parts.push(`watchlistId=${payload.watchlistId}`);
  if (payload.jobId) parts.push(`jobId=${payload.jobId}`);
  if (payload.reference) parts.push(`reference=${payload.reference}`);
  if (payload.title) parts.push(`title=${String(payload.title).slice(0, 80)}`);
  return parts.join('; ');
}

class WebhookDeliveryService {
  async listSubscriptions(companyId) {
    return WebhookSubscription.find({ companyId, isDeleted: false })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async deliverToSubscription(subscription, event, payload) {
    const body = JSON.stringify({
      id: crypto.randomUUID(),
      event,
      createdAt: new Date().toISOString(),
      companyId: String(subscription.companyId),
      data: payload
    });

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Tender360-Webhook/1.0',
      'X-Tender360-Event': event
    };

    if (subscription.secret) {
      headers['X-Tender360-Signature'] = buildSignature(subscription.secret, body);
    }

    const startedAt = Date.now();
    let status = 'failed';
    let statusCode;
    let errorMessage;

    try {
      const response = await axios.post(subscription.targetUrl, body, {
        headers,
        timeout: DELIVERY_TIMEOUT_MS,
        validateStatus: () => true
      });

      statusCode = response.status;
      if (response.status >= 200 && response.status < 300) {
        status = 'success';
      } else {
        errorMessage = `Webhook endpoint returned HTTP ${response.status}`;
      }
    } catch (error) {
      errorMessage = error.message;
    }

    const durationMs = Date.now() - startedAt;

    await WebhookDelivery.create({
      companyId: subscription.companyId,
      subscriptionId: subscription._id,
      event,
      targetUrl: subscription.targetUrl,
      status,
      statusCode,
      errorMessage,
      durationMs,
      payloadSummary: summarizePayload(payload)
    });

    await WebhookSubscription.updateOne(
      { _id: subscription._id },
      {
        $set: {
          lastDeliveredAt: new Date(),
          lastDeliveryStatus: status,
          lastError: status === 'failed' ? errorMessage : null
        },
        ...(status === 'success' ? { $inc: { deliveryCount: 1 } } : { $inc: { failureCount: 1 } })
      }
    );

    if (status === 'failed') {
      throw new Error(errorMessage || 'Webhook delivery failed');
    }

    return { status, statusCode, durationMs };
  }

  async emit(companyId, event, payload = {}) {
    if (!isSupportedWebhookEvent(event)) {
      throw new Error(`Unsupported webhook event: ${event}`);
    }

    const subscriptions = await WebhookSubscription.find({
      companyId,
      status: 'active',
      isDeleted: false
    }).lean();

    const matching = subscriptions.filter((subscription) =>
      subscriptionMatchesEvent(subscription, event)
    );

    if (!matching.length) {
      return { delivered: 0, failed: 0, skipped: true };
    }

    const results = await Promise.allSettled(
      matching.map((subscription) => this.deliverToSubscription(subscription, event, payload))
    );

    return {
      delivered: results.filter((result) => result.status === 'fulfilled').length,
      failed: results.filter((result) => result.status === 'rejected').length,
      skipped: false
    };
  }

  emitAsync(companyId, event, payload = {}) {
    this.emit(companyId, event, payload).catch((error) => {
      console.error(`Webhook emit failed for ${event}:`, error.message);
    });
  }

  async sendTestDelivery(subscription) {
    return this.deliverToSubscription(subscription, 'webhook.test', {
      message: 'Tender360 webhook test delivery',
      subscriptionId: String(subscription._id),
      subscriptionName: subscription.name
    });
  }
}

module.exports = {
  WebhookDeliveryService,
  webhookDeliveryService: new WebhookDeliveryService(),
  isValidWebhookUrl,
  maskWebhookSecret(subscription) {
    const doc = subscription?.toObject ? subscription.toObject() : { ...subscription };
    if (doc?.secret) {
      doc.secret = '********';
    }
    return doc;
  }
};
