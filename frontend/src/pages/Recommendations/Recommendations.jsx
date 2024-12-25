import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RecommendationEngine } from '../../utils/recommendationEngine';
import { specialistService } from '../../services/specialist';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleFindCoauthors = async () => {
    try {
      setLoading(true);
      setShowResults(true);
      
      // Get user profile from sessionStorage
      const userProfile = {
        scientificInterests: sessionStorage.getItem('scientificInterests') || '',
        ...JSON.parse(sessionStorage.getItem('profileInfo') || '{}')
      };

      if (!userProfile.scientificInterests) {
        setError('Заполните информацию о ваших научных интересах в профиле');
        return;
      }

      // Get all specialists
      const specialists = await specialistService.getSpecialists();

      // Get recommendations using our engine
      const engine = new RecommendationEngine();
      const recommendedSpecialists = engine.getRecommendations(userProfile, specialists);
      
      setRecommendations(recommendedSpecialists);
      setError(null);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Не удалось загрузить рекомендации');
    } finally {
      setLoading(false);
    }
  };

  const SpecialistCard = ({ specialist }) => {
    const matchScore = Math.round(specialist.matchScore * 100);

    return (
      <div className="specialist-card">
        <div className="match-score">
          <div className="score-circle">
            <span className="score-number">{matchScore}%</span>
            <span className="score-label">Совпадение</span>
          </div>
        </div>
        <img 
          src="https://scimatch.ru/wp-content/uploads/2024/12/default-avatar.svg"
          alt={specialist.Name} 
          className="specialist-avatar"
        />
        <div className="specialist-info">
          <h3>{specialist.Name}</h3>
          <p className="specialist-position">{specialist.Position || 'Нет данных'}</p>
          <p className="specialist-university">{specialist.University || 'Нет данных'}</p>
          
          {specialist.Description && (
            <p className="specialist-description">
              {specialist.Description.length > 150 
                ? `${specialist.Description.substring(0, 150)}...` 
                : specialist.Description}
            </p>
          )}

          {specialist.Data && (
            <div className="specialist-metrics">
              {specialist.Data.split(',').slice(0, 2).map((metric, index) => (
                <span key={index} className="metric-badge">
                  {metric.trim()}
                </span>
              ))}
            </div>
          )}

          <Link to={`/specialist/${specialist.id}`} className="view-profile-button">
            Посмотреть профиль
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Подбираем подходящих специалистов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h1>Поиск соавторов</h1>
        {!showResults && (
          <p className="recommendations-subtitle">
            Нажмите кнопку ниже, чтобы найти подходящих соавторов на основе ваших научных интересов
          </p>
        )}
      </div>

      {!showResults ? (
        <div className="find-coauthor-container">
          <button onClick={handleFindCoauthors} className="find-coauthor-button">
            Подобрать соавтора
          </button>
        </div>
      ) : (
        <>
          {error ? (
            <div className="error-state">
              <p>{error}</p>
              {error.includes('научных интересах') ? (
                <Link to="/profile" className="update-profile-button">
                  Заполнить профиль
                </Link>
              ) : (
                <button onClick={handleFindCoauthors} className="retry-button">
                  Попробовать снова
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>Рекомендуемые соавторы</h2>
                <button onClick={handleFindCoauthors} className="refresh-button">
                  Обновить результаты
                </button>
              </div>
              <div className="recommendations-grid">
                {recommendations.map(specialist => (
                  <SpecialistCard key={specialist.id} specialist={specialist} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Recommendations; 