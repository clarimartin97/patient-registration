const Patient = require('../models/Patient');
const EmailService = require('../services/emailService');
const path = require('path');

class PatientController {
  static async registerPatient(req, res) {
    try {
      const { fullName, email, phone } = req.body;
      const documentPhoto = req.file;

      const existingPatient = await Patient.findByEmail(email);
      if (existingPatient) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists. Please use a different email address.'
        });
      }

      const patientData = {
        fullName,
        email,
        phone,
        documentPhoto: documentPhoto.filename
      };

      const newPatient = await Patient.create(patientData);

      try {
        await EmailService.sendConfirmationEmail({
          fullName,
          email,
          id: newPatient.id
        });
      } catch (emailError) {
        // Don't fail the registration if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        data: {
          id: newPatient.id,
          fullName: newPatient.full_name,
          email: newPatient.email,
          phone: newPatient.phone,
          createdAt: newPatient.created_at
        }
      });

    } catch (error) {
      try {
        await EmailService.sendErrorNotification(error, req.body);
      } catch (emailError) {
        // Silent fail for error notification
      }

      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Email already exists. Please use a different email address.'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.'
      });
    }
  }

  static async getAllPatients(req, res) {
    try {
      const patients = await Patient.getAll();
      
      res.status(200).json({
        success: true,
        message: 'Patients retrieved successfully',
        data: patients.map(patient => ({
          id: patient.id,
          fullName: patient.full_name,
          email: patient.email,
          phone: patient.phone,
          createdAt: patient.created_at
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.'
      });
    }
  }

  static async getPatientById(req, res) {
    try {
      const { id } = req.params;
      const patient = await Patient.findById(id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Patient retrieved successfully',
        data: {
          id: patient.id,
          fullName: patient.full_name,
          email: patient.email,
          phone: patient.phone,
          documentPhoto: patient.document_photo,
          createdAt: patient.created_at
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.'
      });
    }
  }

  static async serveDocumentPhoto(req, res) {
    try {
      const { filename } = req.params;
      const uploadPath = process.env.UPLOAD_PATH || './uploads';
      const filePath = path.join(uploadPath, filename);

      const fs = require('fs');
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'Document photo not found'
        });
      }

      res.sendFile(path.resolve(filePath));
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.'
      });
    }
  }
}

module.exports = PatientController;