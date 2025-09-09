const nodemailer = require('nodemailer');

// Create transporter for Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER || 'your_mailtrap_username',
    pass: process.env.MAILTRAP_PASS || 'your_mailtrap_password'
  }
});

transporter.verify((error, success) => {
  // Silent verification
});

module.exports = transporter;