const axios = require('axios');
const { recordFailureWithNotification } = require('./FailureNotificationService');
const GraphNotConfiguredError = require('../errors/GraphNotConfiguredError');

const MAX_RETRIES = 3;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isGraphConfigured() {
  return Boolean(
    process.env.MS_GRAPH_TENANT_ID &&
      process.env.MS_GRAPH_CLIENT_ID &&
      process.env.MS_GRAPH_CLIENT_SECRET
  );
}

function assertGraphConfigured(context = {}) {
  if (!isGraphConfigured()) {
    throw new GraphNotConfiguredError(undefined, {
      requirementId: 'ATS-009',
      ...context
    });
  }
}

/**
 * ATS-009: Outlook / Microsoft Graph token acquisition with 3 retries and mailbox state tracking.
 */
async function authenticateWithRetry({ companyId, mailbox, onAttempt }) {
  assertGraphConfigured({ mailbox: mailbox?.email });
  const tenant = process.env.MS_GRAPH_TENANT_ID;
  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    client_id: process.env.MS_GRAPH_CLIENT_ID,
    client_secret: process.env.MS_GRAPH_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials'
  });

  let lastError;
  const attemptLog = [];

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      if (mailbox) {
        mailbox.authRetry = mailbox.authRetry || {};
        mailbox.authRetry.attempts = attempt;
        mailbox.authRetry.maxAttempts = MAX_RETRIES;
        mailbox.authRetry.lastAttemptAt = new Date();
        mailbox.authRetry.status = attempt < MAX_RETRIES ? 'retrying' : 'retrying';
      }

      if (onAttempt) await onAttempt(attempt);

      const response = await axios.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 20000,
        validateStatus: () => true
      });

      if (response.status >= 400) {
        throw new Error(
          response.data?.error_description ||
            response.data?.error?.message ||
            `Outlook login failed (${response.status})`
        );
      }

      if (!response.data?.access_token) {
        throw new Error('Outlook login returned no access token');
      }

      if (mailbox) {
        mailbox.authRetry.status = 'ok';
        mailbox.authRetry.lastError = undefined;
        await mailbox.save();
      }

      attemptLog.push({ attempt, status: 'ok' });
      return {
        mode: 'graph',
        token: response.data.access_token,
        attempts: attempt,
        attemptLog
      };
    } catch (error) {
      lastError = error;
      attemptLog.push({ attempt, status: 'failed', message: error.message });

      if (mailbox) {
        mailbox.authRetry.lastError = error.message;
        mailbox.authRetry.status = attempt >= MAX_RETRIES ? 'failed' : 'retrying';
        await mailbox.save();
      }

      if (attempt < MAX_RETRIES) {
        await sleep(600 * attempt);
      }
    }
  }

  const finalError = new Error(
    `ATS-009: Outlook login failed after ${MAX_RETRIES} retries: ${lastError?.message || 'unknown'}`
  );
  finalError.attempts = MAX_RETRIES;
  finalError.attemptLog = attemptLog;

  if (companyId) {
    await recordFailureWithNotification({
      companyId,
      requirementId: 'ATS-009',
      source: 'outlook_graph',
      error: finalError,
      mailbox,
      jobType: 'outlook_auth',
      context: {
        title: 'Outlook login failure (ATS-009)',
        mailbox: mailbox?.email,
        attempts: MAX_RETRIES,
        maxAttempts: MAX_RETRIES,
        attemptLog,
        retryable: true
      }
    });
  }

  throw finalError;
}

module.exports = {
  MAX_RETRIES,
  isGraphConfigured,
  assertGraphConfigured,
  authenticateWithRetry
};
