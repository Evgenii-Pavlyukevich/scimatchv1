const API_BASE_URL = 'https://api.scimatch.ru'; // or whatever your cloud backend URL is

export const specialistService = {
  async getSpecialists() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/specialists`);
      if (!response.ok) {
        throw new Error('Failed to fetch specialists');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching specialists:', error);
      throw error;
    }
  },

  async getSpecialistById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/specialists/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch specialist');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching specialist:', error);
      throw error;
    }
  }
}; 