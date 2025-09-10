import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const patientAPI = {
  // Get all patients
  getAllPatients: async () => {
    try {
      const response = await api.get('/patients');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patients');
    }
  },

  // Get patient by ID
  getPatientById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch patient');
    }
  },

  // Register new patient
  registerPatient: async (patientData) => {
    try {
      const formData = new FormData();
      formData.append('fullName', patientData.fullName);
      formData.append('email', patientData.email);
      formData.append('phone', patientData.phone);
      formData.append('documentPhoto', patientData.documentPhoto);

      const response = await api.post('/patients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error('This email is already registered. Please use a different email address.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid data. Please check the information entered.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to register patient. Please try again.');
      }
    }
  },

  // Get document photo URL
  getDocumentPhotoUrl: (filename) => {
    return `${API_BASE_URL}/patients/documents/${filename}`;
  },
};

export default api;