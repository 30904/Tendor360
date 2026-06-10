const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Load models
require('../src/models');
const EmailTenderMailbox = require('../src/modules/email-tender-scanning/models/EmailTenderMailbox');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  try {
    const mailbox = await EmailTenderMailbox.findOne({ email: 'celeris.ventures@gmail.com' });
    if (!mailbox) {
      console.error('❌ Mailbox for celeris.ventures@gmail.com not found');
      process.exit(1);
    }

    mailbox.provider = 'imap';
    mailbox.imapConfig = {
      host: process.env.EMAIL_HOST || 'imap.gmail.com',
      port: Number(process.env.EMAIL_PORT || 993),
      tls: true,
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_APP_PASSWORD
    };

    await mailbox.save();
    console.log('✅ IMAP configured for:', mailbox.email);
    console.log('   Host:', mailbox.imapConfig.host + ':' + mailbox.imapConfig.port);
    console.log('   User:', mailbox.imapConfig.user);
    console.log('   TLS:', mailbox.imapConfig.tls);
    console.log('   Provider:', mailbox.provider);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
