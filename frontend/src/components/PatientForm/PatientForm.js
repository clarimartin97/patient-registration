import React, { useState } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import './PatientForm.css';

const PatientForm = ({ onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+1',
    phoneNumber: '',
  });
  
  const [errors, setErrors] = useState({});
  const [documentPhoto, setDocumentPhoto] = useState(null);
  const [documentPhotoError, setDocumentPhotoError] = useState('');

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Full name must contain only letters and spaces';
        } else if (value.trim().length < 2) {
          error = 'Full name must be at least 2 characters long';
        } else if (value.trim().length > 100) {
          error = 'Full name must not exceed 100 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@gmail\.com$/.test(value)) {
          error = 'Email must be a valid Gmail address (@gmail.com)';
        }
        break;

      case 'phoneNumber':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\d{4,14}$/.test(value)) {
          error = 'Phone number must be 4-14 digits';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileSelect = (file, error) => {
    setDocumentPhoto(file);
    setDocumentPhotoError(error || '');
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate document photo
    if (!documentPhoto) {
      setDocumentPhotoError('Document photo is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && documentPhoto && !documentPhotoError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const phone = formData.countryCode + formData.phoneNumber;
      onSubmit({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone,
        documentPhoto
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      <div className="form-group">
        <label htmlFor="fullName" className="form-label">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
          placeholder="Enter full name (letters only)"
          disabled={isLoading}
        />
        {errors.fullName && (
          <div className="form-error">
            {errors.fullName}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`form-input ${errors.email ? 'form-input--error' : ''}`}
          placeholder="example@gmail.com"
          disabled={isLoading}
        />
        {errors.email && (
          <div className="form-error">
            {errors.email}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Phone Number *
        </label>
        <div className="phone-input-group">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleInputChange}
            className="form-select"
            disabled={isLoading}
          >
            <option value="+1">+1 (US/CA)</option>
            <option value="+52">+52 (MX)</option>
            <option value="+34">+34 (ES)</option>
            <option value="+33">+33 (FR)</option>
            <option value="+49">+49 (DE)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+39">+39 (IT)</option>
            <option value="+55">+55 (BR)</option>
            <option value="+54">+54 (AR)</option>
            <option value="+56">+56 (CL)</option>
            <option value="+57">+57 (CO)</option>
            <option value="+51">+51 (PE)</option>
            <option value="+598">+598 (UY)</option>
            <option value="+595">+595 (PY)</option>
            <option value="+591">+591 (BO)</option>
            <option value="+593">+593 (EC)</option>
            <option value="+58">+58 (VE)</option>
            <option value="+86">+86 (CN)</option>
            <option value="+81">+81 (JP)</option>
            <option value="+82">+82 (KR)</option>
            <option value="+91">+91 (IN)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+64">+64 (NZ)</option>
            <option value="+27">+27 (ZA)</option>
            <option value="+20">+20 (EG)</option>
            <option value="+234">+234 (NG)</option>
            <option value="+254">+254 (KE)</option>
            <option value="+7">+7 (RU)</option>
            <option value="+90">+90 (TR)</option>
            <option value="+966">+966 (SA)</option>
            <option value="+971">+971 (AE)</option>
            <option value="+974">+974 (QA)</option>
            <option value="+965">+965 (KW)</option>
            <option value="+973">+973 (BH)</option>
            <option value="+968">+968 (OM)</option>
            <option value="+962">+962 (JO)</option>
            <option value="+961">+961 (LB)</option>
            <option value="+972">+972 (IL)</option>
            <option value="+98">+98 (IR)</option>
            <option value="+964">+964 (IQ)</option>
            <option value="+963">+963 (SY)</option>
            <option value="+961">+961 (LB)</option>
            <option value="+357">+357 (CY)</option>
            <option value="+30">+30 (GR)</option>
            <option value="+40">+40 (RO)</option>
            <option value="+48">+48 (PL)</option>
            <option value="+420">+420 (CZ)</option>
            <option value="+421">+421 (SK)</option>
            <option value="+36">+36 (HU)</option>
            <option value="+385">+385 (HR)</option>
            <option value="+386">+386 (SI)</option>
            <option value="+372">+372 (EE)</option>
            <option value="+371">+371 (LV)</option>
            <option value="+370">+370 (LT)</option>
            <option value="+358">+358 (FI)</option>
            <option value="+46">+46 (SE)</option>
            <option value="+47">+47 (NO)</option>
            <option value="+45">+45 (DK)</option>
            <option value="+31">+31 (NL)</option>
            <option value="+32">+32 (BE)</option>
            <option value="+41">+41 (CH)</option>
            <option value="+43">+43 (AT)</option>
            <option value="+351">+351 (PT)</option>
            <option value="+353">+353 (IE)</option>
            <option value="+354">+354 (IS)</option>
            <option value="+352">+352 (LU)</option>
            <option value="+377">+377 (MC)</option>
            <option value="+378">+378 (SM)</option>
            <option value="+39">+39 (VA)</option>
            <option value="+376">+376 (AD)</option>
            <option value="+423">+423 (LI)</option>
          </select>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`form-input ${errors.phoneNumber ? 'form-input--error' : ''}`}
            placeholder="1234567890"
            disabled={isLoading}
          />
        </div>
        {errors.phoneNumber && (
          <div className="form-error">
            {errors.phoneNumber}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Document Photo *
        </label>
        <FileUpload
          onFileSelect={handleFileSelect}
          error={documentPhotoError}
          disabled={isLoading}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn--secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register Patient'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;