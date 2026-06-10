const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const EmailTenderMailbox = require('../src/modules/email-tender-scanning/models/EmailTenderMailbox');
const EmailTenderMessage = require('../src/modules/email-tender-scanning/models/EmailTenderMessage');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Revert the mailbox back to 'graph' so it falls back to demo mode
    const mailbox = await EmailTenderMailbox.findOne({ email: process.env.SMTP_USER, isDeleted: false });
    if (mailbox) {
      mailbox.provider = 'graph';
      await mailbox.save();
      console.log('Reverted mailbox back to demo mode.');
    }

    // Insert the two test emails directly into the DB so they are ready for "Scan now"
    if (mailbox) {
      const existingTender = await EmailTenderMessage.findOne({ subject: 'RFP Invitation: IT Infrastructure Modernization (Ref: RFP-2026-884)' });
      if (!existingTender) {
        await EmailTenderMessage.create({
          companyId: mailbox.companyId,
          mailboxId: mailbox._id,
          graphMessageId: `demo-tender-${Date.now()}`,
          subject: 'RFP Invitation: IT Infrastructure Modernization (Ref: RFP-2026-884)',
          from: 'procurement@healthservices.gov',
          receivedAt: new Date(),
          bodyPreview: 'Dear Vendor, You are invited to submit a proposal for the upcoming IT Infrastructure Modernization project...',
          bodyText: `Dear Vendor,\n\nYou are invited to submit a proposal for the upcoming IT Infrastructure Modernization project for the Department of Health Services.\n\nProject Scope:\nThe department is seeking qualified vendors to upgrade our cloud hosting infrastructure and provide managed security services across 5 regional offices.\n\nKey Dates:\n- Question Submission Deadline: June 15, 2026\n- Proposal Due Date: July 1, 2026 at 2:00 PM EST\n\nPlease find the complete bidding requirements, technical specifications, and terms and conditions on our procurement portal here:\nhttps://sam.gov/opp/example-solicitation\n\nWe look forward to your submission.\n\nRegards,\nProcurement Officer\nDepartment of Health Services`,
          hasAttachments: false,
          attachments: [],
          actions: [],
          decision: 'pending'
        });
        console.log('Inserted valid Tender email.');
      }

      const existingSpam = await EmailTenderMessage.findOne({ subject: 'Webinar: 5 Ways to Automate Your Sales Proposals this Summer' });
      if (!existingSpam) {
        await EmailTenderMessage.create({
          companyId: mailbox.companyId,
          mailboxId: mailbox._id,
          graphMessageId: `demo-spam-${Date.now()}`,
          subject: 'Webinar: 5 Ways to Automate Your Sales Proposals this Summer',
          from: 'marketing@salestech.com',
          receivedAt: new Date(),
          bodyPreview: 'Hi there, Are your sales reps spending too much time writing proposals manually? Join us next week...',
          bodyText: `Hi there,\n\nAre your sales reps spending too much time writing proposals manually?\n\nJoin us next week for our exclusive summer webinar where we will discuss how top healthcare companies are automating their document workflows to close deals 30% faster!\n\nIn this 45-minute session, you will learn:\n- How to draft winning business proposals in minutes\n- Tips for organizing your sales team\n- Q&A with our product experts\n\nClick here to register for the free webinar:\nhttps://example-webinar-registration.com/summer-series\n\nDon't miss out on these insights. See you there!\n\nCheers,\nThe SalesTech Team`,
          hasAttachments: false,
          attachments: [],
          actions: [],
          decision: 'pending'
        });
        console.log('Inserted Spam newsletter email.');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}
run();
