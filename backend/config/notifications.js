// TODO: SMS ready for future implementation

const notificationConfig = {
  global: {
    enabled: process.env.NOTIFICATIONS_ENABLED !== 'false'
  },
  
  // Email configuration
  email: {
    enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== 'false',
    settings: {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
      fromEmail: process.env.FROM_EMAIL,
      adminEmail: process.env.ADMIN_EMAIL
    }
  },

  // TODO: SMS configuration for future implementation
  // sms: {},

  // TODO: Other notification channels for future implementation
  // push: {},
  // webhook: {},
  // slack: {},

  // Message templates
  templates: {
    registrationConfirmation: {
      email: {
        subject: 'Patient Registration Confirmation',
        template: 'registration-confirmation-email'
      }
    },
    
    errorNotification: {
      email: {
        subject: 'Patient Registration Error',
        template: 'error-notification-email'
      }
    }
  }
};

// Helper functions for notification management

function getChannelConfig(channel) {
  return notificationConfig[channel] || null;
}

function isChannelEnabled(channel) {
  const config = getChannelConfig(channel);
  return config && config.enabled && notificationConfig.global.enabled;
}

function getEnabledChannels() {
  return Object.keys(notificationConfig)
    .filter(key => key !== 'global' && key !== 'templates')
    .filter(channel => isChannelEnabled(channel));
}

// TODO: Add validation functions for future implementation
// function validateConfig() { ... }
// function getMessageTemplate() { ... }
// function getChannelTemplates() { ... }

module.exports = {
  notificationConfig,
  getChannelConfig,
  isChannelEnabled,
  getEnabledChannels
};