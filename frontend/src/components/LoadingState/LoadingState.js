import React from 'react';
import './LoadingState.css';

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-state">
      <div className="loading-spinner-large"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingState;