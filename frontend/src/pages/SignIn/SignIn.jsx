import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import { authService } from '../../services/auth';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.signIn(formData);
      
      if (response.status === 200) {
        localStorage.setItem('token', response.access_token);
        
        // Navigate to specialist list after successful login
        navigate('/specialistlist');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Signin error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Invalid credentials. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h1>Sign In</h1>
        
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="links-container">
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
          <p className="reset-link">
            <a href="/reset-password">Forgot Password?</a>
          </p>
        </div>
      </form>
      
      {/* Temporary link for testing */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/specialistlist')}
          style={{ padding: '10px', cursor: 'pointer' }}
        >
          View Specialists List
        </button>
      </div>
    </div>
  );
};

export default SignIn; 