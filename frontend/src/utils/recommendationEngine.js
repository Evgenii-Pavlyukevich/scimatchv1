/**
 * Recommendation engine for finding matching specialists
 */
export class RecommendationEngine {
  constructor() {
    this.tfidfVectorizer = new TFIDFVectorizer();
  }

  /**
   * Calculate recommendations based on user profile and available specialists
   */
  getRecommendations(userProfile, specialists, topN = 5) {
    try {
      // Extract features from user profile
      const userFeatures = this.extractFeatures(userProfile);
      
      // Calculate scores for each specialist
      const scoredSpecialists = specialists.map(specialist => {
        const score = this.calculateMatchScore(userFeatures, specialist);
        return { ...specialist, matchScore: score };
      });

      // Sort by score and return top N recommendations
      return scoredSpecialists
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, topN);
    } catch (error) {
      console.error('Error in getRecommendations:', error);
      return [];
    }
  }

  /**
   * Extract relevant features from profile
   */
  extractFeatures(profile) {
    return {
      interests: this.tfidfVectorizer.fitTransform(profile.scientificInterests || ''),
      university: profile.university || '',
      department: profile.department || '',
      publications: profile.publications || []
    };
  }

  /**
   * Calculate match score between user and specialist
   */
  calculateMatchScore(userFeatures, specialist) {
    const weights = {
      interestsSimilarity: 0.4,
      institutionalMatch: 0.2,
      departmentMatch: 0.2,
      publicationOverlap: 0.2
    };

    // Calculate content similarity using TF-IDF
    const interestsSimilarity = this.tfidfVectorizer.calculateSimilarity(
      userFeatures.interests,
      specialist.Description || ''
    );

    // Calculate institutional match
    const institutionalMatch = this.calculateInstitutionalMatch(
      userFeatures.university,
      specialist.University
    );

    // Calculate department match
    const departmentMatch = this.calculateDepartmentMatch(
      userFeatures.department,
      specialist.Position
    );

    // Calculate publication overlap
    const publicationOverlap = this.calculatePublicationOverlap(
      userFeatures.publications,
      specialist.Publications || []
    );

    // Calculate weighted score
    return (
      weights.interestsSimilarity * interestsSimilarity +
      weights.institutionalMatch * institutionalMatch +
      weights.departmentMatch * departmentMatch +
      weights.publicationOverlap * publicationOverlap
    );
  }

  /**
   * Calculate similarity between institutions
   */
  calculateInstitutionalMatch(userUniversity, specialistUniversity) {
    if (!userUniversity || !specialistUniversity) return 0;
    return userUniversity.toLowerCase() === specialistUniversity.toLowerCase() ? 1 : 0;
  }

  /**
   * Calculate similarity between departments
   */
  calculateDepartmentMatch(userDepartment, specialistDepartment) {
    if (!userDepartment || !specialistDepartment) return 0;
    
    const userWords = new Set(userDepartment.toLowerCase().split(' '));
    const specialistWords = new Set(specialistDepartment.toLowerCase().split(' '));
    
    const intersection = new Set([...userWords].filter(x => specialistWords.has(x)));
    const union = new Set([...userWords, ...specialistWords]);
    
    return intersection.size / union.size;
  }

  /**
   * Calculate publication overlap
   */
  calculatePublicationOverlap(userPublications, specialistPublications) {
    if (!userPublications.length || !specialistPublications.length) return 0;
    
    const userKeywords = this.extractKeywords(userPublications);
    const specialistKeywords = this.extractKeywords(specialistPublications);
    
    const intersection = new Set([...userKeywords].filter(x => specialistKeywords.has(x)));
    const union = new Set([...userKeywords, ...specialistKeywords]);
    
    return intersection.size / union.size;
  }

  /**
   * Extract keywords from publications
   */
  extractKeywords(publications) {
    const keywords = new Set();
    publications.forEach(pub => {
      if (pub.title) {
        pub.title.toLowerCase().split(' ').forEach(word => {
          if (word.length > 3) keywords.add(word);
        });
      }
    });
    return keywords;
  }
}

/**
 * TF-IDF Vectorizer for text similarity
 */
class TFIDFVectorizer {
  constructor() {
    this.vocabulary = new Map();
    this.idf = new Map();
  }

  fitTransform(text) {
    const words = text.toLowerCase().split(/\W+/);
    const wordCount = new Map();
    
    // Calculate term frequency
    words.forEach(word => {
      if (word.length < 3) return;
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
      this.vocabulary.set(word, true);
    });
    
    // Calculate TF-IDF vector
    const vector = {};
    wordCount.forEach((count, word) => {
      const tf = count / words.length;
      const idf = Math.log(1 + 1 / (this.idf.get(word) || 1));
      vector[word] = tf * idf;
    });
    
    return vector;
  }

  calculateSimilarity(vector1, text2) {
    const vector2 = this.fitTransform(text2);
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    Object.keys(vector1).forEach(key => {
      dotProduct += (vector1[key] || 0) * (vector2[key] || 0);
      norm1 += vector1[key] * vector1[key];
    });
    
    Object.keys(vector2).forEach(key => {
      norm2 += vector2[key] * vector2[key];
    });
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
} 