const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const EmailTenderMailbox = require('../src/modules/email-tender-scanning/models/EmailTenderMailbox');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the first demo mailbox
    const mailbox = await EmailTenderMailbox.findOne({ isDeleted: false });
    
    if (mailbox) {
      // Configure it with IMAP using the credentials from .env
      mailbox.provider = 'imap';
      mailbox.email = process.env.SMTP_USER || mailbox.email; // Update email to match user
      mailbox.imapConfig = {
        host: process.env.SMTP_HOST,
        port: 993,
        tls: true,
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASS
      };
      await mailbox.save();
      console.log(`Successfully configured mailbox ${mailbox.email} to use IMAP.`);
    } else {
      console.log('No mailboxes found in database to update.');
    }
  } catch (error) {
    console.error('Error updating mailbox:', error);
  } finally {
    process.exit(0);
  }
}

run();
