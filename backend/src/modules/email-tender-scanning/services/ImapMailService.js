const imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const { recordFailureWithNotification } = require('./FailureNotificationService');

function isImapConfigured(mailbox) {
  return Boolean(
    mailbox?.provider === 'imap' &&
      mailbox?.imapConfig?.host &&
      mailbox?.imapConfig?.user &&
      mailbox?.imapConfig?.password
  );
}

async function connect(mailbox) {
  const config = {
    imap: {
      user: mailbox.imapConfig.user,
      password: mailbox.imapConfig.password,
      host: mailbox.imapConfig.host,
      port: mailbox.imapConfig.port || 993,
      tls: mailbox.imapConfig.tls !== false,
      authTimeout: 10000,
      tlsOptions: { rejectUnauthorized: false }
    }
  };
  return await imaps.connect(config);
}

async function fetchInboxMessages(mailbox, companyId) {
  if (!isImapConfigured(mailbox)) return [];

  let connection;
  try {
    connection = await connect(mailbox);
    await connection.openBox(mailbox.folderInbox || 'INBOX');

    // Fetch unseen messages
    const searchCriteria = ['UNSEEN'];
    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      struct: true,
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    const results = [];

    for (let item of messages) {
      const headerPart = item.parts.find((part) => part.which === 'HEADER');
      const textPart = item.parts.find((part) => part.which === 'TEXT');
      
      let parsedHeader = { subject: '', from: { value: [] }, date: new Date() };
      let parsedText = { text: '', html: '', attachments: [] };

      if (headerPart && headerPart.body) {
        parsedHeader = await simpleParser(headerPart.body);
      }
      
      // If we just fetched TEXT, simpleParser might not get attachments properly, 
      // but we can check the struct to see if attachments exist
      let hasAttachments = false;
      if (item.attributes.struct) {
        const checkStruct = (nodes) => {
          for (const node of nodes) {
            if (Array.isArray(node)) {
              checkStruct(node);
            } else if (node.disposition && node.disposition.type && node.disposition.type.toUpperCase() === 'ATTACHMENT') {
              hasAttachments = true;
            }
          }
        };
        checkStruct(item.attributes.struct);
      }

      if (textPart && textPart.body) {
        parsedText = await simpleParser(textPart.body);
      }

      results.push({
        graphMessageId: String(item.attributes.uid),
        subject: parsedHeader.subject || '(No Subject)',
        from: parsedHeader.from?.value?.[0]?.address || '',
        receivedAt: parsedHeader.date || new Date(),
        bodyPreview: parsedText.text?.substring(0, 200) || '',
        bodyText: parsedText.text || parsedText.html || '',
        hasAttachments: hasAttachments
      });
    }

    return results;
  } catch (error) {
    if (companyId) {
      await recordFailureWithNotification({
        companyId,
        requirementId: 'ATS-010',
        source: 'email_scan_imap',
        error,
        mailbox,
        context: { title: 'IMAP Inbox read failure', mailbox: mailbox.email }
      });
    }
    throw error;
  } finally {
    if (connection) connection.end();
  }
}

async function fetchMessageAttachments(mailbox, uid, companyId) {
  if (!isImapConfigured(mailbox)) return [];

  let connection;
  try {
    connection = await connect(mailbox);
    await connection.openBox(mailbox.folderInbox || 'INBOX');

    const fetchOptions = { bodies: [''], markSeen: false };
    const messages = await connection.search([['UID', uid]], fetchOptions);
    
    if (messages.length === 0) return [];
    
    const all = messages[0].parts.find((part) => part.which === '');
    const parsed = await simpleParser(all.body);

    return (parsed.attachments || []).map((att, idx) => ({
      id: String(idx),
      name: att.filename || `attachment-${idx}`,
      contentType: att.contentType,
      size: att.size,
      isImage: att.contentType ? att.contentType.startsWith('image/') : false,
      contentBytes: att.content ? att.content.toString('base64') : null
    }));
  } catch (error) {
    console.error('Failed to fetch IMAP attachments:', error.message);
    return [];
  } finally {
    if (connection) connection.end();
  }
}

async function moveMessageToFolder(mailbox, uid, folderName, companyId) {
  if (!isImapConfigured(mailbox) || !uid) {
    return { simulated: true, folder: folderName };
  }

  let connection;
  try {
    connection = await connect(mailbox);
    await connection.openBox(mailbox.folderInbox || 'INBOX');
    await connection.moveMessage(uid, folderName);
    return { simulated: false, folder: folderName };
  } catch (error) {
    console.error(`IMAP failed to move message ${uid} to ${folderName}:`, error.message);
    return { simulated: true, folder: folderName, note: 'IMAP move failed; logged only' };
  } finally {
    if (connection) connection.end();
  }
}

module.exports = {
  isImapConfigured,
  fetchInboxMessages,
  fetchMessageAttachments,
  moveMessageToFolder
};
