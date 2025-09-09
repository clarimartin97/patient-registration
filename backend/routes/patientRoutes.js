const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');
const upload = require('../middleware/upload');
const { validatePatient, validateFileUpload } = require('../middleware/validation');

router.post('/', 
  upload.single('documentPhoto'),
  validateFileUpload,
  validatePatient,
  PatientController.registerPatient
);

router.get('/', PatientController.getAllPatients);

router.get('/:id', PatientController.getPatientById);

router.get('/documents/:filename', PatientController.serveDocumentPhoto);

module.exports = router;