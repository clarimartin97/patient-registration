# Patient Registration Backend

A Node.js backend API for patient registration with Express, PostgreSQL, and email confirmation.

## Features

- **Patient Registration**: Register patients with full name, email, phone, and document photo
- **Data Validation**: Comprehensive validation for all input fields
- **File Upload**: Secure document photo upload (JPG only)
- **Email Confirmation**: Automatic confirmation emails via Mailtrap
- **Database Storage**: PostgreSQL for reliable data persistence
- **Security**: Helmet, CORS, rate limiting, and input sanitization
- **Docker Support**: Containerized application with Docker Compose

## API Endpoints

### POST /api/patients
Register a new patient.

**Request Body (multipart/form-data):**
- `fullName` (string): Patient's full name (letters and spaces only)
- `email` (string): Gmail address only (@gmail.com)
- `phone` (string): Phone number with country code (e.g., +1234567890)
- `documentPhoto` (file): JPG image file (max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Patient registered successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@gmail.com",
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### GET /api/patients
Get all registered patients.

### GET /api/patients/:id
Get a specific patient by ID.

### GET /api/patients/documents/:filename
Serve document photos.

### GET /health
Health check endpoint.

## Validation Rules

- **Full Name**: Only letters and spaces, 2-100 characters
- **Email**: Must be a valid Gmail address (@gmail.com)
- **Phone**: Must include country code, 5-15 digits total
- **Document Photo**: JPG files only, maximum 5MB

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgres://postgres:password@localhost:5432/patientsdb

# Server Configuration
PORT=4000
NODE_ENV=development

# Email Configuration (Mailtrap)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
FROM_EMAIL=noreply@patientregistration.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Update Mailtrap credentials
   - Adjust database URL if needed

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
backend/
├── config/
│   ├── database.js      # PostgreSQL connection
│   └── email.js         # Email service configuration
├── controllers/
│   └── patientController.js  # Patient API logic
├── middleware/
│   ├── upload.js        # File upload handling
│   └── validation.js    # Input validation
├── models/
│   └── Patient.js       # Database model
├── routes/
│   └── patientRoutes.js # API routes
├── services/
│   └── emailService.js  # Email sending logic
├── uploads/             # Document photos storage
├── server.js           # Main application file
├── package.json        # Dependencies and scripts
└── Dockerfile          # Container configuration
```

## Email Configuration

This application uses Mailtrap for development email testing:

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Create a new inbox
3. Copy the SMTP credentials to your `.env` file
4. All confirmation emails will be sent to your Mailtrap inbox

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **File Type Validation**: Only JPG files allowed
- **File Size Limits**: Maximum 5MB per file

## Error Handling

- Comprehensive error handling with appropriate HTTP status codes
- Detailed error messages for validation failures
- Email notifications for system errors
- Graceful handling of email service failures

## Development

- **Nodemon**: Automatic server restart on file changes
- **Environment-based configuration**: Development and production settings
- **Logging**: Console logging for debugging and monitoring
- **Health checks**: Built-in health monitoring endpoint