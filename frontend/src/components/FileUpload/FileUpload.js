import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, error, disabled }) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-invalid-type') {
        onFileSelect(null, 'Only JPG files are allowed');
      } else if (rejection.errors[0]?.code === 'file-too-large') {
        onFileSelect(null, 'File size must be less than 5MB');
      } else {
        onFileSelect(null, 'Invalid file');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0], null);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled
  });

  const getDropzoneClassName = () => {
    let className = 'file-upload-zone';
    if (isDragActive && !isDragReject) className += ' file-upload-zone--active';
    if (isDragReject) className += ' file-upload-zone--reject';
    if (error) className += ' file-upload-zone--error';
    if (disabled) className += ' file-upload-zone--disabled';
    return className;
  };

  return (
    <div className="file-upload-container">
      <div {...getRootProps()} className={getDropzoneClassName()}>
        <input {...getInputProps()} />
        <div className="file-upload-content">
          <div className="file-upload-icon">
            📷
          </div>
          <div className="file-upload-text">
            {isDragActive ? (
              isDragReject ? (
                <span className="file-upload-text--error">Only JPG files are allowed</span>
              ) : (
                <span>Drop the file here...</span>
              )
            ) : (
              <>
                <span className="file-upload-text--primary">
                  Drag & drop your document photo here
                </span>
                <span className="file-upload-text--secondary">
                  or click to browse
                </span>
                <span className="file-upload-text--hint">
                  Only JPG files, max 5MB
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="file-upload-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;