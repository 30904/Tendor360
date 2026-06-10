const { catchAsync } = require('../utils/errorHandler');
const emailTenderScanService = require('../modules/email-tender-scanning/services/EmailTenderScanService');
const { seedEmailTenderDemoForCompany } = require('../seed/data/emailTenderDemoSeed');
const graphMail = require('../modules/email-tender-scanning/services/MicrosoftGraphMailService');
const outlookAuth = require('../modules/email-tender-scanning/services/OutlookAuthRetryService');

exports.getEmailTenderRtm = catchAsync(async (req, res) => {
  const summary = await emailTenderScanService.getRtmSummary(req.companyId);

  const reqStatus = (active) => (active ? 'active' : summary.graphConfigured ? 'ready' : 'ready');

  const requirements = [
    {
      id: 'ATS-001',
      title: 'Read tender emails from Outlook mailbox',
      status: summary.mailboxes > 0 || summary.graphConfigured ? 'active' : 'ready',
      detail: `${summary.mailboxes} mailbox(es) (US + AT). Microsoft Graph: ${summary.graphConfigured ? 'configured' : 'demo inbox mode — set MS_GRAPH_* env for live Outlook.'}`
    },
    {
      id: 'ATS-002',
      title: 'Keyword scanning in email body',
      status: reqStatus(summary.counts.withBodyHits > 0),
      detail: `${summary.counts.withBodyHits} message(s) with body keyword hits from watchlists / email sources.`
    },
    {
      id: 'ATS-003',
      title: 'Keyword scanning in attachments',
      status: reqStatus(summary.counts.withAttachmentHits > 0),
      detail: `${summary.counts.withAttachmentHits} message(s) with PDF/text attachment keyword hits (images excluded per ATS-008).`
    },
    {
      id: 'ATS-004',
      title: 'Process emails with multiple tender links',
      status: reqStatus(summary.counts.multiLink > 0),
      detail: `${summary.counts.multiLink} multi-link email(s); retain/reject per link section.`
    },
    {
      id: 'ATS-005',
      title: 'Move rejected tenders to folder',
      status: reqStatus(summary.counts.rejected > 0),
      detail: `${summary.counts.rejected} rejected → "${'Rejected Tenders'}" (Graph move or simulated in demo).`
    },
    {
      id: 'ATS-006',
      title: 'Forward matched tenders to sales team',
      status: reqStatus(summary.counts.forwarded > 0),
      detail: `${summary.counts.forwarded} forward action(s) to configured sales distribution lists.`
    },
    {
      id: 'ATS-007',
      title: 'Handle emails with no links',
      status: reqStatus(summary.counts.noLinkMatched > 0),
      detail: `${summary.counts.noLinkMatched} keyword-only match(es) without portal links.`
    },
    {
      id: 'ATS-008',
      title: 'Handle image-based tenders',
      status: 'not_available',
      detail: `Customer RTM out of scope — ${summary.counts.imageOos} image-only message(s) flagged, not processed.`
    },
    {
      id: 'ATS-009',
      title: 'Retry Outlook login failures',
      status:
        summary.counts.authFailures > 0 || summary.graphConfigured
          ? 'active'
          : 'ready',
      detail: `Outlook token acquisition retries ${outlookAuth.MAX_RETRIES}× with mailbox authRetry state. ${summary.counts.authFailures} mailbox(es) in failed auth state.`
    },
    {
      id: 'ATS-010',
      title: 'Send failure screenshots to users',
      status: summary.counts.failureArtifacts > 0 ? 'active' : 'ready',
      detail: `${summary.counts.failureArtifacts} open failure artifact(s); ${summary.counts.notifiedFailures} notification(s) sent (SMTP or logged). SVG screenshot at /uploads/.../failure-artifacts/.`
    }
  ];

  res.json({ success: true, data: { requirements, summary } });
});

exports.getEmailTenderFeed = catchAsync(async (req, res) => {
  const messages = await emailTenderScanService.getMessagesFeed(req.companyId, {
    limit: Number(req.query.limit || 40),
    decision: req.query.decision
  });
  const mailboxes = await emailTenderScanService.listMailboxes(req.companyId);
  res.json({ success: true, data: { messages, mailboxes } });
});

exports.seedEmailTenderDemo = catchAsync(async (req, res) => {
  const data = await seedEmailTenderDemoForCompany(req.companyId);
  res.json({
    success: true,
    message: 'US + Austria demo mailboxes and sample emails seeded (ATS-001).',
    data
  });
});

exports.scanEmailTenders = catchAsync(async (req, res) => {
  const results = req.body.mailboxId
    ? [await emailTenderScanService.scanMailbox(req.companyId, req.body.mailboxId)]
    : await emailTenderScanService.scanAllMailboxes(req.companyId);
  res.json({
    success: true,
    message: 'Email tender scan completed (ATS-001–007).',
    data: { results }
  });
});

exports.runEmailDiscovery = catchAsync(async (req, res) => {
  const result = await emailTenderScanService.runDiscoveryScan(req.companyId, req.body);
  res.json({ success: true, data: result });
});

exports.getEmailTenderFailures = catchAsync(async (req, res) => {
  const failures = await emailTenderScanService.getFailureFeed(
    req.companyId,
    Number(req.query.limit || 25)
  );
  res.json({ success: true, data: { failures } });
});

exports.simulateEmailFailureDemo = catchAsync(async (req, res) => {
  const result = await emailTenderScanService.simulateFailureDemo(req.companyId);
  res.json({
    success: true,
    message: 'Demo failure recorded with screenshot artifact (ATS-010).',
    data: result
  });
});
