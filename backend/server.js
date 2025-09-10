require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const patientRoutes = require('./routes/patientRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const Patient = require('./models/Patient');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:3000", "http://localhost:4000"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:4000"]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, try again later.'
  }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const uploadPath = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/uploads', express.static(uploadPath));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/patients', patientRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Patient Registration API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      registerPatient: 'POST /api/patients',
      getAllPatients: 'GET /api/patients',
      getPatientById: 'GET /api/patients/:id',
      serveDocument: 'GET /api/patients/documents/:filename',
      notificationChannels: 'GET /api/notifications/channels',
      notificationConfig: 'GET /api/notifications/config',
      notificationStats: 'GET /api/notifications/stats'
    }
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});
app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 5MB.'
    });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      message: 'Too many files. Only one file is allowed.'
    });
  }
  
  if (error.message === 'Only JPG files are allowed for document photos') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

async function startServer() {
  try {
    await Patient.initTable();
    app.listen(PORT);
  } catch (error) {
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  process.exit(0);
});

process.on('SIGINT', () => {
  process.exit(0);
});

startServer();