const EmailTenderMailbox = require('../../modules/email-tender-scanning/models/EmailTenderMailbox');
const EmailTenderMessage = require('../../modules/email-tender-scanning/models/EmailTenderMessage');
const IntegrationConnector = require('../../modules/integrations/models/IntegrationConnector');

async function seedEmailTenderDemoForCompany(companyId) {
  const mailboxes = await Promise.all([
    EmailTenderMailbox.findOneAndUpdate(
      { companyId, email: 'tenders-us@healthcare.example.com' },
      {
        companyId,
        region: 'US',
        displayName: 'US Commercial Tender Inbox',
        email: 'tenders-us@healthcare.example.com',
        forwardTo: ['sales-us@medicare-demo.example.com'],
        notifyOnFailure: ['bot-admin@medicare-demo.example.com', 'support@medicare-demo.example.com'],
        folderRejected: 'Rejected Tenders',
        folderProcessed: 'Processed Tenders',
        status: 'active',
        isDeleted: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ),
    EmailTenderMailbox.findOneAndUpdate(
      { companyId, email: 'tenders-at@healthcare.example.com' },
      {
        companyId,
        region: 'AT',
        displayName: 'Austria Tender Inbox',
        email: 'tenders-at@healthcare.example.com',
        forwardTo: ['sales-at@medicare-demo.example.com'],
        notifyOnFailure: ['bot-admin@medicare-demo.example.com', 'support@medicare-demo.example.com'],
        folderRejected: 'Rejected Tenders',
        folderProcessed: 'Processed Tenders',
        status: 'active',
        isDeleted: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
  ]);

  const demoMessages = [
    {
      mailbox: mailboxes[0],
      graphMessageId: `demo-us-multi-${companyId}`,
      subject: 'Multiple hospital RFP links — diagnostics tender',
      from: 'procurement@regional-hospital.example.com',
      bodyText:
        'Please review the following opportunities:\n' +
        'Primary RFP: https://portal.example.com/rfp/diagnostics-2026\n' +
        'Secondary lab supplies: https://portal.example.com/rfp/lab-supplies-archive\n' +
        'Unrelated newsletter: https://news.example.com/healthcare-weekly',
      attachments: [
        {
          name: 'scope-summary.pdf',
          contentType: 'application/pdf',
          textContent: 'Request for proposal hospital diagnostics immunoassay point of care laboratory',
          isImage: false
        }
      ]
    },
    {
      mailbox: mailboxes[0],
      graphMessageId: `demo-us-nolink-${companyId}`,
      subject: 'Amendment notice — hospital qualification (no portal link)',
      from: 'contracts@idn-health.example.com',
      bodyText:
        'This amendment covers qualification requirements for med-surg and laboratory categories. No external link provided; please use keywords to qualify.',
      attachments: []
    },
    {
      mailbox: mailboxes[1],
      graphMessageId: `demo-at-reject-${companyId}`,
      subject: 'Weekly catering vendor newsletter',
      from: 'newsletter@vendor.example.com',
      bodyText: 'Catering menu updates and staff cafeteria hours. Not a tender.',
      attachments: []
    },
    {
      mailbox: mailboxes[1],
      graphMessageId: `demo-at-image-${companyId}`,
      subject: 'Scanned tender notice (image only)',
      from: 'fax@clinic.example.com',
      bodyText: 'See attached scanned image.',
      attachments: [
        {
          name: 'tender-scan.png',
          contentType: 'image/png',
          isImage: true
        }
      ]
    }
  ];

  const created = [];
  for (const item of demoMessages) {
    const doc = await EmailTenderMessage.findOneAndUpdate(
      { companyId, graphMessageId: item.graphMessageId },
      {
        companyId,
        mailboxId: item.mailbox._id,
        graphMessageId: item.graphMessageId,
        subject: item.subject,
        from: item.from,
        receivedAt: new Date(),
        bodyText: item.bodyText,
        bodyPreview: item.bodyText.slice(0, 200),
        attachments: item.attachments,
        decision: 'pending',
        actions: [],
        isDeleted: false
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    created.push(doc);
  }

  await IntegrationConnector.findOneAndUpdate(
    { companyId, key: 'microsoft_graph_mail' },
    {
      companyId,
      key: 'microsoft_graph_mail',
      displayName: 'Microsoft Graph Mail (Outlook)',
      category: 'discovery',
      status: 'active',
      health: process.env.MS_GRAPH_TENANT_ID ? 'healthy' : 'healthy',
      config: {
        configured: true,
        mode: process.env.MS_GRAPH_TENANT_ID ? 'live_graph' : 'demo_inbox',
        regions: ['US', 'AT'],
        seededAt: new Date().toISOString()
      },
      lastCheckedAt: new Date(),
      isDeleted: false
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { mailboxes, messages: created };
}

module.exports = { seedEmailTenderDemoForCompany };
