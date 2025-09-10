const transporter = require('../config/email');

class EmailService {
  static async sendConfirmationEmail(patientData) {
    const { fullName, email, id } = patientData;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL ,
      to: email,
      subject: 'Patient Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Patient Registration Confirmed</h2>
          
          <p>Dear ${fullName},</p>
          
          <p>Thank you for registering as a patient with our medical system. Your registration has been successfully completed.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Registration Details:</h3>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Patient ID:</strong> #${id}</li>
              <li><strong>Full Name:</strong> ${fullName}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>Your document photo has been securely stored and will be used for identification purposes.</p>
          
          <p>If you have any questions or need to make changes to your registration, please contact our support team.</p>
          
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
          
          <p style="color: #6c757d; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
      text: `
        Patient Registration Confirmed
        
        Dear ${fullName},
        
        Thank you for registering as a patient with our medical system. Your registration has been successfully completed.
        
        Registration Details:
        - Patient ID: #${id}
        - Full Name: ${fullName}
        - Email: ${email}
        - Registration Date: ${new Date().toLocaleDateString()}
        
        Your document photo has been securely stored and will be used for identification purposes.
        
        If you have any questions or need to make changes to your registration, please contact our support team.
        
        This is an automated message. Please do not reply to this email.
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Confirmation email sent successfully to ${email} (Patient ID: ${id})`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`❌ Failed to send confirmation email to ${email} (Patient ID: ${id}):`, error.message);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }
  }

  static sendConfirmationEmailAsync(patientData) {
    // Use setImmediate to ensure this runs in the next tick of the event loop
    setImmediate(async () => {
      try {
        await this.sendConfirmationEmail(patientData);
      } catch (error) {
        console.error('Async email sending failed:', error.message);
      }
    });
  }

  static async sendErrorNotification(error, patientData) {
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Patient Registration Error',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">Patient Registration Error</h2>
          
          <p>An error occurred during patient registration:</p>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #721c24; margin-top: 0;">Error Details:</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Patient Data:</strong></p>
            <pre style="background-color: #f1f3f4; padding: 10px; border-radius: 3px; overflow-x: auto;">
${JSON.stringify(patientData, null, 2)}
            </pre>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Error notification email sent successfully to admin`);
      return { success: true, messageId: info.messageId };
    } catch (emailError) {
      console.error(`❌ Failed to send error notification email:`, emailError.message);
    }
  }

  // Asynchronous error notification
  static sendErrorNotificationAsync(error, patientData) {
    setImmediate(async () => {
      try {
        await this.sendErrorNotification(error, patientData);
      } catch (emailError) {
        console.error('Async error notification failed:', emailError.message);
      }
    });
  }
}

module.exports = EmailService;