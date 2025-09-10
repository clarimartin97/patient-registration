import React, { useState, useEffect } from 'react';
import './NotificationPreferences.css';

/**
 * Notification Preferences Component
 * SMS will be requested in two months
 */
const NotificationPreferences = ({ patientId, onSave, onCancel }) => {
  const [preferences, setPreferences] = useState({
    email: {
      enabled: true,
      address: ''
    }
    // Future SMS preferences:
    // sms: {
    //   enabled: false,
    //   number: '',
    //   provider: 'twilio'
    // }
  });
  
  const [availableChannels, setAvailableChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotificationChannels();
    if (patientId) {
      loadPatientPreferences();
    }
  }, [patientId]);

  const loadNotificationChannels = async () => {
    try {
      const response = await fetch('/api/notifications/channels');
      const data = await response.json();
      
      if (data.success) {
        setAvailableChannels(data.data);
      }
    } catch (error) {
      console.error('Failed to load notification channels:', error);
    }
  };

  const loadPatientPreferences = async () => {
    // At the moment, we use default preferences
    setPreferences({
      email: {
        enabled: true,
        address: ''
      }
    });
  };

  const handleChannelToggle = (channelId) => {
    setPreferences(prev => ({
      ...prev,
      [channelId]: {
        ...prev[channelId],
        enabled: !prev[channelId].enabled
      }
    }));
  };

  const handleChannelConfigChange = (channelId, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [channelId]: {
        ...prev[channelId],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      
      console.log('Saving notification preferences:', preferences);
      
      if (onSave) {
        onSave(preferences);
      }
    } catch (error) {
      setError('Failed to save notification preferences');
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChannelPreferences = (channel) => {
    switch (channel.id) {
      case 'email':
        return (
          <div className="channel-preferences">
            <div className="channel-header">
              <span className="channel-icon">📧</span>
              <h3>{channel.name}</h3>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={preferences.email?.enabled || false}
                  onChange={() => handleChannelToggle('email')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            
            {preferences.email?.enabled && (
              <div className="channel-config">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={preferences.email?.address || ''}
                    onChange={(e) => handleChannelConfigChange('email', 'address', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            )}
          </div>
        );

      // Future SMS channel rendering:
      // case 'sms':
      //   return (
      //     <div className="channel-preferences">
      //     </div>
      //   );

      default:
        return (
          <div className="channel-preferences">
            <div className="channel-header">
              <span className="channel-icon">📢</span>
              <h3>{channel.name}</h3>
              <span className="coming-soon">Coming Soon</span>
            </div>
            <p className="channel-description">{channel.description}</p>
          </div>
        );
    }
  };

  return (
    <div className="notification-preferences">
      <div className="preferences-header">
        <h2>Notification Preferences</h2>
        <p>Choose how you'd like to receive notifications</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="channels-list">
        {availableChannels.map(channel => (
          <div key={channel.id} className="channel-item">
            {renderChannelPreferences(channel)}
          </div>
        ))}
      </div>

      <div className="preferences-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn--secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="btn btn--primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;