import { specialists } from '../data/specialists';

export const specialistService = {
  async getSpecialists() {
    try {
      // Return local data with a simulated delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(specialists);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching specialists:', error);
      throw error;
    }
  },

  async getSpecialistById(id) {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const specialist = specialists.find(s => s.id === Number(id));
          if (specialist) {
            resolve(specialist);
          } else {
            reject(new Error('Specialist not found'));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching specialist:', error);
      throw error;
    }
  }
}; 