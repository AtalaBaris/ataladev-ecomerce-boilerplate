const nodemailer = require('nodemailer');
const { env } = require('../../config/env');

let transporter = null;

function isEmailConfigured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return transporter;
}

/**
 * Mail gönderimi ana akışı bozmaz; SMTP yoksa development'ta konsola yazar.
 * @param {{ to: string, subject: string, text: string, html?: string }} options
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    const mailer = getTransporter();

    if (!mailer) {
      if (env.nodeEnv !== 'production') {
        const urlMatch = text.match(/https?:\/\/[^\s]+/);
        console.log('[EmailService] SMTP yok — mail konsola yazıldı.');
        console.log(`  To: ${to}`);
        console.log(`  Subject: ${subject}`);
        if (urlMatch) {
          console.log(`  Link: ${urlMatch[0]}`);
        } else {
          console.log(`  Body: ${text}`);
        }
      }
      return { sent: false, logged: true };
    }

    await mailer.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text,
      html: html || text,
    });

    return { sent: true };
  } catch (error) {
    console.error('[EmailService] Gönderim hatası:', error.message);
    return { sent: false, error: error.message };
  }
}

module.exports = { sendEmail, isEmailConfigured };
