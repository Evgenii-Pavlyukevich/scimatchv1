import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const logoUrl = 'https://scimatch.ru/wp-content/uploads/2024/12/logo.svg';

  const menuItems = [
    {
      title: 'Мои рекомендации',
      path: '/recommendations'
    },
    {
      title: 'Соавторы в активном поиске',
      path: '/specialistlist'
    },
    {
      title: 'Мой профиль',
      path: '/profile'
    }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/signin');
    closeMenu(); // Close mobile menu if open
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <img src={logoUrl} alt="Logo" className="logo" />
        </Link>

        {/* Desktop Menu */}
        <nav className="desktop-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogin} className="login-button">
          Войти
        </button>

        {/* Burger Menu Button */}
        <button className="burger-button" onClick={toggleMenu}>
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-menu-content">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {item.title}
              </Link>
            ))}
            <button onClick={handleLogin} className="mobile-login-button">
              Войти
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 