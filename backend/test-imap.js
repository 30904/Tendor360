const imaps = require('imap-simple');
require('dotenv').config({ path: __dirname + '/.env' });

async function test() {
  console.log('Testing IMAP connection to:', process.env.SMTP_HOST);
  try {
    const connection = await imaps.connect({
      imap: {
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASS,
        host: process.env.SMTP_HOST,
        port: 993,
        tls: true,
        authTimeout: 5000,
        tlsOptions: { rejectUnauthorized: false }
      }
    });
    console.log('Connected successfully!');
    connection.end();
  } catch (err) {
    console.error('Failed:', err);
  }
  process.exit(0);
}
test();
