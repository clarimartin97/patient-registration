import React, { useState } from 'react';
import { patientAPI } from '../../services/api';
import './PatientCard.css';

const PatientCard = ({ patient, onError }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div 
      className={`patient-card ${isExpanded ? 'patient-card--expanded' : ''}`}
      onClick={handleCardClick}
    >
      <div className="patient-card__header">
        <div className="patient-card__avatar">
          {imageLoading && (
            <div className="patient-card__avatar-loading">
              <div className="loading-spinner"></div>
            </div>
          )}
          {imageError ? (
            <div className="patient-card__avatar-fallback">
              {getInitials(patient.fullName)}
            </div>
          ) : (
            <img
              src={patientAPI.getDocumentPhotoUrl(patient.documentPhoto)}
              alt={`${patient.fullName}'s document`}
              className="patient-card__avatar-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoading ? 'none' : 'block' }}
            />
          )}
        </div>
        <div className="patient-card__info">
          <h3 className="patient-card__name">{patient.fullName}</h3>
          <p className="patient-card__date">
            Registered: {formatDate(patient.createdAt)}
          </p>
        </div>
        <div className="patient-card__expand-icon">
          {isExpanded ? '−' : '+'}
        </div>
      </div>

      {isExpanded && (
        <div className="patient-card__details">
          <div className="patient-card__detail-item">
            <span className="patient-card__detail-label">Email:</span>
            <span className="patient-card__detail-value">{patient.email}</span>
          </div>
          <div className="patient-card__detail-item">
            <span className="patient-card__detail-label">Phone:</span>
            <span className="patient-card__detail-value">{patient.phone}</span>
          </div>
          <div className="patient-card__detail-item">
            <span className="patient-card__detail-label">Patient ID:</span>
            <span className="patient-card__detail-value">#{patient.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientCard;