const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

/**
 * Fetches UNSEEN emails from a mailbox over IMAP.
 * Returns structured message objects ready for the scanning pipeline.
 *
 * @param {object} mailbox - EmailTenderMailbox document
 * @returns {Array} - Array of parsed message objects
 */
async function fetchImapMessages(mailbox) {
  const cfg = mailbox.imapConfig || {};

  const imapConfig = {
    imap: {
      user: cfg.user || process.env.EMAIL_USER,
      password: cfg.password || process.env.EMAIL_APP_PASSWORD,
      host: cfg.host || process.env.EMAIL_HOST || 'imap.gmail.com',
      port: cfg.port || Number(process.env.EMAIL_PORT || 993),
      tls: cfg.tls !== false,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
      connTimeout: 15000
    }
  };

  console.log(`📬 Connecting to IMAP: ${imapConfig.imap.host}:${imapConfig.imap.port} as ${imapConfig.imap.user}`);

  let connection;
  try {
    connection = await imaps.connect(imapConfig);
  } catch (err) {
    throw new Error(`IMAP connection failed: ${err.message}`);
  }

  const messages = [];

  try {
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT', ''],
      struct: true,
      markSeen: false  // Don't mark as read until we process successfully
    };

    let results = await connection.search(searchCriteria, fetchOptions);
    
    // Pre-filter: discard Delivery Status Notifications to avoid filling the queue with bounces
    results = results.filter((item) => {
      const headerPart = item.parts.find(p => p.which === 'HEADER');
      if (!headerPart) return true;
      const subj = headerPart.body?.subject?.[0] || '';
      return !subj.toLowerCase().includes('delivery status notification');
    });

    console.log(`📬 Found ${results.length} unread valid email(s)`);

    // Limit to top 20 most recent
    if (results.length > 20) {
      console.log(`⚠️ Limiting scan to the 20 most recent emails (out of ${results.length})`);
      results = results.slice(-20);
    }

    for (const item of results) {
      try {
        const allPart = item.parts.find((p) => p.which === '');
        if (!allPart) continue;

        const raw = allPart.body;
        const parsed = await simpleParser(raw);

        const subject = parsed.subject || '(No Subject)';
        const from = parsed.from?.text || '';
        const bodyText = parsed.text || '';
        const bodyHtml = parsed.html || '';
        const uid = item.attributes?.uid;

        // Extract plain text attachments
        const attachments = (parsed.attachments || []).map((att) => ({
          filename: att.filename || 'attachment',
          contentType: att.contentType || 'application/octet-stream',
          size: att.size || 0,
          isImage: (att.contentType || '').startsWith('image/'),
          textContent: att.contentType === 'text/plain'
            ? att.content?.toString('utf8') || ''
            : ''
        }));

        messages.push({
          graphMessageId: `imap-uid-${mailbox.email}-${uid}`,  // Unique dedup key
          subject,
          from,
          bodyText: bodyText.slice(0, 5000),   // Limit body size
          bodyPreview: bodyText.slice(0, 300),
          receivedAt: parsed.date || new Date(),
          hasAttachments: attachments.length > 0,
          attachments,
          imapUid: uid
        });
      } catch (parseErr) {
        console.warn(`⚠️ Failed to parse email: ${parseErr.message}`);
      }
    }
  } finally {
    try { connection.end(); } catch (_) { }
  }

  return messages;
}

module.exports = { fetchImapMessages };
