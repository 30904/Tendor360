const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const EmailTenderMailbox = require('../src/modules/email-tender-scanning/models/EmailTenderMailbox');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the first demo mailbox
    const mailbox = await EmailTenderMailbox.findOne({ isDeleted: false });
    
    if (mailbox) {
      mailbox.provider = 'imap';
      mailbox.email = 'celeris.ventures@gmail.com';
      mailbox.imapConfig = {
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        user: 'celeris.ventures@gmail.com',
        password: 'oykkagrqzdzhvike' // App passwords work best without spaces
      };
      await mailbox.save();
      console.log(`Successfully configured mailbox ${mailbox.email} to use Gmail IMAP.`);
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
