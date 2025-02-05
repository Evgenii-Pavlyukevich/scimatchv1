/**
 * Service for fetching specialist data
 */
export const specialistService = {
  async getSpecialists() {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const specialists = await response.json();
      console.log('Loaded specialists:', specialists.length);
      return specialists;
    } catch (error) {
      console.error('Error fetching specialists:', error);
      throw new Error('Failed to load specialists data');
    }
  },

  async getSpecialistById(id) {
    try {
      const specialists = await this.getSpecialists();
      const specialist = specialists.find(s => s.id === Number(id));
      if (!specialist) {
        throw new Error(`Specialist with id ${id} not found`);
      }
      console.log('Loaded specialist:', specialist.id, 'Publications:', specialist.Publications?.length);
      return specialist;
    } catch (error) {
      console.error('Error fetching specialist:', error);
      throw error;
    }
  }
}; 
