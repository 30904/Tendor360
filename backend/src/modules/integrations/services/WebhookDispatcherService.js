const axios = require('axios');
const crypto = require('crypto');
const WebhookSubscription = require('../models/WebhookSubscription');

class WebhookDispatcherService {
  /**
   * Dispatch an event to all subscribed webhooks.
   * Asynchronous and non-blocking.
   * 
   * @param {string} companyId - The tenant company ID
   * @param {string} eventName - E.g. 'tender.created', 'tender.updated', 'document.uploaded', 'document.processed'
   * @param {object} payload - The event data
   */
  async triggerEvent(companyId, eventName, payload) {
    // Run asynchronously in a safe wrapper to avoid blocking main thread
    setImmediate(async () => {
      try {
        const subscriptions = await WebhookSubscription.find({
          companyId,
          status: 'active',
          isDeleted: false,
          events: { $in: [eventName, '*'] }
        });

        if (!subscriptions.length) {
          return;
        }

        console.log(`[Webhooks] Dispatching event "${eventName}" to ${subscriptions.length} subscription(s).`);

        const requestBody = {
          event: eventName,
          timestamp: new Date().toISOString(),
          companyId,
          data: payload
        };

        const jsonPayload = JSON.stringify(requestBody);

        for (const sub of subscriptions) {
          const headers = {
            'Content-Type': 'application/json',
            'X-Tender360-Event': eventName
          };

          // If a secret is configured, generate HMAC signature to authenticate the payload
          if (sub.secret) {
            const hmac = crypto.createHmac('sha256', sub.secret);
            hmac.update(jsonPayload);
            headers['X-Tender360-Signature'] = hmac.digest('hex');
          }

          axios.post(sub.targetUrl, jsonPayload, {
            headers,
            timeout: 10000 // 10 second timeout for webhook targets
          })
          .then((res) => {
            console.log(`[Webhooks] Successfully dispatched event "${eventName}" to ${sub.targetUrl} (Status: ${res.status})`);
          })
          .catch((err) => {
            console.error(`[Webhooks-Error] Failed to deliver event "${eventName}" to ${sub.targetUrl}: ${err.message}`);
          });
        }
      } catch (err) {
        console.error(`[Webhooks-Error] Failed to run triggerEvent for ${eventName}:`, err.message);
      }
    });
  }
}

module.exports = new WebhookDispatcherService();
