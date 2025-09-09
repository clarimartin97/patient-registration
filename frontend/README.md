# Patient Registration Frontend

A React frontend application for patient registration with a clean, modern interface built from scratch using vanilla CSS and React hooks.

## Features

- **Patient List**: Display patients in an expandable card layout
- **Patient Registration**: Modal form with comprehensive validation
- **File Upload**: Drag & drop interface for document photos (JPG only)
- **Real-time Validation**: Form validation with animated error messages
- **Responsive Design**: Mobile-first design that works on all devices
- **Loading States**: Smooth loading indicators and empty states
- **Notifications**: Toast notifications for success/error feedback
- **Clean UI**: Custom-built components without heavy UI frameworks

## Components

### Core Components
- **App**: Main application container with state management
- **PatientCard**: Expandable patient information cards
- **Modal**: Reusable modal component with backdrop
- **PatientForm**: Registration form with validation
- **FileUpload**: Drag & drop file upload with preview

### Utility Components
- **LoadingState**: Loading spinner with customizable message
- **EmptyState**: Empty state with call-to-action
- **Notification**: Toast notifications for user feedback

## Form Validation

### Full Name
- Only letters and spaces allowed
- Minimum 2 characters, maximum 100 characters
- Real-time validation with error messages

### Email
- Must be a valid Gmail address (@gmail.com)
- Real-time validation with error messages

### Phone Number
- Split into country code selector and number input
- Country code dropdown with 50+ countries
- Number validation (4-14 digits)
- Real-time validation with error messages

### Document Photo
- Drag & drop interface
- Only JPG files accepted
- Maximum file size: 5MB
- Visual feedback for drag states

## API Integration

The frontend communicates with the backend API through the `api.js` service:

- `GET /api/patients` - Fetch all patients
- `POST /api/patients` - Register new patient
- `GET /api/patients/:id` - Get patient by ID
- `GET /api/patients/documents/:filename` - Serve document photos

## Styling

- **Vanilla CSS**: No CSS frameworks, custom styling
- **CSS Modules**: Component-scoped styles
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Focus states and ARIA labels

## State Management

- **React Hooks**: useState, useEffect for local state
- **API State**: Loading, error, and success states
- **Form State**: Controlled components with validation
- **Modal State**: Open/close state management

## Error Handling

- **API Errors**: Graceful error handling with user feedback
- **Validation Errors**: Real-time form validation
- **Network Errors**: Retry mechanisms and fallback states
- **File Upload Errors**: Clear error messages for file issues

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: > 768px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:4000/api
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── EmptyState/
│   │   ├── FileUpload/
│   │   ├── LoadingState/
│   │   ├── Modal/
│   │   ├── Notification/
│   │   ├── PatientCard/
│   │   └── PatientForm/
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
├── Dockerfile
└── README.md
```

## Key Features Implementation

### Drag & Drop File Upload
- Uses `react-dropzone` for file handling
- Visual feedback for drag states
- File type and size validation
- Error handling with user-friendly messages

### Form Validation
- Real-time validation on blur
- Custom validation rules
- Animated error messages
- Prevents submission with invalid data

### Responsive Design
- CSS Grid for patient cards layout
- Flexbox for component layouts
- Mobile-first media queries
- Touch-friendly interface

### Accessibility
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly

## Performance Optimizations

- **Lazy Loading**: Components loaded as needed
- **Memoization**: React.memo for expensive components
- **Image Optimization**: Proper image loading states
- **Bundle Size**: Minimal dependencies

## Security Considerations

- **Input Sanitization**: Client-side validation
- **File Type Validation**: Strict file type checking
- **XSS Prevention**: Proper data handling
- **CSRF Protection**: API token handling