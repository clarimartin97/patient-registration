const nodemailer = require('nodemailer');

// Create transporter for Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

transporter.verify((error, success) => {
  // Silent verification
});

module.exports = transporter;