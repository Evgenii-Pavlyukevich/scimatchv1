import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SpecialistCard.css';

const SpecialistCard = ({ specialist }) => {
  const navigate = useNavigate();

  const parseActivities = (data) => {
    if (!data) return [];
    return data.split(',').map(item => item.trim());
  };

  const handleClick = () => {
    navigate(`/specialist/${specialist.id}`);
  };

  return (
    <div className="specialist-card" onClick={handleClick}>
      <h2 className="specialist-name">{specialist.Name}</h2>
      
      {specialist.University && specialist.University !== 'N/A' && (
        <div className="university-label">
          {specialist.University}
        </div>
      )}
      
      {specialist.Position && specialist.Position !== 'N/A' && (
        <div className="position-label">
          {specialist.Position}
        </div>
      )}
      
      {specialist.Description && specialist.Description !== 'N/A' && (
        <p className="description">
          {specialist.Description}
        </p>
      )}
      
      {specialist.Data && specialist.Data !== 'N/A' && (
        <div className="activities-section">
          <h3 className="activities-title">Результаты деятельности</h3>
          <div className="activities-list">
            {parseActivities(specialist.Data).map((activity, index) => (
              <span key={index} className="activity-label">
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistCard; 