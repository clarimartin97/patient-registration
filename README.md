# Patient Registration App

## Technologies 

- **Frontend:** React
- **Backend:** Node.js with Express
- **Database:** PostgreSQL
- **Containers:** Docker
- **Test Email Service:** Mailtrap

## Structure

### Backend

- API to register patients with:
  - Full name
  - Email
  - Phone number
  - Document photo
- Validations:
  - Required fields
  - Unique emails
- Stores everything in PostgreSQL
- Sends a confirmation email using Mailtrap
- Fully set up and ready to run with Docker

### Frontend

- Main screen with expandable patient cards:
  - Initial view: name and document photo
  - Expanded view: full info
- Form to add patients:
  - Full name (letters only)
  - Email (only @gmail.com addresses)
  - Phone with country code + number
  - Document photo (.jpg, drag & drop)
- Field validation with animated messages
- Animated modal to show:
  - Errors
  - Success
- Patient list updates automatically after adding a new patient


## How to Run

First, clone the repo:

git clone https://github.com/clarimartin97/patient-registration.git
cd patient-registration

Then start the services using Docker:
docker-compose up -d --build


The app is available at:
Frontend: http://localhost:3000
Backend: http://localhost:4000
