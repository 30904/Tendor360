const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/../.env' });

async function run() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  try {
    const id = Math.floor(Math.random() * 1000);
    const subject = `Live RFP: Digital Transformation Services (Ref: DT-2026-${id})`;
    
    await transporter.sendMail({
      from: `"Procurement Officer" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Sending it to ourselves so it lands in the inbox
      subject: subject,
      text: `Dear Vendor,\n\nYou are invited to submit a proposal for the upcoming Digital Transformation project for the State Health Department.\n\nProject Scope:\nWe are seeking vendors to overhaul our document management system.\n\nDeadline: July 15, 2026\n\nPlease submit your bids via the portal.\n\nRegards,\nProcurement Team`
    });
    console.log(`Test email sent successfully! Subject: ${subject}`);
  } catch (error) {
    console.error('Failed to send test email:', error);
  } finally {
    process.exit(0);
  }
}
run();
