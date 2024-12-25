import React, { useState, useEffect } from 'react';
import SpecialistCard from '../../components/SpecialistCard/SpecialistCard';
import { specialistService } from '../../services/specialist';
import './SpecialistList.css';

const SpecialistList = () => {
  const [specialists, setSpecialists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSpecialists = async () => {
      try {
        setIsLoading(true);
        console.log('Starting to load specialists...');
        const data = await specialistService.getSpecialists();
        console.log('Received specialists:', data);
        setSpecialists(data);
      } catch (err) {
        console.error('Error loading specialists:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSpecialists();
  }, []);

  console.log('Current state:', { isLoading, error, specialists });

  if (isLoading) {
    return <div className="loading">Loading specialists...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!specialists || specialists.length === 0) {
    return <div className="error">No specialists found</div>;
  }

  return (
    <div className="specialist-list-container">
      <div className="specialist-list">
        {specialists.map(specialist => (
          <SpecialistCard 
            key={specialist.id} 
            specialist={specialist} 
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialistList; 