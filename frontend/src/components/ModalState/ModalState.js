import React, { useEffect } from 'react';
import './ModalState.css';

const ModalState = ({ type, message, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error';
      default:
        return 'Information';
    }
  };

  return (
    <div className="modal-state">
      <div className="modal-state__content">
        <div className="modal-state__icon">
          {getIcon()}
        </div>
        <h3 className="modal-state__title">{getTitle()}</h3>
        <p className="modal-state__message">{message}</p>
        <button 
          className="modal-state__close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ModalState;