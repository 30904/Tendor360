const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
require('dotenv').config({ path: __dirname + '/../.env' });

async function run() {
  console.log('Connecting to IMAP...');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('User:', process.env.EMAIL_USER);
  console.log('Port:', process.env.EMAIL_PORT);

  const config = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_APP_PASSWORD,
      host: process.env.EMAIL_HOST || 'imap.gmail.com',
      port: Number(process.env.EMAIL_PORT || 993),
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
      connTimeout: 15000
    }
  };

  let connection;
  try {
    connection = await imaps.connect(config);
    console.log('✅ IMAP connected!');
  } catch (err) {
    console.error('❌ IMAP connection failed:', err.message);
    process.exit(1);
  }

  try {
    await connection.openBox('INBOX');

    // Check UNSEEN first
    const unseenResults = await connection.search(['UNSEEN'], { bodies: ['HEADER'], struct: true });
    console.log(`\n📬 UNSEEN emails: ${unseenResults.length}`);
    unseenResults.forEach((item) => {
      const header = item.parts.find(p => p.which === 'HEADER');
      if (header) {
        console.log(`  - UID ${item.attributes.uid}: ${header.body.subject?.[0] || 'no subject'}`);
      }
    });

    // Check ALL recent emails
    const allResults = await connection.search([['SINCE', new Date(Date.now() - 2 * 60 * 60 * 1000)]], {
      bodies: ['HEADER'], struct: true
    });
    console.log(`\n📋 Emails received in last 2 hours: ${allResults.length}`);
    allResults.forEach((item) => {
      const header = item.parts.find(p => p.which === 'HEADER');
      if (header) {
        const seen = (item.attributes.flags || []).includes('\\Seen');
        console.log(`  - UID ${item.attributes.uid} [${seen ? 'READ' : 'UNREAD'}]: ${header.body.subject?.[0] || 'no subject'}`);
      }
    });

  } finally {
    connection.end();
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
