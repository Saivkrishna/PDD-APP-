/**
 * backend/services/ats/scoringEngine.js
 * Rule-based scoring engine for calculating the CareerPath AI ATS Compatibility Score
 * and sub-scores based on configurable weights and thresholds.
 */

const fs = require('fs');
const path = require('path');
const { checkFormatting } = require('./formattingChecker');

// Load weights safely
let config = {
  weights: {
    keywordMatch: 0.25,
    technicalSkills: 0.20,
    experienceRelevance: 0.15,
    projectRelevance: 0.10,
    resumeStructure: 0.10,
    education: 0.05,
    certifications: 0.05,
    achievements: 0.05,
    atsFormatting: 0.05
  },
  thresholds: {
    strong: 80,
    good: 65,
    potential: 50
  }
};

try {
  const fileContent = fs.readFileSync(path.join(__dirname, 'scoringWeights.json'), 'utf8');
  config = JSON.parse(fileContent);
} catch (err) {
  console.error('[Scoring Engine] Failed to load weights configuration:', err.message);
}

/**
 * Calculates CareerPath AI ATS Compatibility Score and sub-scores.
 * @param {Object} resumeSections - Extracted sections from resume.
 * @param {Object} parsedJd - Extracted data from JD.
 * @param {Array} matchedSkills - Matched skills list from skillMatcher.
 * @param {Array} missingSkills - Missing skills list from skillMatcher.
 * @returns {Object} Score details and breakdown.
 */
function calculateScore(resumeSections, parsedJd, matchedSkills = [], missingSkills = []) {
  const fullResumeText = Object.values(resumeSections || {}).join('\n').toLowerCase();
  
  // 1. Keyword Match (25%)
  const jdKeywords = parsedJd.keywords || [];
  const matchedKeywordsCount = jdKeywords.filter(kw => {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return new RegExp(`\\b${escapedKw}\\b`, 'i').test(fullResumeText);
  }).length;
  const keywordMatch = jdKeywords.length > 0 ? (matchedKeywordsCount / jdKeywords.length) * 100 : 100;

  // 2. Technical Skills (20%)
  const jdTechSkills = parsedJd.technicalSkills || [];
  const matchedTechCount = matchedSkills.filter(s => 
    s.category !== 'optional' && 
    s.matchType !== 'related-not-matched' && 
    jdTechSkills.includes(s.skill)
  ).length;
  const technicalSkills = jdTechSkills.length > 0 ? (matchedTechCount / jdTechSkills.length) * 100 : 100;

  // 3. Experience Relevance (15%)
  // A. Years of experience check
  let resumeYears = 0;
  const expRegexes = [
    /(\d+)\+?\s*years?(?:\s*of)?\s*experience/i,
    /minimum\s+(?:of\s+)?(\d+)\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i,
    /(\d+)\s*-\s*(\d+)\s*years?/i,
    /(\d+)\+?\s*years?/i,
    /(\d+)\s*yrs?/i
  ];

  for (const regex of expRegexes) {
    const matches = fullResumeText.match(new RegExp(regex, 'gi'));
    if (matches) {
      for (const match of matches) {
        const numbers = match.match(/\d+/g);
        if (numbers) {
          const val = parseInt(numbers[0], 10);
          if (val > resumeYears && val < 20) {
            resumeYears = val;
          }
        }
      }
    }
  }

  const jdYears = parsedJd.experienceYears || 0;
  let experienceYearsScore = 100;
  if (jdYears > 0) {
    experienceYearsScore = resumeYears >= jdYears ? 100 : (resumeYears / jdYears) * 100;
  }

  // B. Title/Role matching (simple case-insensitive token overlap check in EXPERIENCE section)
  const experienceText = (resumeSections.EXPERIENCE || '').toLowerCase();
  const titleWords = (parsedJd.jobTitle || '').toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const titleOverlapCount = titleWords.filter(w => experienceText.includes(w)).length;
  const titleOverlapScore = titleWords.length > 0 ? (titleOverlapCount / titleWords.length) * 100 : 100;

  const experienceRelevance = (experienceYearsScore * 0.6) + (titleOverlapScore * 0.4);

  // 4. Project Relevance (10%)
  const projectsText = (resumeSections.PROJECTS || '').toLowerCase();
  const allJdSkills = [...(parsedJd.requiredSkills || []), ...(parsedJd.preferredSkills || [])];
  const matchedProjectSkillsCount = allJdSkills.filter(s => projectsText.includes(s.toLowerCase())).length;
  const projectRelevance = allJdSkills.length > 0 ? (matchedProjectSkillsCount / allJdSkills.length) * 100 : 100;

  // 5. Resume Structure (10%)
  const expectedSections = ['SUMMARY', 'SKILLS', 'EXPERIENCE', 'PROJECTS', 'EDUCATION'];
  const presentSectionsCount = expectedSections.filter(s => (resumeSections[s] || '').trim().length > 20).length;
  const resumeStructure = (presentSectionsCount / expectedSections.length) * 100;

  // 6. Education (5%)
  let educationScore = 100; // default
  const jdEducation = parsedJd.education || [];
  const educationText = (resumeSections.EDUCATION || '').toLowerCase();

  const hasPhD = /phd|ph\.d\./i.test(educationText);
  const hasMasters = /master|m\.s\.|ms\s/i.test(educationText);
  const hasBachelors = /bachelor|b\.s\.|bs\s|degree\s+in\s+computer\s+science/i.test(educationText);

  if (jdEducation.includes("PhD")) {
    educationScore = hasPhD ? 100 : hasMasters ? 75 : hasBachelors ? 50 : 30;
  } else if (jdEducation.includes("Master's Degree")) {
    educationScore = (hasPhD || hasMasters) ? 100 : hasBachelors ? 75 : 40;
  } else if (jdEducation.includes("Bachelor's Degree")) {
    educationScore = (hasPhD || hasMasters || hasBachelors) ? 100 : 50;
  }

  // 7. Certifications (5%)
  const jdCerts = parsedJd.certifications || [];
  const certsText = ((resumeSections.CERTIFICATIONS || '') + ' ' + (resumeSections.SKILLS || '')).toLowerCase();
  const matchedCertsCount = jdCerts.filter(c => certsText.includes(c.toLowerCase())).length;
  const certifications = jdCerts.length > 0 ? (matchedCertsCount / jdCerts.length) * 100 : 100;

  // 8. Achievements/Impact (5%)
  // Count sentences with action metrics (percent, dollar, counts) in achievements or experience
  const achievementsText = ((resumeSections.ACHIEVEMENTS || '') + '\n' + (resumeSections.EXPERIENCE || '')).toLowerCase();
  const achievementSentences = achievementsText.split(/[.\n]+/).map(s => s.trim()).filter(Boolean);
  
  const metricRegex = /(?:\d+%\s*|\$\s*\d+|\d+\s*(?:million|billion|thousand|users|leads|clients|projects|servers|hours|days|weeks|months|years|percent))/i;
  const actionVerbRegex = /(?:increase|decrease|improve|save|grow|lead|develop|implement|manage|optimize|reduce|achieve|deliver|solve)/i;

  let metricsCount = 0;
  for (const sentence of achievementSentences) {
    if (metricRegex.test(sentence) && actionVerbRegex.test(sentence)) {
      metricsCount++;
    }
  }

  const achievements = metricsCount >= 3 ? 100 : metricsCount === 2 ? 75 : metricsCount === 1 ? 50 : 0;

  // 9. ATS Formatting (5%)
  const formattingResult = checkFormatting(fullResumeText, resumeSections);
  const atsFormatting = formattingResult.formattingScore;

  // Weighted Sum Calculation
  const subScores = {
    keywordMatch,
    technicalSkills,
    experienceRelevance,
    projectRelevance,
    resumeStructure,
    education: educationScore,
    certifications,
    achievements,
    atsFormatting
  };

  let weightedSum = 0;
  for (const [key, value] of Object.entries(subScores)) {
    weightedSum += value * (config.weights[key] || 0);
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(weightedSum)));

  // Determine Match Label Casing
  let matchLabel = 'Needs Improvement';
  if (overallScore >= config.thresholds.strong) {
    matchLabel = 'Strong Match';
  } else if (overallScore >= config.thresholds.good) {
    matchLabel = 'Good Match';
  } else if (overallScore >= config.thresholds.potential) {
    matchLabel = 'Potential Match';
  }

  return {
    overallScore,
    matchLabel,
    subScores,
    formattingChecks: formattingResult.checks
  };
}

module.exports = {
  calculateScore
};
