import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [scientificInterests, setScientificInterests] = useState('');
  const [savedInterests, setSavedInterests] = useState('');
  const [profileInfo, setProfileInfo] = useState({
    position: 'Научный сотрудник',
    department: 'Кафедра аналитической химии',
    university: 'МГУ имени М.В. Ломоносова',
    email: 'ivan.ivanov@university.ru',
    office: '415'
  });

  const defaultAvatar = 'https://scimatch.ru/wp-content/uploads/2024/12/default-avatar.svg';

  // Load saved data from sessionStorage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('scientificInterests');
    const savedProfileInfo = sessionStorage.getItem('profileInfo');
    
    if (savedData) {
      setSavedInterests(savedData);
    }
    if (savedProfileInfo) {
      setProfileInfo(JSON.parse(savedProfileInfo));
    }
  }, []);

  const handleSaveInterests = () => {
    setSavedInterests(scientificInterests);
    setIsEditingInterests(false);
    sessionStorage.setItem('scientificInterests', scientificInterests);
  };

  const handleEditInterests = () => {
    setScientificInterests(savedInterests);
    setIsEditingInterests(true);
  };

  const handleSaveInfo = () => {
    setIsEditingInfo(false);
    sessionStorage.setItem('profileInfo', JSON.stringify(profileInfo));
  };

  const handleEditInfo = () => {
    setIsEditingInfo(true);
  };

  const handleInfoChange = (field, value) => {
    setProfileInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img src={defaultAvatar} alt="Фото профиля" className="profile-avatar" />
          <button className="change-avatar-button">Изменить фото</button>
        </div>
        <div className="profile-info">
          <div className="profile-info-header">
            <h1>Иван Иванов</h1>
            <button 
              className={`action-button ${isEditingInfo ? 'save-button' : 'edit-button'}`}
              onClick={isEditingInfo ? handleSaveInfo : handleEditInfo}
            >
              {isEditingInfo ? 'Сохранить' : 'Редактировать'}
            </button>
          </div>
          
          {isEditingInfo ? (
            <div className="edit-info-container">
              <div className="input-group">
                <label>Должность:</label>
                <input
                  type="text"
                  className="edit-input"
                  value={profileInfo.position}
                  onChange={(e) => handleInfoChange('position', e.target.value)}
                  placeholder="Должность"
                />
              </div>
              <div className="input-group">
                <label>Кафедра:</label>
                <input
                  type="text"
                  className="edit-input"
                  value={profileInfo.department}
                  onChange={(e) => handleInfoChange('department', e.target.value)}
                  placeholder="Кафедра"
                />
              </div>
              <div className="input-group">
                <label>Университет:</label>
                <input
                  type="text"
                  className="edit-input"
                  value={profileInfo.university}
                  onChange={(e) => handleInfoChange('university', e.target.value)}
                  placeholder="Университет"
                />
              </div>
            </div>
          ) : (
            <div className="profile-info-display">
              <p className="profile-title">{profileInfo.position}</p>
              <p className="profile-department">{profileInfo.department}</p>
              <p className="profile-university">{profileInfo.university}</p>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <section className="scientific-interests-section">
          <div className="section-header">
            <h2>Научные интересы</h2>
            <button 
              className={`action-button ${isEditingInterests ? 'save-button' : 'edit-button'}`}
              onClick={isEditingInterests ? handleSaveInterests : handleEditInterests}
            >
              {isEditingInterests ? 'Сохранить' : 'Редактировать'}
            </button>
          </div>

          {isEditingInterests ? (
            <textarea
              className="interests-textarea"
              value={scientificInterests}
              onChange={(e) => setScientificInterests(e.target.value)}
              placeholder="Опишите ваши научные интересы, достижения и публикации..."
              rows={10}
            />
          ) : (
            <div className="interests-display">
              {savedInterests || 'Научные интересы пока не указаны'}
            </div>
          )}
        </section>

        <section className="additional-info">
          <div className="section-header">
            <h2>Контактная информация</h2>
            <button 
              className={`action-button ${isEditingInfo ? 'save-button' : 'edit-button'}`}
              onClick={isEditingInfo ? handleSaveInfo : handleEditInfo}
            >
              {isEditingInfo ? 'Сохранить' : 'Редактировать'}
            </button>
          </div>
          
          {isEditingInfo ? (
            <div className="edit-contact-info">
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="edit-input"
                  value={profileInfo.email}
                  onChange={(e) => handleInfoChange('email', e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="input-group">
                <label>Кабинет:</label>
                <input
                  type="text"
                  className="edit-input"
                  value={profileInfo.office}
                  onChange={(e) => handleInfoChange('office', e.target.value)}
                  placeholder="Номер кабинета"
                />
              </div>
            </div>
          ) : (
            <div className="contact-info">
              <p><strong>Email:</strong> {profileInfo.email}</p>
              <p><strong>Кабинет:</strong> {profileInfo.office}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile; 