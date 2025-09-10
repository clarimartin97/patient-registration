//Centralized configuration for all notification channels
// TODO: SMS ready for future implementation

const notificationConfig = {

  global: {
    enabled: process.env.NOTIFICATIONS_ENABLED !== 'false',
    maxRetries: parseInt(process.env.NOTIFICATION_MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.NOTIFICATION_RETRY_DELAY) || 5000,
    deliveryTimeout: parseInt(process.env.NOTIFICATION_DELIVERY_TIMEOUT) || 30000
  },

  // Email configuration (current implementation)
  email: {
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== 'false',
    provider: 'mailtrap', 
    settings: {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
      fromEmail: process.env.FROM_EMAIL,
      adminEmail: process.env.ADMIN_EMAIL
    }
  }
  ,

  // TODO: SMS ready for future implementation
  sms: {
    enabled: process.env.SMS_NOTIFICATIONS_ENABLED === 'true', // Disabled by default
    provider: process.env.SMS_DEFAULT_PROVIDER || 'twilio',
    providers: {
      twilio: {
        enabled: process.env.TWILIO_ENABLED === 'true',
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER
      },
      awsSns: {
        enabled: process.env.AWS_SNS_ENABLED === 'true',
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    },
    settings: {
      maxLength: parseInt(process.env.SMS_MAX_LENGTH) || 160,
      adminPhone: process.env.ADMIN_PHONE
    }
  },

  // Future notification channels can be added here:
  // push: { ... },
  // webhook: { ... },
  // slack: { ... }

  // Message templates (extensible for all channels)
  templates: {
    registrationConfirmation: {
      email: {
        subject: 'Patient Registration Confirmation',
        template: 'registration-confirmation-email'
      }
      // Future SMS template:
      // sms: {
      //   template: 'Hi {fullName}! Your patient registration is confirmed. Patient ID: #{id}.'
      // }
    },
    
    errorNotification: {
      email: {
        subject: 'Patient Registration Error',
        template: 'error-notification-email'
      }
      // Future SMS template:
      // sms: {
      //   template: 'ALERT: Registration error for {patientName}. Error: {errorMessage}'
      // }
    }
  }
};

/**
 * Get configuration for a specific notification channel
 * @param {string} channel - Channel name ('email', 'sms', etc.)
 * @returns {Object} Channel configuration
 */
function getChannelConfig(channel) {
  return notificationConfig[channel] || null;
}

/**
 * Check if a notification channel is enabled
 * @param {string} channel - Channel name
 * @returns {boolean} Is enabled
 */
function isChannelEnabled(channel) {
  const config = getChannelConfig(channel);
  return config && config.enabled && notificationConfig.global.enabled;
}

/**
 * Get all enabled notification channels
 * @returns {Array} Enabled channels
 */
function getEnabledChannels() {
  return Object.keys(notificationConfig)
    .filter(key => key !== 'global' && key !== 'templates')
    .filter(channel => isChannelEnabled(channel));
}

/**
 * Validate notification configuration
 * @returns {Object} Validation result
 */
function validateConfig() {
  const errors = [];
  const warnings = [];
  
  // Check if notifications are globally enabled
  if (!notificationConfig.global.enabled) {
    warnings.push('All notifications are disabled globally.');
    return { isValid: true, errors, warnings, enabledChannels: [] };
  }
  
  // Validate email configuration
  if (isChannelEnabled('email')) {
    const emailConfig = getChannelConfig('email');
    if (!emailConfig.settings.user || !emailConfig.settings.pass) {
      errors.push('Email credentials are required when email notifications are enabled.');
    }
  }
  
  // Validate SMS configuration (when enabled)
  if (isChannelEnabled('sms')) {
    const smsConfig = getChannelConfig('sms');
    const enabledProviders = Object.keys(smsConfig.providers).filter(provider => 
      smsConfig.providers[provider].enabled
    );
    
    if (enabledProviders.length === 0) {
      errors.push('At least one SMS provider must be enabled when SMS notifications are enabled.');
    }
    
    // Validate Twilio
    if (smsConfig.providers.twilio.enabled) {
      if (!smsConfig.providers.twilio.accountSid || !smsConfig.providers.twilio.authToken) {
        errors.push('Twilio credentials are required when Twilio is enabled.');
      }
    }
    
    // Validate AWS SNS
    if (smsConfig.providers.awsSns.enabled) {
      if (!smsConfig.providers.awsSns.accessKeyId || !smsConfig.providers.awsSns.secretAccessKey) {
        errors.push('AWS credentials are required when AWS SNS is enabled.');
      }
    }
  }
  
  const enabledChannels = getEnabledChannels();
  
  if (enabledChannels.length === 0) {
    warnings.push('No notification channels are enabled.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    enabledChannels
  };
}

/**
 * Get message template for a specific channel and message type
 * @param {string} messageType - Message type ('registrationConfirmation', 'errorNotification', etc.)
 * @param {string} channel - Channel name ('email', 'sms', etc.)
 * @returns {Object} Template configuration
 */
function getMessageTemplate(messageType, channel) {
  const template = notificationConfig.templates[messageType];
  if (!template) {
    throw new Error(`Message template '${messageType}' not found.`);
  }
  
  return template[channel] || null;
}

/**
 * Get all available message templates for a channel
 * @param {string} channel - Channel name
 * @returns {Object} Available templates for the channel
 */
function getChannelTemplates(channel) {
  const templates = {};
  
  Object.keys(notificationConfig.templates).forEach(messageType => {
    const template = notificationConfig.templates[messageType][channel];
    if (template) {
      templates[messageType] = template;
    }
  });
  
  return templates;
}

module.exports = {
  notificationConfig,
  getChannelConfig,
  isChannelEnabled,
  getEnabledChannels,
  validateConfig,
  getMessageTemplate,
  getChannelTemplates
};