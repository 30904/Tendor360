const WEBHOOK_EVENTS = [
  'tender.discovered',
  'tender.updated',
  'watchlist.match',
  'discovery.completed'
];

function isSupportedWebhookEvent(event) {
  return WEBHOOK_EVENTS.includes(event);
}

module.exports = {
  WEBHOOK_EVENTS,
  isSupportedWebhookEvent
};
