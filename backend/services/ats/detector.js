/**
 * backend/services/ats/detector.js
 * Segments raw resume text into distinct sections (SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION, CERTIFICATIONS, ACHIEVEMENTS)
 * using header keyword matching.
 */

// Controlled list of headings mapping to section keys
const SECTION_HEADERS = {
  SUMMARY: [
    /^(professional\s+)?summary$/i,
    /^objective(s)?$/i,
    /^(career\s+)?objective$/i,
    /^profile$/i,
    /^about\s+me$/i,
    /^executive\s+summary$/i,
    /^personal\s+statement$/i
  ],
  SKILLS: [
    /^skills$/i,
    /^technical\s+skills$/i,
    /^key\s+skills$/i,
    /^core\s+competencies$/i,
    /^languages\s+(and|&)\s+technologies$/i,
    /^technologies$/i,
    /^areas\s+of\s+expertise$/i,
    /^professional\s+skills$/i,
    /^skills\s+(and|&)\s+expertise$/i
  ],
  EXPERIENCE: [
    /^experience$/i,
    /^work\s+experience$/i,
    /^professional\s+experience$/i,
    /^employment(\s+history)?$/i,
    /^work\s+history$/i,
    /^professional\s+history$/i,
    /^career\s+history$/i
  ],
  PROJECTS: [
    /^projects$/i,
    /^personal\s+projects$/i,
    /^academic\s+projects$/i,
    /^key\s+projects$/i,
    /^technical\s+projects$/i,
    /^software\s+projects$/i
  ],
  EDUCATION: [
    /^education$/i,
    /^academic\s+profile$/i,
    /^academic\s+qualification(s)?$/i,
    /^educational\s+qualification(s)?$/i,
    /^education\s+(and|&)\s+credentials$/i,
    /^academic\s+history$/i
  ],
  CERTIFICATIONS: [
    /^certifications$/i,
    /^certificates$/i,
    /^licenses$/i,
    /^courses$/i,
    /^accreditations$/i,
    /^credentials$/i,
    /^certifications\s+(and|&)\s+licenses$/i
  ],
  ACHIEVEMENTS: [
    /^achievements$/i,
    /^awards$/i,
    /^honors$/i,
    /^awards\s+(and|&)\s+achievements$/i,
    /^extracurricular(\s+activities)?$/i,
    /^activities$/i,
    /^publications$/i,
    /^patents$/i
  ]
};

/**
 * Normalizes a line of text by removing bullets, colons, numbers, and extra spaces.
 * @param {string} line - The raw line of text.
 * @returns {string} Cleaned line.
 */
function normalizeLine(line) {
  return line
    .replace(/^[•\-\*♦▪▪\d\.\s]+/, '') // Remove bullets and leading list numbers
    .replace(/:$/, '')                 // Remove trailing colons
    .replace(/[\s\t]+/g, ' ')          // Normalize spaces
    .trim();
}

/**
 * Detects if a cleaned line is a section heading.
 * @param {string} cleanLine - The normalized line.
 * @returns {string|null} The matching section key or null.
 */
function matchHeader(cleanLine) {
  if (!cleanLine || cleanLine.length > 40) return null; // Headings are usually short

  for (const [sectionKey, regexes] of Object.entries(SECTION_HEADERS)) {
    for (const regex of regexes) {
      if (regex.test(cleanLine)) {
        return sectionKey;
      }
    }
  }
  return null;
}

/**
 * Segments raw text into structured sections.
 * @param {string} text - Raw resume text.
 * @returns {Object} A map of sections.
 */
function detectSections(text) {
  const sections = {
    SUMMARY: [],
    SKILLS: [],
    EXPERIENCE: [],
    PROJECTS: [],
    EDUCATION: [],
    CERTIFICATIONS: [],
    ACHIEVEMENTS: []
  };

  if (!text) return sections;

  const lines = text.split(/\r?\n/);
  let currentSection = 'SUMMARY'; // Default section for text before any headers

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Retain empty line spacing inside sections to keep formatting readable
      if (sections[currentSection].length > 0) {
        sections[currentSection].push('');
      }
      continue;
    }

    const clean = normalizeLine(trimmed);
    const matchedSection = matchHeader(clean);

    if (matchedSection) {
      currentSection = matchedSection;
      console.log(`[ATS Parser] Detected section header: "${trimmed}" -> Section: ${currentSection}`);
    } else {
      sections[currentSection].push(trimmed);
    }
  }

  // Join the arrays into clean trimmed text strings
  const result = {};
  for (const [key, value] of Object.entries(sections)) {
    result[key] = value.join('\n').trim();
  }

  return result;
}

module.exports = {
  detectSections
};
