const EmailService = require('./emailService');

/**
 * Current implementation: Email only
 * TODO: SMS ready for future implementation
 */
class NotificationService {
  static async sendRegistrationConfirmation(patientData, options = {}) {
    const { fullName, email, phone, id } = patientData;
    
    const results = {
      email: null,
      // Future: sms: null, push: null, etc.
      errors: []
    };

    try {
      // Send email notification
      results.email = await EmailService.sendConfirmationEmail(patientData);
      console.log(`✅ Email confirmation sent to ${email} (Patient ID: ${id})`);
    } catch (error) {
      results.errors.push(`Email failed: ${error.message}`);
      console.error(`❌ Email confirmation failed for ${email}:`, error.message);
    }

    // TODO: SMS implementation here

    return results;
  }
  static sendRegistrationConfirmationAsync(patientData, options = {}) {
    setImmediate(async () => {
      try {
        await this.sendRegistrationConfirmation(patientData, options);
      } catch (error) {
        console.error('Async notification sending failed:', error.message);
      }
    });
  }

  static async sendErrorNotification(error, patientData, options = {}) {
    const results = {
      email: null,
      // Future: sms: null, push: null, etc.
      errors: []
    };

    try {
      results.email = await EmailService.sendErrorNotification(error, patientData);
      console.log(`✅ Error notification email sent to admin`);
    } catch (emailError) {
      results.errors.push(`Admin email failed: ${emailError.message}`);
      console.error(`❌ Admin error notification email failed:`, emailError.message);
    }

    // TODO: SMS implementation here

    return results;
  }
  static sendErrorNotificationAsync(error, patientData, options = {}) {
    setImmediate(async () => {
      try {
        await this.sendErrorNotification(error, patientData, options);
      } catch (notificationError) {
        console.error('Async error notification failed:', notificationError.message);
      }
    });
  }

  static getAvailableChannels() {
    return [
      {
        id: 'email',
        name: 'Email',
        enabled: true,
        description: 'Send notifications via email'
      }
    ];
  }

  static async getNotificationPreferences(patientId) {
    // Future: Query database for patient preferences
    return {
      email: {
        enabled: true,
        address: null 
      }
      // Future: sms: { enabled: false, number: null, provider: 'twilio' }
    };
  }


  static async updateNotificationPreferences(patientId, preferences) {
    // Future: Update database with patient preferences
    console.log(`Updating notification preferences for patient ${patientId}:`, preferences);
  }

  static validateChannelConfig(channel) {
    switch (channel) {
      case 'email':
        return {
          valid: true,
          message: 'Email notifications are properly configured'
        };
      // Future SMS validation:
      // case 'sms':
      //   return this.validateSmsConfig();
      default:
        return {
          valid: false,
          message: `Unknown notification channel: ${channel}`
        };
    }
  }


  static async getNotificationStats(channel = null) {
    // Future: Query database for detailed statistics
    return {
      total: 0,
      successful: 0,
      failed: 0,
      channels: {
        email: {
          total: 0,
          successful: 0,
          failed: 0
        }
        // Future: sms: { total: 0, successful: 0, failed: 0 }
      }
    };
  }
}

module.exports = NotificationService;