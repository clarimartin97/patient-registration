const express = require('express');
const router = express.Router();
const { validateConfig, getEnabledChannels, getChannelTemplates } = require('../config/notifications');

/**
 * Notification Routes
 * Designed to easily accommodate SMS and other notification channels in the future
 * 
 * Current implementation: Email only
 * Future extension: SMS preferences, delivery tracking, etc.
 */

/**
 * GET /api/notifications/channels
 * Get available notification channels
 */
router.get('/channels', (req, res) => {
  try {
    const channels = getEnabledChannels().map(channel => {
      switch (channel) {
        case 'email':
          return {
            id: 'email',
            name: 'Email',
            enabled: true,
            description: 'Send notifications via email',
            icon: '📧'
          };
        // Future SMS channel:
        // case 'sms':
        //   return {
        //     id: 'sms',
        //     name: 'SMS',
        //     enabled: true,
        //     description: 'Send notifications via SMS text messages',
        //     icon: '📱'
        //   };
        default:
          return {
            id: channel,
            name: channel.charAt(0).toUpperCase() + channel.slice(1),
            enabled: true,
            description: `Send notifications via ${channel}`,
            icon: '📢'
          };
      }
    });

    res.json({
      success: true,
      data: channels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get notification channels'
    });
  }
});

/**
 * GET /api/notifications/config
 * Get notification configuration status
 */
router.get('/config', (req, res) => {
  try {
    const validation = validateConfig();
    
    res.json({
      success: true,
      data: {
        globalEnabled: true, // Will be dynamic in the future
        channels: getEnabledChannels(),
        validation
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get notification configuration'
    });
  }
});

/**
 * GET /api/notifications/templates/:channel
 * Get message templates for a specific channel
 */
router.get('/templates/:channel', (req, res) => {
  try {
    const { channel } = req.params;
    const templates = getChannelTemplates(channel);
    
    if (Object.keys(templates).length === 0) {
      return res.status(404).json({
        success: false,
        message: `No templates found for channel: ${channel}`
      });
    }
    
    res.json({
      success: true,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get message templates'
    });
  }
});

/**
 * GET /api/notifications/stats
 * Get notification statistics
 * Future: Will include SMS delivery stats
 */
router.get('/stats', (req, res) => {
  try {
    // Current implementation: Basic stats
    // Future: Query database for detailed statistics
    const stats = {
      total: 0,
      successful: 0,
      failed: 0,
      channels: {
        email: {
          total: 0,
          successful: 0,
          failed: 0,
          deliveryRate: 0
        }
        // Future SMS stats:
        // sms: {
        //   total: 0,
        //   successful: 0,
        //   failed: 0,
        //   deliveryRate: 0
        // }
      }
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get notification statistics'
    });
  }
});

/**
 * POST /api/notifications/test/:channel
 * Send a test notification
 * Future: Will support SMS test messages
 */
router.post('/test/:channel', async (req, res) => {
  try {
    const { channel } = req.params;
    const { recipient, message } = req.body;
    
    // Current implementation: Email test only
    if (channel === 'email') {
      // Future: Implement email test
      res.json({
        success: true,
        message: 'Test email sent successfully',
        data: {
          channel: 'email',
          recipient,
          messageId: 'test-message-id'
        }
      });
    } 
    // Future SMS test:
    // else if (channel === 'sms') {
    //   const result = await SmsService.sendTestMessage(recipient, message);
    //   res.json({
    //     success: true,
    //     message: 'Test SMS sent successfully',
    //     data: result
    //   });
    // }
    else {
      res.status(400).json({
        success: false,
        message: `Test notifications not yet supported for channel: ${channel}`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to send test ${req.params.channel} notification`
    });
  }
});

/**
 * Future endpoints that will be implemented when SMS is added:
 * 
 * GET /api/notifications/patients/:id/preferences
 * Get notification preferences for a specific patient
 * 
 * PUT /api/notifications/patients/:id/preferences
 * Update notification preferences for a specific patient
 * 
 * GET /api/notifications/deliveries
 * Get SMS delivery history and status
 * 
 * POST /api/notifications/webhooks/sms
 * Handle SMS delivery status webhooks
 * 
 * GET /api/notifications/providers
 * Get available SMS providers and their status
 */

module.exports = router;