/**
 * backend/services/ats/jdParser.js
 * Parses raw job description text to extract job title, required/preferred/optional skills,
 * experience, education, certifications, and responsibilities.
 */

// Skills dictionaries with synonym variations
const TECH_SKILLS = {
  'javascript': ['javascript', 'js'],
  'typescript': ['typescript', 'ts'],
  'python': ['python', 'py'],
  'java': ['java'],
  'c++': ['c\\+\\+'],
  'c#': ['c#', 'c-sharp'],
  'ruby': ['ruby', 'rails'],
  'go': ['golang', 'go lang', '\\bgo\\b'],
  'rust': ['rust'],
  'php': ['php'],
  'swift': ['swift'],
  'kotlin': ['kotlin'],
  'sql': ['sql', 'mysql', 'postgresql', 'sqlite', 'postgres'],
  'html': ['html', 'html5'],
  'css': ['css', 'css3', 'sass', 'less'],
  'react': ['react', 'reactjs', 'react\\.js'],
  'angular': ['angular', 'angularjs'],
  'vue': ['vue', 'vuejs', 'vue\\.js'],
  'node.js': ['node', 'nodejs', 'node\\.js'],
  'express': ['express', 'expressjs'],
  'django': ['django'],
  'flask': ['flask'],
  'spring boot': ['spring boot', 'spring'],
  'laravel': ['laravel'],
  'next.js': ['nextjs', 'next\\.js'],
  'svelte': ['svelte'],
  'mongodb': ['mongodb', 'mongo'],
  'redis': ['redis'],
  'aws': ['aws', 'amazon web services', 's3', 'ec2'],
  'azure': ['azure'],
  'gcp': ['gcp', 'google cloud'],
  'docker': ['docker'],
  'kubernetes': ['kubernetes', 'k8s'],
  'ci/cd': ['ci/cd', 'jenkins', 'github actions', 'gitlab ci'],
  'git': ['git', 'github', 'gitlab'],
  'terraform': ['terraform']
};

const SOFT_SKILLS = {
  'communication': ['communication', 'written', 'verbal', 'interpersonal'],
  'teamwork': ['teamwork', 'collaboration', 'team player', 'collaborate'],
  'leadership': ['leadership', 'management', 'mentoring', 'lead', 'mentor'],
  'problem-solving': ['problem-solving', 'problem solving', 'analytical', 'critical thinking'],
  'adaptability': ['adaptability', 'flexible', 'learning', 'self-starter']
};

// Certifications list
const CERTIFICATIONS = [
  'AWS Certified', 'PMP', 'Scrum Master', 'CSM', 'CISSP', 'CCNA', 'ITIL',
  'Azure Certified', 'GCP Certified'
];

/**
 * Parses raw job description text.
 * @param {string} text - Raw JD text.
 * @returns {Object} Parsed job details.
 */
function parseJd(text) {
  if (!text) {
    return {
      jobTitle: 'Unknown Role',
      requiredSkills: [],
      preferredSkills: [],
      optionalSkills: [],
      technicalSkills: [],
      softSkills: [],
      experienceYears: 0,
      education: [],
      certifications: [],
      responsibilities: [],
      keywords: []
    };
  }

  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const lowercaseText = text.toLowerCase();

  // 1. Extract Job Title
  let jobTitle = '';
  // Check first 3 lines for explicit "Title: ..."
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    const match = line.match(/^(?:job\s+)?(?:title|position|role|title\s+name)\s*:\s*(.+)$/i);
    if (match) {
      jobTitle = match[1].trim();
      break;
    }
  }

  // Fallback: look for common developer role patterns in the text
  if (!jobTitle) {
    const titleRegex = /(?:senior|junior|lead|principal|staff|associate|entry[- ]level)?\s*(?:frontend|backend|fullstack|full-stack|devops|data|software|systems|qa|test|reliability|security|cloud|python|java|javascript|typescript|c\#|c\+\+|ruby|php|rust|go)\s+(?:engineer|developer|scientist|analyst|architect|specialist|manager)/i;
    const match = text.match(titleRegex);
    if (match) {
      jobTitle = match[0].trim();
    } else {
      // Fallback to the first line truncated
      jobTitle = lines[0] ? lines[0].substring(0, 50).trim() : 'Software Engineer';
    }
  }

  // Normalize casing of job title
  jobTitle = jobTitle.replace(/\b\w/g, c => c.toUpperCase());

  // 2. Extract Experience Years
  let experienceYears = 0;
  const expRegexes = [
    /(\d+)\+?\s*years?(?:\s*of)?\s*experience/i,
    /minimum\s+(?:of\s+)?(\d+)\s*years?/i,
    /at\s+least\s+(\d+)\s*years?/i,
    /(\d+)\s*-\s*(\d+)\s*years?/i,
    /(\d+)\+?\s*years?/i,
    /(\d+)\s*yrs?/i
  ];

  for (const regex of expRegexes) {
    const matches = text.match(new RegExp(regex, 'gi'));
    if (matches) {
      for (const match of matches) {
        const numbers = match.match(/\d+/g);
        if (numbers) {
          const val = parseInt(numbers[0], 10);
          if (val > experienceYears && val < 20) { // sanity check
            experienceYears = val;
          }
        }
      }
    }
  }

  // 3. Extract Education
  const education = [];
  if (/bachelor|b\.s\.|bs\s|degree\s+in\s+computer\s+science/i.test(text)) {
    education.push("Bachelor's Degree");
  }
  if (/master|m\.s\.|ms\s|graduate\s+degree/i.test(text)) {
    education.push("Master's Degree");
  }
  if (/phd|ph\.d\./i.test(text)) {
    education.push("PhD");
  }
  if (education.length === 0) {
    education.push("Not Specified");
  }

  // 4. Extract Certifications
  const certifications = [];
  for (const cert of CERTIFICATIONS) {
    const regex = new RegExp(`\\b${cert.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      certifications.push(cert);
    }
  }

  // 5. Categorize Skills (Required vs Preferred vs Optional)
  const requiredSkills = new Set();
  const preferredSkills = new Set();
  const optionalSkills = new Set();
  const technicalSkills = [];
  const softSkills = [];

  // Helper to check if a sentence indicates "Preferred" (nice-to-have)
  const isPreferredSentence = (sentence) => {
    const preferredIndicators = [
      'preferred', 'nice to have', 'plus', 'desired', 'beneficial',
      'bonus', 'advantage', 'highly regarded', 'optional', 'not required'
    ];
    return preferredIndicators.some(ind => sentence.includes(ind));
  };

  // Helper to check if a sentence indicates "Required"
  const isRequiredSentence = (sentence) => {
    const requiredIndicators = [
      'must', 'required', 'essential', 'minimum', 'mandatory',
      'need', 'have to', 'should have', 'strong knowledge'
    ];
    return requiredIndicators.some(ind => sentence.includes(ind));
  };

  let currentSectionType = 'required'; // default assumed to be required

  // Split text into units (sentences or bullet points)
  const units = text.split(/(?:\.\s+|\!+|\?+|\;|\n)+/).map(u => u.trim()).filter(Boolean);

  // Loop through units to determine current section context and match skills
  for (const unit of units) {
    const cleanUnit = unit.toLowerCase();

    // Section context switches
    if (/preferred|nice\s+to\s+have|desirable|plusses|bonus|highly\s+regarded/i.test(cleanUnit) && cleanUnit.length < 40) {
      currentSectionType = 'preferred';
      continue;
    }
    if (/required|requirements|must\s+have|essential|qualification/i.test(cleanUnit) && cleanUnit.length < 40) {
      currentSectionType = 'required';
      continue;
    }

    // Line-level type overrides
    let unitType = currentSectionType;
    if (isPreferredSentence(cleanUnit)) {
      unitType = 'preferred';
    } else if (isRequiredSentence(cleanUnit)) {
      unitType = 'required';
    }

    // Match Tech Skills in this unit
    for (const [skillName, synonyms] of Object.entries(TECH_SKILLS)) {
      for (const syn of synonyms) {
        const regex = new RegExp(`\\b${syn}\\b`, 'i');
        if (regex.test(cleanUnit)) {
          if (unitType === 'preferred') {
            preferredSkills.add(skillName);
          } else {
            requiredSkills.add(skillName);
          }
          if (!technicalSkills.includes(skillName)) {
            technicalSkills.push(skillName);
          }
          break; // move to next skill
        }
      }
    }

    // Match Soft Skills in this unit
    for (const [skillName, synonyms] of Object.entries(SOFT_SKILLS)) {
      for (const syn of synonyms) {
        const regex = new RegExp(`\\b${syn}\\b`, 'i');
        if (regex.test(cleanUnit)) {
          if (unitType === 'required') {
            requiredSkills.add(skillName);
          } else if (unitType === 'preferred') {
            preferredSkills.add(skillName);
          } else {
            optionalSkills.add(skillName);
          }
          if (!softSkills.includes(skillName)) {
            softSkills.push(skillName);
          }
          break; // move to next skill
        }
      }
    }
  }

  // Deduplicate: if a skill is in both required and preferred, keep only required
  for (const skill of requiredSkills) {
    preferredSkills.delete(skill);
    optionalSkills.delete(skill);
  }
  for (const skill of preferredSkills) {
    optionalSkills.delete(skill);
  }

  // 6. Responsibilities Section Extraction
  const responsibilities = [];
  let inResponsibilitiesSection = false;

  for (const line of lines) {
    const clean = line.replace(/^[•\-\*♦▪▪\s]+/, '').trim();
    if (/responsibilities|duties|what\s+you'll\s+do|key\s+tasks|role\s+description/i.test(clean)) {
      inResponsibilitiesSection = true;
      continue;
    }
    // Exit section if we reach next major header
    if (inResponsibilitiesSection && /qualifications|skills|requirements|about\s+us|benefits/i.test(clean) && clean.length < 30) {
      inResponsibilitiesSection = false;
    }

    if (inResponsibilitiesSection && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || clean.length > 20)) {
      if (responsibilities.length < 8) { // cap to prevent huge dumps
        responsibilities.push(clean);
      }
    }
  }

  // 7. Important Keywords extraction (Term frequency counting)
  const stopwords = new Set([
    'and', 'the', 'our', 'you', 'will', 'with', 'for', 'that', 'this', 'your', 'from', 'their', 'they',
    'have', 'work', 'team', 'with', 'about', 'join', 'more', 'about', 'build', 'using', 'experience'
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^\w\s\+\#\-\.]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopwords.has(w));

  const wordCounts = {};
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // Double weight words in first 5 lines or bullet points
  const primaryLines = lines.slice(0, 5).concat(responsibilities);
  for (const line of primaryLines) {
    const lineWords = line.toLowerCase().replace(/[^\w\s\+\#\-\.]/g, '').split(/\s+/);
    for (const word of lineWords) {
      if (wordCounts[word]) {
        wordCounts[word] += 1;
      }
    }
  }

  const keywords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);

  return {
    jobTitle,
    requiredSkills: Array.from(requiredSkills),
    preferredSkills: Array.from(preferredSkills),
    optionalSkills: Array.from(optionalSkills),
    technicalSkills,
    softSkills,
    experienceYears,
    education,
    certifications,
    responsibilities: responsibilities.length > 0 ? responsibilities : ['Not Explicitly Detected'],
    keywords
  };
}

module.exports = {
  parseJd
};
