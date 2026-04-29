// Simple rule-based recommendation engine
export function generateRecommendations(profile) {
  const { degree = '', skills = [], interests = [] } = profile || {};
  const recommendations = [];
  const skillGaps = { technical: [], soft: [] };

  if (degree.toLowerCase().includes('it') || degree.toLowerCase().includes('computer')) {
    if (skills.includes('Programming') && interests.includes('Artificial Intelligence')) {
      recommendations.push('Software Engineer', 'Data Scientist', 'AI Engineer');
      skillGaps.technical.push('Machine Learning', 'Statistics');
      skillGaps.soft.push('Collaboration', 'Communication');
    } else if (skills.includes('Networking')) {
      recommendations.push('Network Engineer', 'Cybersecurity Analyst');
      skillGaps.technical.push('Security Fundamentals');
    } else {
      recommendations.push('Software Engineer');
      skillGaps.technical.push('Programming');
    }
  }

  if (interests.includes('Finance') || degree.toLowerCase().includes('commerce')) {
    recommendations.push('Data Analyst', 'Business Analyst');
    skillGaps.technical.push('SQL', 'Excel');
  }

  // Remove duplicates
  const unique = Array.from(new Set(recommendations));

  return {
    careers: unique,
    skillGaps,
    salaryRange: 'LKR 50,000 - 250,000',
    marketDemand: 'Moderate - High',
    internships: ['Local tech internships', 'Research assistant roles'],
    certifications: ['Coursera Specializations', 'Google Certificates'],
    learningRoadmap: ['Core programming', 'Databases', 'Projects']
  };
}
