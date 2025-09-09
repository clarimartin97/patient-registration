const nodemailer = require('nodemailer');

// Create transporter for Mailtrap
const transporter = nodemailer.createTransporter({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER || 'your_mailtrap_username',
    pass: process.env.MAILTRAP_PASS || 'your_mailtrap_password'
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;