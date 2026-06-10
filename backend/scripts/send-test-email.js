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
    const id1 = Math.floor(Math.random() * 1000);
    const tenderSubject = `Tender Notice: Medical Equipment Procurement (RFP-MED-${id1})`;
    
    // 1. Send the Valid Tender Email
    await transporter.sendMail({
      from: `"Department of Health Procurement" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: tenderSubject,
      text: `Dear Vendor,\n\nWe are issuing a new tender request for the procurement of advanced Medical Equipment for the upcoming regional hospital expansion.\n\nRequirements include:\n- Advanced Imaging Systems\n- Patient Monitoring Devices\n- Compliance with ISO standards\n\nPlease find the RFP documents and submission guidelines at our vendor portal. Bids close on September 15th.\n\nThank you,\nChief Procurement Officer`
    });
    console.log(`✅ Valid Tender email sent successfully! Subject: ${tenderSubject}`);

    const id2 = Math.floor(Math.random() * 1000);
    const nonTenderSubject = `Internal Notice: Portal Maintenance Update ${id2}`;

    // 2. Send the Non-Tender (Spam/Noise) Email
    await transporter.sendMail({
      from: `"IT Department" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: nonTenderSubject,
      text: `Hello everyone,\n\nJust a quick heads up that the vendor portal will be undergoing scheduled maintenance this weekend from 2 AM to 4 AM EST. During this time, the portal will be completely unavailable for all users.\n\nPlease plan your uploads accordingly.\n\nThanks,\nIT Support Team`
    });
    console.log(`✅ Non-Tender email sent successfully! Subject: ${nonTenderSubject}`);

  } catch (error) {
    console.error('Failed to send test emails:', error);
  } finally {
    process.exit(0);
  }
}
run();
