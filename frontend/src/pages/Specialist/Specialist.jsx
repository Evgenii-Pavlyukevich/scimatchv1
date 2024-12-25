import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { specialistService } from '../../services/specialist';
import defaultAvatar from '../../assets/default-avatar.png';
import './Specialist.css';

const Specialist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpecialist = async () => {
      try {
        setLoading(true);
        const data = await specialistService.getSpecialistById(id);
        setSpecialist(data);
      } catch (err) {
        console.error('Error loading specialist:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSpecialist();
  }, [id]);

  const handleBack = () => {
    navigate('/specialistlist');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!specialist) return <div className="error">Specialist not found</div>;

  const parseActivities = (data) => {
    if (!data) return [];
    return data.split(',').map(item => item.trim());
  };

  const parseCoauthors = (coauthors) => {
    if (!coauthors || coauthors === 'N/A') return [];
    return coauthors.split(',').map(author => author.trim());
  };

  const displayValue = (value) => {
    return value === 'N/A' ? 'Нет данных' : value;
  };

  const formatPublication = (pub) => {
    const parts = [];
    
    if (pub.author) parts.push(pub.author);
    if (pub.title) parts.push(pub.title);
    if (pub.publisher) parts.push(pub.publisher);
    if (pub.year) parts.push(pub.year);
    if (pub.address) parts.push(pub.address);
    
    return parts.join(', ');
  };

  return (
    <div className="specialist-page">
      <button className="back-button" onClick={handleBack}>
        <span className="back-arrow">←</span>
        <span>Назад</span>
      </button>

      {/* Header Block */}
      <div className="specialist-header">
        <div className="avatar-container">
          <img src={defaultAvatar} alt={specialist.Name} className="specialist-avatar" />
        </div>
        <div className="specialist-info">
          <h1 className="specialist-name">{specialist.Name}</h1>
          <div className="specialist-affiliation">
            <div className="university-badge">
              <i className="university-icon">🏛️</i>
              <span>{displayValue(specialist.University)}</span>
            </div>
            <div className="position-label">
              {displayValue(specialist.Position)}
            </div>
          </div>
          <p className="specialist-description">
            {displayValue(specialist.Description)}
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="metrics-section">
        <h2>Результаты деятельности</h2>
        <div className="metrics-container">
          {parseActivities(specialist.Data).map((activity, index) => (
            <span key={index} className="metric-badge">
              {activity}
            </span>
          ))}
        </div>
      </section>

      {/* Coauthors Section */}
      <section className="coauthors-section">
        <h2>Соавторы</h2>
        <div className="coauthors-list">
          {specialist.Coauthors === 'N/A' ? (
            <span>Нет данных</span>
          ) : (
            parseCoauthors(specialist.Coauthors).map((author, index) => (
              <span key={index} className="coauthor-item">
                {author}
                {index < parseCoauthors(specialist.Coauthors).length - 1 && ', '}
              </span>
            ))
          )}
        </div>
      </section>

      {/* Publications Section */}
      <section className="publications-section">
        <h2>Публикации</h2>
        <div className="publications-list">
          {!specialist.Publications || specialist.Publications.length === 0 ? (
            <span>Нет данных</span>
          ) : (
            <ul>
              {specialist.Publications.map((publication, index) => (
                <li key={publication.id || index} className="publication-item">
                  <div className="publication-type">{publication.type}</div>
                  <div className="publication-content">
                    {formatPublication(publication)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Specialist; 