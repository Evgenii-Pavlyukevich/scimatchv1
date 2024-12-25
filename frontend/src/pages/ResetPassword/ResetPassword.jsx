import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import { authService } from '../../services/auth';
import './ResetPassword.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Введите email');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      setSuccess(true);
      setError('');
    } catch (err) {
      setError('Не удалось отправить код сброса пароля. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h1>Восстановление пароля</h1>
        
        {success ? (
          <div className="success-message">
            <p>Инструкции по сбросу пароля отправлены на ваш email.</p>
            <Link to="/signin" className="back-to-signin">
              Вернуться к входу
            </Link>
          </div>
        ) : (
          <>
            <p className="instruction-text">
              Введите ваш email для получения инструкций по сбросу пароля
            </p>

            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={error}
            />

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Отправка...' : 'Отправить'}
            </button>

            <div className="links-container">
              <Link to="/signin" className="back-link">
                Вернуться к входу
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword; 