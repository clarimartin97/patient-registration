const EmailService = require('./emailService');

/**
 * Current implementation: Email only
 * TODO: SMS ready for future implementation
 */
class NotificationService {
  /**
   * Send patient registration confirmation
   * @param {Object} patientData - Patient information
   * @param {Object} options - Notification options (extensible for future channels)
   */
  static async sendRegistrationConfirmation(patientData, options = {}) {
    const { fullName, email, phone, id } = patientData;
    
    // Current implementation: Email only
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

  /**
   * Send registration confirmation asynchronously
   * @param {Object} patientData - Patient information
   * @param {Object} options - Notification options
   */
  static sendRegistrationConfirmationAsync(patientData, options = {}) {
    setImmediate(async () => {
      try {
        await this.sendRegistrationConfirmation(patientData, options);
      } catch (error) {
        console.error('Async notification sending failed:', error.message);
      }
    });
  }

  /**
   * Send error notification to admin
   * @param {Error} error - Error object
   * @param {Object} patientData - Patient data that caused the error
   * @param {Object} options - Admin notification options
   */
  static async sendErrorNotification(error, patientData, options = {}) {
    const results = {
      email: null,
      // Future: sms: null, push: null, etc.
      errors: []
    };

    try {
      // Send email notification to admin
      results.email = await EmailService.sendErrorNotification(error, patientData);
      console.log(`✅ Error notification email sent to admin`);
    } catch (emailError) {
      results.errors.push(`Admin email failed: ${emailError.message}`);
      console.error(`❌ Admin error notification email failed:`, emailError.message);
    }

    // TODO: SMS implementation here
    // if (options.adminSmsEnabled && options.adminPhone) {
    //   try {
    //     results.sms = await SmsService.sendErrorNotificationSms(error, patientData, options.adminPhone);
    //   } catch (error) {
    //     results.errors.push(`Admin SMS failed: ${error.message}`);
    //   }
    // }

    return results;
  }

  /**
   * Send error notification asynchronously
   * @param {Error} error - Error object
   * @param {Object} patientData - Patient data
   * @param {Object} options - Admin notification options
   */
  static sendErrorNotificationAsync(error, patientData, options = {}) {
    setImmediate(async () => {
      try {
        await this.sendErrorNotification(error, patientData, options);
      } catch (notificationError) {
        console.error('Async error notification failed:', notificationError.message);
      }
    });
  }

  /**
   * Get available notification channels
   * @returns {Array} Available notification channels
   */
  static getAvailableChannels() {
    return [
      {
        id: 'email',
        name: 'Email',
        enabled: true,
        description: 'Send notifications via email'
      }
      // Future channels would be added here:
      // {
      //   id: 'sms',
      //   name: 'SMS',
      //   enabled: false, // Will be enabled when SMS is implemented
      //   description: 'Send notifications via SMS text messages'
      // }
    ];
  }

  /**
   * Get notification preferences for a patient
   * @param {number} patientId - Patient ID
   * @returns {Object} Notification preferences
   */
  static async getNotificationPreferences(patientId) {
    // Current implementation: Email only
    // Future: Query database for patient preferences
    return {
      email: {
        enabled: true,
        address: null // Will be populated from patient data
      }
      // Future: sms: { enabled: false, number: null, provider: 'twilio' }
    };
  }

  /**
   * Update notification preferences for a patient
   * @param {number} patientId - Patient ID
   * @param {Object} preferences - New preferences
   */
  static async updateNotificationPreferences(patientId, preferences) {
    // Current implementation: No-op
    // Future: Update database with patient preferences
    console.log(`Updating notification preferences for patient ${patientId}:`, preferences);
  }

  /**
   * Validate notification channel configuration
   * @param {string} channel - Channel name
   * @returns {Object} Validation result
   */
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

  /**
   * Get notification statistics
   * @param {string} channel - Channel name (optional)
   * @returns {Object} Notification statistics
   */
  static async getNotificationStats(channel = null) {
    // Current implementation: Basic stats
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