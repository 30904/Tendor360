const axios = require('axios');
const outlookAuth = require('./OutlookAuthRetryService');
const { recordFailureWithNotification } = require('./FailureNotificationService');

const MAX_RETRIES = outlookAuth.MAX_RETRIES;

function isGraphConfigured() {
  return outlookAuth.isGraphConfigured();
}

async function withRetry(fn, label = 'graph', context = {}) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }
  const err = new Error(`${label} failed after ${MAX_RETRIES} retries: ${lastError.message}`);
  err.retries = MAX_RETRIES;
  err.context = context;
  throw err;
}

async function graphGet(path, token) {
  const base = 'https://graph.microsoft.com/v1.0';
  const response = await axios.get(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    timeout: 30000,
    validateStatus: (s) => s < 500
  });
  if (response.status >= 400) {
    throw new Error(response.data?.error?.message || `Graph ${response.status}`);
  }
  return response.data;
}

async function fetchInboxMessages(mailbox, companyId) {
  if (!isGraphConfigured()) return [];

  try {
    const auth = await outlookAuth.authenticateWithRetry({ companyId, mailbox });
    const token = auth.token;
    const userId = mailbox.graphUserId || mailbox.email;

    return withRetry(
      async () => {
        const data = await graphGet(
          `/users/${encodeURIComponent(userId)}/mailFolders/inbox/messages?$top=25&$orderby=receivedDateTime desc&$select=id,subject,bodyPreview,body,from,receivedDateTime,hasAttachments`,
          token
        );

        return (data.value || []).map((msg) => ({
          graphMessageId: msg.id,
          subject: msg.subject,
          from: msg.from?.emailAddress?.address,
          receivedAt: msg.receivedDateTime ? new Date(msg.receivedDateTime) : new Date(),
          bodyPreview: msg.bodyPreview,
          bodyText: msg.body?.content || msg.bodyPreview || '',
          hasAttachments: msg.hasAttachments
        }));
      },
      'ATS-001 graph inbox',
      { mailbox: mailbox.email }
    );
  } catch (error) {
    if (companyId && !error.message?.includes('ATS-009')) {
      await recordFailureWithNotification({
        companyId,
        requirementId: 'ATS-010',
        source: 'email_scan',
        error,
        mailbox,
        context: {
          title: 'Inbox read failure',
          mailbox: mailbox.email,
          attempts: error.attempts || MAX_RETRIES
        }
      });
    }
    throw error;
  }
}

async function fetchMessageAttachments(mailbox, graphMessageId, companyId) {
  if (!isGraphConfigured()) return [];

  try {
    const auth = await outlookAuth.authenticateWithRetry({ companyId, mailbox });
    const token = auth.token;
    const userId = mailbox.graphUserId || mailbox.email;

    return withRetry(
      async () => {
        const data = await graphGet(
          `/users/${encodeURIComponent(userId)}/messages/${graphMessageId}/attachments`,
          token
        );

        return (data.value || []).map((att) => ({
          id: att.id,
          name: att.name,
          contentType: att.contentType,
          size: att.size,
          isImage: att.contentType ? att.contentType.startsWith('image/') : false,
          contentBytes: att.contentBytes // base64 encoded content
        }));
      },
      'ATS-003 graph attachments',
      { mailbox: mailbox.email }
    );
  } catch (error) {
    console.error('Failed to fetch message attachments:', error.message);
    return [];
  }
}

async function moveMessageToFolder(mailbox, graphMessageId, folderName, companyId) {
  if (!isGraphConfigured() || !graphMessageId) {
    return { simulated: true, folder: folderName };
  }

  const auth = await outlookAuth.authenticateWithRetry({ companyId, mailbox });
  const token = auth.token;

  return withRetry(async () => {
    const userId = mailbox.graphUserId || mailbox.email;
    const folders = await graphGet(
      `/users/${encodeURIComponent(userId)}/mailFolders?$filter=displayName eq '${folderName.replace(/'/g, "''")}'`,
      token
    );
    const folderId = folders.value?.[0]?.id;
    if (!folderId) {
      return { simulated: true, folder: folderName, note: 'Folder not found; action logged only' };
    }
    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userId)}/messages/${graphMessageId}/move`,
      { destinationId: folderId },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
    );
    return { simulated: false, folder: folderName };
  }, 'ATS-005 move folder');
}

async function forwardMessage(mailbox, message, forwardTo) {
  if (!forwardTo?.length) return { simulated: true, reason: 'No forward recipients configured' };

  const nodemailer = require('nodemailer');
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || mailbox.email,
      to: forwardTo.join(','),
      subject: `[Tender360 ATS-006] ${message.subject}`,
      text: `${message.bodyText || message.bodyPreview}\n\n---\nForwarded from ${mailbox.email}`
    });
    return { simulated: false, to: forwardTo };
  }

  return { simulated: true, to: forwardTo, note: 'SMTP not configured; forward logged' };
}

module.exports = {
  isGraphConfigured,
  MAX_RETRIES,
  fetchInboxMessages,
  fetchMessageAttachments,
  moveMessageToFolder,
  forwardMessage,
  withRetry
};
