import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Введите пароль';
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
        navigate('/specialistlist');
      } else {
        throw new Error('Ошибка аутентификации');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Неверные учетные данные. Попробуйте снова.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h1>Вход в систему</h1>
        
        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <FormInput
          label="Пароль"
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
          {isLoading ? 'Выполняется вход...' : 'Войти'}
        </button>

        <div className="links-container">
          <Link to="/signup" className="signup-link">
            Зарегистрироваться
          </Link>
          <Link to="/reset-password" className="reset-link">
            Забыли пароль?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignIn; 