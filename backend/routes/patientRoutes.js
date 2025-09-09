const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');
const upload = require('../middleware/upload');
const { validatePatient, validateFileUpload } = require('../middleware/validation');

// POST /patients - Register a new patient
router.post('/', 
  upload.single('documentPhoto'),
  validateFileUpload,
  validatePatient,
  PatientController.registerPatient
);

// GET /patients - Get all patients
router.get('/', PatientController.getAllPatients);

// GET /patients/:id - Get patient by ID
router.get('/:id', PatientController.getPatientById);

// GET /patients/documents/:filename - Serve document photo
router.get('/documents/:filename', PatientController.serveDocumentPhoto);

module.exports = router;