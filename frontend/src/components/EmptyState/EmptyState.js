import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  title = 'No patients found', 
  message = 'Get started by adding your first patient.',
  actionText = 'Add Patient',
  onAction 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        👥
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {onAction && (
        <button 
          className="empty-state__action"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;