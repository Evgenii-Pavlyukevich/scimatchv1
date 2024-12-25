import React from 'react';
import './FormInput.css';

const FormInput = ({ 
  label, 
  error, 
  ...props 
}) => {
  return (
    <div className="form-input">
      {label && <label>{label}</label>}
      <input {...props} className={`input ${error ? 'input-error' : ''}`} />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default FormInput; 