const nodemailer = require('nodemailer');

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const subject = 'Tender360 — Reset your password';
  const text = [
    `Hello${name ? ` ${name}` : ''},`,
    '',
    'We received a request to reset your Tender360 password.',
    'Click the link below to choose a new password (expires in 24 hours):',
    '',
    resetUrl,
    '',
    'If you did not request this, you can ignore this email.',
    '',
    '— Tender360'
  ].join('\n');

  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[password-reset] SMTP not configured — reset link for development:');
      console.log(resetUrl);
      return { sent: false, simulated: true, resetUrl };
    }
    throw new Error('Email service is not configured');
  }

  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text
  });

  return { sent: true };
}

module.exports = {
  isSmtpConfigured,
  sendPasswordResetEmail
};
