const path = require('path');
const AutomationJob = require('../../automation/models/AutomationJob');
const AutomationFailure = require('../../automation/models/AutomationFailure');
const AutomationLog = require('../../automation/models/AutomationLog');
const { captureFailureScreenshot } = require('./FailureScreenshotService');

function resolveNotifyRecipients(mailbox, companyId) {
  const fromEnv = (process.env.BOT_FAILURE_NOTIFY_EMAILS || process.env.SMTP_NOTIFY_TO || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const fromMailbox = (mailbox?.notifyOnFailure || []).filter(Boolean);
  return [...new Set([...fromMailbox, ...fromEnv])];
}

async function sendFailureEmail({ recipients, subject, text, attachmentPath }) {
  if (!recipients.length) {
    return { sent: false, reason: 'No notification recipients configured (mailbox.notifyOnFailure or BOT_FAILURE_NOTIFY_EMAILS)' };
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    return { sent: false, reason: 'SMTP not configured', recipients };
  }

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const mail = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: recipients.join(','),
    subject,
    text,
    attachments: attachmentPath
      ? [
          {
            filename: path.basename(attachmentPath),
            path: attachmentPath
          }
        ]
      : []
  };

  await transporter.sendMail(mail);
  return { sent: true, recipients };
}

/**
 * ATS-010: Record failure, capture screenshot artifact, notify BOT admin / support.
 */
async function recordFailureWithNotification({
  companyId,
  requirementId = 'ATS-010',
  source = 'outlook_graph',
  error,
  context = {},
  mailbox = null,
  jobType = 'email_outlook_scan'
}) {
  const err = error instanceof Error ? error : new Error(String(error));
  const recipients = resolveNotifyRecipients(mailbox, companyId);

  const job = await AutomationJob.create({
    companyId,
    jobType,
    status: 'failed',
    payload: context,
    attempts: context.attempts || 3,
    maxAttempts: context.maxAttempts || 3,
    errorMessage: err.message,
    completedAt: new Date()
  });

  const screenshot = await captureFailureScreenshot(companyId, {
    title: `BOT failure — ${requirementId}`,
    errorMessage: err.message,
    context: { ...context, requirementId, source, mailbox: mailbox?.email || context.mailbox }
  });

  const absoluteScreenshot = path.join(__dirname, '../../../../uploads', screenshot.screenshotPath);

  let notification = { sent: false, reason: 'Not attempted' };
  try {
    notification = await sendFailureEmail({
      recipients,
      subject: `[Tender360 ${requirementId}] ${context.title || 'Email tender BOT failure'}`,
      text: [
        `A Tender360 automation step failed.`,
        ``,
        `Requirement: ${requirementId}`,
        `Source: ${source}`,
        `Mailbox: ${mailbox?.email || context.mailbox || '—'}`,
        `Attempts: ${context.attempts ?? '—'} / ${context.maxAttempts ?? 3}`,
        ``,
        `Error: ${err.message}`,
        ``,
        `Screenshot artifact: ${screenshot.screenshotUrl}`,
        `Review in Tender360 → Tender Discovery → Email Tender Scanning.`
      ].join('\n'),
      attachmentPath: absoluteScreenshot
    });
  } catch (notifyErr) {
    notification = { sent: false, reason: notifyErr.message, recipients };
  }

  const failure = await AutomationFailure.create({
    companyId,
    jobId: job._id,
    requirementId,
    source,
    errorMessage: err.message,
    stack: err.stack,
    retryable: context.retryable !== false,
    screenshotPath: screenshot.screenshotPath,
    screenshotUrl: screenshot.screenshotUrl,
    notificationSentAt: notification.sent ? new Date() : undefined,
    notificationRecipients: notification.recipients || recipients,
    context: { ...context, notification }
  });

  await AutomationLog.create({
    companyId,
    jobId: job._id,
    level: 'error',
    message: `${requirementId}: ${err.message}${notification.sent ? ' — notification sent' : ' — notification logged only'}`
  });

  return { job, failure, screenshot, notification };
}

module.exports = {
  recordFailureWithNotification,
  resolveNotifyRecipients,
  sendFailureEmail
};
