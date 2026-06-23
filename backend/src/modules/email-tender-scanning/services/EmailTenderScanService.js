const EmailTenderMailbox = require('../models/EmailTenderMailbox');
const EmailTenderMessage = require('../models/EmailTenderMessage');
const Tender = require('../../../models/Tender');
const { extractLinks, buildLinkSections } = require('../utils/extractLinks');
const keywordScanner = require('./EmailKeywordScanner');
const graphMail = require('./MicrosoftGraphMailService');
const imapMail = require('./ImapMailService');
const { recordFailureWithNotification } = require('./FailureNotificationService');
const AutomationFailure = require('../../automation/models/AutomationFailure');
const GraphNotConfiguredError = require('../errors/GraphNotConfiguredError');

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
    const bodyScan = keywordScanner.scanText(body, keywords);
    const attScan = keywordScanner.scanAttachments(message.attachments || [], keywords);
    const links = extractLinks(body);
    const hasImageOnly =
      (message.attachments || []).length > 0 &&
      (message.attachments || []).every((a) => a.isImage) &&
      !bodyScan.matched;

    if (hasImageOnly) {
      message.scan = {
        bodyKeywordHits: [],
        attachmentKeywordHits: [],
        matchedKeywords: [],
        scanMode: 'image_excluded_oos'
      };
      message.decision = 'image_oos';
      message.hasLinks = false;
      message.links = [];
      message.linkSections = [];
      message.actions.push({
        type: 'skipped_image_oos',
        at: new Date(),
        detail: 'ATS-008: image-based tenders excluded per customer RTM'
      });
      message.processedAt = new Date();
      await message.save();
      return message;
    }

    const allHits = [...new Set([...bodyScan.hits, ...attScan.hits])];
    message.scan = {
      bodyKeywordHits: bodyScan.hits,
      attachmentKeywordHits: attScan.hits,
      matchedKeywords: allHits,
      scanMode: links.length ? 'links_and_keywords' : 'keywords_only'
    };
    message.hasLinks = links.length > 0;
    message.links = links;
    message.linkSections = links.length ? buildLinkSections(links, allHits, bodyScan.matched) : [];

    const retainedLinks = message.linkSections.filter((s) => s.retained);
    const keywordMatch = bodyScan.matched || attScan.matched;
    const linkMatch = retainedLinks.length > 0;

    if (!links.length && keywordMatch) {
      message.decision = 'matched';
    } else if (links.length && linkMatch) {
      message.decision = retainedLinks.length < links.length ? 'partial' : 'matched';
    } else if (keywordMatch) {
      message.decision = 'matched';
    } else {
      message.decision = 'rejected';
    }

    if (message.decision === 'rejected') {
      const move = await graphMail.moveMessageToFolder(
        mailbox,
        message.graphMessageId,
        mailbox.folderRejected,
        message.companyId
      );
      message.actions.push({
        type: 'moved_to_rejected',
        at: new Date(),
        detail: move.simulated ? 'Simulated move (demo/ATS-005)' : 'Moved via Microsoft Graph',
        target: mailbox.folderRejected
      });
    } else if (message.decision === 'matched' || message.decision === 'partial') {
      const forward = await graphMail.forwardMessage(mailbox, message, mailbox.forwardTo);
      message.actions.push({
        type: 'forwarded_to_sales',
        at: new Date(),
        detail: forward.simulated ? forward.note || 'Forward logged (ATS-006)' : 'SMTP forward sent',
        target: (forward.to || []).join(', ')
      });
      await graphMail.moveMessageToFolder(
        mailbox,
        message.graphMessageId,
        mailbox.folderProcessed,
        message.companyId
      );
    }

    message.processedAt = new Date();
    try {
      await message.save();
    } catch (saveError) {
      if (saveError.name === 'VersionError') {
        console.warn(`VersionError ignored for message ${message._id} (already processed concurrently)`);
      } else {
        throw saveError;
      }
    }
    return message;
  }

  async scanMailbox(companyId, mailboxId) {
    const mailbox = await EmailTenderMailbox.findOne({
      _id: mailboxId,
      companyId,
      isDeleted: false
    });
    if (!mailbox) throw new Error('Mailbox not found');

    const keywordResult = await keywordScanner.loadKeywordsForCompany(companyId);
    const keywords = keywordResult.keywords;
    let ingested = 0;

    try {
    if (mailbox.provider === 'imap') {
      // --- IMAP path ---
      console.log(`📬 Using IMAP for mailbox: ${mailbox.email}`);
      const remote = await imapMail.fetchImapMessages(mailbox);
      for (const item of remote) {
        // Dedup by our synthetic graphMessageId (imap-uid-<email>-<uid>)
        const existing = await EmailTenderMessage.findOne({
          companyId,
          graphMessageId: item.graphMessageId
        });
        if (existing) {
          console.log(`⏭️  Skipping already-processed message: ${item.subject}`);
          continue;
        }
        console.log(`📩 Processing new email: "${item.subject}"`);
        const doc = await EmailTenderMessage.create({
          companyId,
          mailboxId: mailbox._id,
          ...item,
          actions: [],
          decision: 'pending'
        });
        await this.processMessageDoc(doc, keywords, mailbox);
        ingested += 1;
      }
    } else if (mailbox.provider === 'graph') {
      if (!graphMail.isGraphConfigured()) {
        throw new GraphNotConfiguredError(
          `Mailbox ${mailbox.email} is configured for Microsoft Graph but MS_GRAPH_* environment variables are not set.`,
          { mailbox: mailbox.email, provider: mailbox.provider }
        );
      }
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
    } else if (mailbox.provider === 'demo') {
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
    } else {
      throw new Error(`Unsupported mailbox provider: ${mailbox.provider}`);
    }

    mailbox.lastScanAt = new Date();
    await mailbox.save();
    return {
      mailbox,
      ingested,
      keywords: keywords.length,
      excelKeywordCount: keywordResult.excelKeywordCount || 0,
      excelSources: keywordResult.excelSources || []
    };
    } catch (error) {
      if (mailbox.provider !== 'demo' || error.name === 'GraphNotConfiguredError') {
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
      message: `ATS-001–007: processed email scan; ${opportunities.length} opportunity(ies) from ${matched.length} matched message(s). Graph: ${graphMail.isGraphConfigured() ? 'live' : 'not configured'}.`
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
