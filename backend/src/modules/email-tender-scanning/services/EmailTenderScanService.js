const EmailTenderMailbox = require('../models/EmailTenderMailbox');
const EmailTenderMessage = require('../models/EmailTenderMessage');
const Tender = require('../../../models/Tender');
const { extractLinks, buildLinkSections } = require('../utils/extractLinks');
const keywordScanner = require('./EmailKeywordScanner');
const graphMail = require('./MicrosoftGraphMailService');
const imapMail = require('./ImapMailService');
const { recordFailureWithNotification } = require('./FailureNotificationService');
const AutomationFailure = require('../../automation/models/AutomationFailure');
const documentAI = require('../../../ai/services/documentAI');
const { fetchLinkContent } = require('../utils/fetchLinkContent');

function slugId(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .slice(0, 48)
    .toUpperCase();
}

class EmailTenderScanService {
  async getRtmSummary(companyId) {
    const [mailboxes, messages] = await Promise.all([
      EmailTenderMailbox.countDocuments({ companyId, isDeleted: false, status: 'active' }),
      EmailTenderMessage.aggregate([
        { $match: { companyId, isDeleted: false } },
        {
          $group: {
            _id: '$decision',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const byDecision = Object.fromEntries(messages.map((m) => [m._id, m.count]));
    const scanned = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      processedAt: { $exists: true }
    });
    const withBodyHits = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      'scan.bodyKeywordHits.0': { $exists: true }
    });
    const withAttachmentHits = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      'scan.attachmentKeywordHits.0': { $exists: true }
    });
    const multiLink = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      'linkSections.1': { $exists: true }
    });
    const rejected = byDecision.rejected || 0;
    const forwarded = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      'actions.type': 'forwarded_to_sales'
    });
    const noLinkMatched = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      'scan.scanMode': 'keywords_only',
      decision: 'matched'
    });
    const imageOos = await EmailTenderMessage.countDocuments({
      companyId,
      isDeleted: false,
      decision: 'image_oos'
    });
    const authFailures = await EmailTenderMailbox.countDocuments({
      companyId,
      isDeleted: false,
      'authRetry.status': 'failed'
    });
    const failureArtifacts = await AutomationFailure.countDocuments({
      companyId,
      requirementId: { $in: ['ATS-009', 'ATS-010'] },
      resolvedAt: null
    });
    const notifiedFailures = await AutomationFailure.countDocuments({
      companyId,
      requirementId: { $in: ['ATS-009', 'ATS-010'] },
      notificationSentAt: { $exists: true }
    });

    return {
      graphConfigured: graphMail.isGraphConfigured(),
      mailboxes,
      scanned,
      counts: {
        matched: byDecision.matched || 0,
        rejected,
        forwarded,
        withBodyHits,
        withAttachmentHits,
        multiLink,
        noLinkMatched,
        imageOos,
        authFailures,
        failureArtifacts,
        notifiedFailures
      }
    };
  }

  async getFailureFeed(companyId, limit = 20) {
    return AutomationFailure.find({
      companyId,
      requirementId: { $in: ['ATS-009', 'ATS-010'] }
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async processMessageDoc(message, keywords, mailbox) {
    const body = message.bodyText || message.bodyPreview || '';
    const links = extractLinks(body);
    
    // Fetch attachments via Graph or IMAP if live
    if (message.hasAttachments) {
      let attachments = [];
      if (mailbox.provider === 'imap') {
        attachments = await imapMail.fetchMessageAttachments(mailbox, message.graphMessageId, message.companyId);
      } else if (graphMail.isGraphConfigured()) {
        attachments = await graphMail.fetchMessageAttachments(mailbox, message.graphMessageId, message.companyId);
      }
      
      message.attachments = attachments.map((ga) => ({
        name: ga.name,
        contentType: ga.contentType,
        size: ga.size,
        isImage: ga.isImage,
        contentBytes: ga.contentBytes
      }));
    }

    // Build aggregated content for LLM
    let aggregatedContent = `Subject: ${message.subject || ''}\nFrom: ${message.from || ''}\n\nBody:\n${body}\n\n`;

    const MAX_LINKS = parseInt(process.env.MAX_EMAIL_LINKS) || 3;
    const linksToProcess = links.slice(0, MAX_LINKS);
    
    if (linksToProcess.length > 0) {
      aggregatedContent += `--- Link Contents ---\n`;
      for (const link of linksToProcess) {
        const linkText = await fetchLinkContent(link);
        aggregatedContent += `URL: ${link}\n${linkText.substring(0, 2000)}\n\n`;
      }
    }

    if ((message.attachments || []).length > 0) {
      aggregatedContent += `--- Attachment Contents ---\n`;
      for (const att of message.attachments) {
        if (att.isImage) {
          aggregatedContent += `Attachment: ${att.name} (Image skipped)\n`;
          continue;
        }
        
        let attText = att.textContent || '';
        if (!attText && att.contentBytes) {
          try {
            const buffer = Buffer.from(att.contentBytes, 'base64');
            const ext = (att.name || '').split('.').pop() || 'txt';
            attText = await documentAI.extractTextFromBuffer(buffer, ext);
            att.textContent = attText;
          } catch (e) {
            attText = `[Failed to extract text: ${e.message}]`;
          }
        }
        aggregatedContent += `Attachment: ${att.name}\n${attText.substring(0, 2000)}\n\n`;
      }
    }

    if (aggregatedContent.length > 30000) {
      aggregatedContent = aggregatedContent.substring(0, 30000) + '\n...[Truncated]';
    }

    let aiResult;
    try {
      aiResult = await documentAI.evaluateEmailTender(aggregatedContent, keywords);
    } catch (error) {
      console.error('LLM Evaluation failed for email:', error.message);
      message.decision = 'pending';
      message.actions.push({
        type: 'graph_retry',
        at: new Date(),
        detail: `LLM evaluation failed, left as pending. Error: ${error.message}`
      });
      await message.save();
      throw new Error(`LLM evaluation failed: ${error.message}`);
    }

    message.scan = {
      bodyKeywordHits: aiResult.matchedKeywords || [],
      attachmentKeywordHits: [],
      matchedKeywords: aiResult.matchedKeywords || [],
      scanMode: links.length ? 'links_and_keywords' : 'keywords_only'
    };
    
    message.hasLinks = links.length > 0;
    message.links = links;
    message.linkSections = links.map((url, idx) => ({
      url,
      label: `Link ${idx + 1}`,
      retained: aiResult.isTender && idx < MAX_LINKS,
      rejectReason: (aiResult.isTender && idx < MAX_LINKS) ? null : 'Rejected by AI or Exceeds limit',
      keywordHits: aiResult.matchedKeywords || []
    }));

    message.decision = aiResult.isTender ? 'matched' : 'rejected';

    try {
      if (message.decision === 'rejected') {
        const move = mailbox.provider === 'imap'
          ? await imapMail.moveMessageToFolder(mailbox, message.graphMessageId, mailbox.folderRejected, message.companyId)
          : await graphMail.moveMessageToFolder(mailbox, message.graphMessageId, mailbox.folderRejected, message.companyId);

        message.actions.push({
          type: 'moved_to_rejected',
          at: new Date(),
          detail: (move.simulated ? 'Simulated move (demo/ATS-005)' : `Moved via ${mailbox.provider === 'imap' ? 'IMAP' : 'Microsoft Graph'}`) + ` | AI Reason: ${aiResult.reason || 'Not a tender'}`,
          target: mailbox.folderRejected
        });
      } else {
        const forward = await graphMail.forwardMessage(mailbox, message, mailbox.forwardTo);
        message.actions.push({
          type: 'forwarded_to_sales',
          at: new Date(),
          detail: (forward.simulated ? forward.note || 'Forward logged (ATS-006)' : 'SMTP forward sent') + ` | AI Reason: ${aiResult.reason || 'Identified as tender'}`,
          target: (forward.to || []).join(', ')
        });
        
        if (mailbox.provider === 'imap') {
          await imapMail.moveMessageToFolder(mailbox, message.graphMessageId, mailbox.folderProcessed, message.companyId);
        } else {
          await graphMail.moveMessageToFolder(mailbox, message.graphMessageId, mailbox.folderProcessed, message.companyId);
        }
      }
    } catch (actionError) {
      console.error('Failed to move or forward message:', actionError.message);
      message.actions.push({
        type: 'graph_retry',
        at: new Date(),
        detail: `Failed to move/forward: ${actionError.message}`
      });
    }

    message.processedAt = new Date();
    await message.save();
    return message;
  }

  async scanMailbox(companyId, mailboxId) {
    const mailbox = await EmailTenderMailbox.findOne({
      _id: mailboxId,
      companyId,
      isDeleted: false
    });
    if (!mailbox) throw new Error('Mailbox not found');

    const keywords = await keywordScanner.loadKeywordsForCompany(companyId);
    let ingested = 0;

    try {
      if (mailbox.provider === 'imap') {
        const remote = await imapMail.fetchInboxMessages(mailbox, companyId);
        for (const item of remote) {
          const existing = await EmailTenderMessage.findOne({
            companyId,
            graphMessageId: item.graphMessageId
          });
          if (existing) continue;
          const doc = await EmailTenderMessage.create({
            companyId,
            mailboxId: mailbox._id,
            ...item,
            attachments: [],
            actions: [],
            decision: 'pending'
          });
          await this.processMessageDoc(doc, keywords, mailbox);
          ingested += 1;
        }
      } else if (graphMail.isGraphConfigured()) {
        const remote = await graphMail.fetchInboxMessages(mailbox, companyId);
        for (const item of remote) {
          const existing = await EmailTenderMessage.findOne({
            companyId,
            graphMessageId: item.graphMessageId
          });
          if (existing) continue;
          const doc = await EmailTenderMessage.create({
            companyId,
            mailboxId: mailbox._id,
            ...item,
            attachments: [],
            actions: [],
            decision: 'pending'
          });
          await this.processMessageDoc(doc, keywords, mailbox);
          ingested += 1;
        }
      } else {
      const pending = await EmailTenderMessage.find({
        companyId,
        mailboxId: mailbox._id,
        decision: 'pending',
        isDeleted: false
      });
      for (const doc of pending) {
        await this.processMessageDoc(doc, keywords, mailbox);
        ingested += 1;
      }
    }

    mailbox.lastScanAt = new Date();
    await mailbox.save();
    return { mailbox, ingested, keywords: keywords.length };
    } catch (error) {
      if (!graphMail.isGraphConfigured()) {
        await recordFailureWithNotification({
          companyId,
          requirementId: 'ATS-010',
          source: 'email_scan',
          error,
          mailbox,
          context: { title: 'Email scan failed', mailbox: mailbox.email }
        });
      }
      throw error;
    }
  }

  async simulateFailureDemo(companyId) {
    const mailbox = await EmailTenderMailbox.findOne({ companyId, isDeleted: false });
    const demoError = new Error(
      'Demo: Simulated Outlook Graph timeout after 3 login attempts (ATS-009 / ATS-010).'
    );
    if (mailbox) {
      mailbox.authRetry = {
        attempts: 3,
        maxAttempts: 3,
        lastError: demoError.message,
        lastAttemptAt: new Date(),
        status: 'failed'
      };
      await mailbox.save();
    }
    return recordFailureWithNotification({
      companyId,
      requirementId: 'ATS-010',
      source: 'demo',
      error: demoError,
      mailbox,
      context: {
        title: 'Demo failure notification',
        mailbox: mailbox?.email,
        attempts: 3,
        maxAttempts: 3,
        simulated: true
      }
    });
  }

  async scanAllMailboxes(companyId) {
    const mailboxes = await EmailTenderMailbox.find({ companyId, status: 'active', isDeleted: false });
    const results = [];
    for (const mb of mailboxes) {
      results.push(await this.scanMailbox(companyId, mb._id));
    }
    return results;
  }

  messageToOpportunity(message, linkSection = null) {
    const link = linkSection?.url || message.links?.[0] || '';
    const externalId = `EMAIL-${slugId(message.graphMessageId || message._id)}-${slugId(link || message.subject)}`;
    return {
      externalId,
      reference: externalId,
      title: message.subject || 'Email tender opportunity',
      organization: message.from || 'Email sender',
      description: (message.bodyPreview || message.bodyText || '').slice(0, 4000),
      location: 'Email',
      sourceUrl: link,
      publishedDate: message.receivedAt,
      metadata: {
        emailMessageId: message._id,
        scanMode: message.scan?.scanMode,
        matchedKeywords: message.scan?.matchedKeywords,
        from: message.from
      },
      attachments: (message.attachments || [])
        .filter((a) => !a.isImage && a.textContent)
        .map((a) => ({
          name: a.name,
          url: `email://${a.name}`,
          contentType: a.contentType
        }))
    };
  }

  async runDiscoveryScan(companyId, config = {}) {
    const logs = [];
    await this.scanAllMailboxes(companyId);

    const matched = await EmailTenderMessage.find({
      companyId,
      isDeleted: false,
      decision: { $in: ['matched', 'partial'] },
      importedTenderId: { $exists: false }
    }).limit(50);

    const opportunities = [];
    for (const msg of matched) {
      const sections = (msg.linkSections || []).filter((s) => s.retained);
      if (sections.length) {
        sections.forEach((section) => {
          opportunities.push(this.messageToOpportunity(msg, section));
        });
      } else {
        opportunities.push(this.messageToOpportunity(msg));
      }
    }

    logs.push({
      level: 'info',
      message: `ATS-001–007: processed email scan; ${opportunities.length} opportunity(ies) from ${matched.length} matched message(s). Graph: ${graphMail.isGraphConfigured() ? 'live' : 'demo cache'}.`
    });

    return { opportunities, nextCursor: null, logs };
  }

  async getMessagesFeed(companyId, { limit = 30, decision } = {}) {
    const filter = { companyId, isDeleted: false };
    if (decision) filter.decision = decision;
    return EmailTenderMessage.find(filter)
      .sort({ receivedAt: -1 })
      .limit(limit)
      .populate('mailboxId', 'email region displayName')
      .lean();
  }

  async listMailboxes(companyId) {
    return EmailTenderMailbox.find({ companyId, isDeleted: false }).sort({ region: 1 }).lean();
  }
}

module.exports = new EmailTenderScanService();
