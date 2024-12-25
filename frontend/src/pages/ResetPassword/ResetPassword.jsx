import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import { authService } from '../../services/auth';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Invalid email format' });
      return false;
    }
    return true;
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      setStep(2);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      setErrors({ code: 'Требуется код верификации' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyResetCode(email, code);
      navigate('/signin');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <form 
        onSubmit={step === 1 ? handleRequestCode : handleVerifyCode} 
        className="reset-password-form"
      >
        <h1>Сброс пароля</h1>
        
        {step === 1 ? (
          <>
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              error={errors.email}
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Отправить код'}
            </button>
          </>
        ) : (
          <>
            <p className="verification-message">
              Пожалуйста, введите код верификации, отправленный на {email}
            </p>
            <FormInput
              label="Код верификации"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErrors({});
              }}
              error={errors.code}
            />
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Верификация...' : 'Верифицировать код'}
            </button>
          </>
        )}

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <p className="signin-link">
          Вспомнили пароль? <a href="/signin">Войти</a>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword; 