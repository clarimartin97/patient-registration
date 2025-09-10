import React, { useState, useEffect } from 'react';
import { patientAPI } from './services/api';
import PatientCard from './components/PatientCard/PatientCard';
import Modal from './components/Modal/Modal';
import PatientForm from './components/PatientForm/PatientForm';
import LoadingState from './components/LoadingState/LoadingState';
import EmptyState from './components/EmptyState/EmptyState';
import Notification from './components/Notification/Notification';
import ModalState from './components/ModalState/ModalState';
import './App.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });
  const [modalState, setModalState] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientAPI.getAllPatients();
      setPatients(response.data || []);
    } catch (err) {
      setError(err.message);
      showNotification('error', `Error loading patients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

 
  const showNotification = (type, message) => {
    setNotification({
      isVisible: true,
      type,
      message
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showModalState = (type, message) => {
    setModalState({
      isVisible: true,
      type,
      message
    });
  };

  const hideModalState = () => {
    setModalState(prev => ({
      ...prev,
      isVisible: false
    }));
  };


  const handlePatientSubmit = async (patientData) => {
    try {
      setIsSubmitting(true);
      await patientAPI.registerPatient(patientData);
      
      setIsModalOpen(false);
      await fetchPatients();
      
      showModalState('success', 'Patient registered!');
    } catch (err) {
      setIsModalOpen(false);
      
      setTimeout(() => {
        showModalState('error', err.message);
      }, 100);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

 
  const handleAddPatient = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <div className="app__header">
          <h1 className="app__title">Patient Registration</h1>
        </div>
        <div className="app__content">
          <LoadingState message="Loading..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="app__header">
          <h1 className="app__title">Patient Registration</h1>
        </div>
        <div className="app__content">
          <div className="error-state">
            <div className="error-state__icon">⚠️</div>
            <h3 className="error-state__title">Oops!</h3>
            <p className="error-state__message">{error}</p>
            <button 
              className="error-state__retry"
              onClick={fetchPatients}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__header">
        <h1 className="app__title">Patient Registration</h1>
        <button 
          className="app__add-button"
          onClick={handleAddPatient}
        >
          + Add Patient
        </button>
      </div>

      <div className="app__content">
        {patients.length === 0 ? (
          <EmptyState 
            onAction={handleAddPatient}
          />
        ) : (
          <div className="patients-grid">
            {patients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient}
                onError={(error) => showNotification('error', error)}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="New Patient"
      >
        <PatientForm
          onSubmit={handlePatientSubmit}
          onCancel={handleModalClose}
          isLoading={isSubmitting}
        />
      </Modal>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      <ModalState
        type={modalState.type}
        message={modalState.message}
        isVisible={modalState.isVisible}
        onClose={hideModalState}
      />
    </div>
  );
}

export default App;