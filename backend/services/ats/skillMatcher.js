/**
 * backend/services/ats/skillMatcher.js
 * Matches resume skills against Job Description target skills using:
 * 1. Exact case-insensitive matching
 * 2. Synonym matching (via skillsSynonyms.json)
 * 3. Local fuzzy matching (via Jaro-Winkler distance)
 * 4. Related skills correlation (to avoid false positives while providing helpful context)
 */

const fs = require('fs');
const path = require('path');

// Load synonym dictionary safely
let synonymsDb = {};
try {
  const fileContent = fs.readFileSync(path.join(__dirname, 'skillsSynonyms.json'), 'utf8');
  synonymsDb = JSON.parse(fileContent);
} catch (err) {
  console.error('[Skill Matcher] Failed to load synonyms dictionary:', err.message);
}

// Pre-defined related skill groups for correlation checks
const RELATED_GROUPS = [
  ['aws', 'azure', 'gcp', 'cloud'],
  ['docker', 'kubernetes', 'devops'],
  ['python', 'django', 'flask'],
  ['react', 'angular', 'vue', 'next.js', 'svelte', 'frontend'],
  ['node.js', 'express', 'javascript', 'typescript', 'backend'],
  ['mongodb', 'postgresql', 'mysql', 'redis', 'sql', 'databases']
];

/**
 * Calculates the Jaro-Winkler similarity score between two strings.
 * @param {string} s1 - First string.
 * @param {string} s2 - Second string.
 * @returns {number} Score from 0.0 (totally different) to 1.0 (identical).
 */
function jaroWinkler(s1, s2) {
  s1 = (s1 || '').toLowerCase().trim();
  s2 = (s2 || '').toLowerCase().trim();

  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;
  if (len1 === 0 || len2 === 0) return 0.0;

  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;
  const matches1 = new Array(len1).fill(false);
  const matches2 = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(len2 - 1, i + matchWindow);

    for (let j = start; j <= end; j++) {
      if (matches2[j]) continue;
      if (s1[i] === s2[j]) {
        matches1[i] = true;
        matches2[j] = true;
        matches++;
        break;
      }
    }
  }

  if (matches === 0) return 0.0;

  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!matches1[i]) continue;
    while (!matches2[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  const jaro = ((matches / len1) + (matches / len2) + ((matches - transpositions / 2) / matches)) / 3.0;

  // Winkler prefix adjustment
  const prefixScale = 0.1;
  let prefixLen = 0;
  for (let i = 0; i < Math.min(4, len1, len2); i++) {
    if (s1[i] === s2[i]) {
      prefixLen++;
    } else {
      break;
    }
  }

  return jaro + prefixLen * prefixScale * (1.0 - jaro);
}

/**
 * Escapes regex special characters.
 */
function escapeRegExp(str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Matches resume text against JD skills.
 * @param {Object} resumeSections - Map of resume section texts.
 * @param {Object} parsedJd - Parsed Job Description details.
 * @returns {Object} Matched and missing skills details.
 */
function matchSkills(resumeSections, parsedJd) {
  const matchedSkills = [];
  const missingSkills = [];

  const skillsSection = (resumeSections.SKILLS || '').toLowerCase();
  const fullResumeText = Object.values(resumeSections).join('\n').toLowerCase();

  // Extract individual resume skills by splitting common delimiters
  const resumeSkillsList = skillsSection
    .split(/[,\n•;·♦♦\t|]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  // Group all target skills from JD
  const targetSkills = [];
  const addTarget = (skillList, category) => {
    (skillList || []).forEach(skill => {
      targetSkills.push({ name: skill.toLowerCase(), category });
    });
  };

  addTarget(parsedJd.requiredSkills, 'required');
  addTarget(parsedJd.preferredSkills, 'preferred');
  addTarget(parsedJd.optionalSkills, 'optional');

  // Deduplicate target skills
  const seenTargets = new Set();
  const uniqueTargets = targetSkills.filter(t => {
    if (seenTargets.has(t.name)) return false;
    seenTargets.add(t.name);
    return true;
  });

  for (const target of uniqueTargets) {
    const targetName = target.name;
    const targetSyns = synonymsDb[targetName] || [targetName];

    let matchFound = false;
    let matchType = null;
    let matchedText = '';

    // 1. Exact Match Check (in SKILLS section or full resume)
    for (const syn of targetSyns) {
      const regex = new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'i');
      if (regex.test(skillsSection)) {
        matchFound = true;
        matchType = syn === targetName ? 'exact' : 'synonym';
        matchedText = syn;
        break;
      }
    }

    // Exact Match Fallback: search entire resume text
    if (!matchFound) {
      for (const syn of targetSyns) {
        const regex = new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'i');
        if (regex.test(fullResumeText)) {
          matchFound = true;
          matchType = syn === targetName ? 'exact' : 'synonym';
          matchedText = syn;
          break;
        }
      }
    }

    // 2. Fuzzy Match Check (in list of individual skills in skills section)
    if (!matchFound) {
      let bestFuzzyScore = 0;
      let bestFuzzyWord = '';

      for (const rSkill of resumeSkillsList) {
        // Compare with target name and synonyms
        for (const syn of targetSyns) {
          const score = jaroWinkler(rSkill, syn);
          if (score > bestFuzzyScore) {
            bestFuzzyScore = score;
            bestFuzzyWord = rSkill;
          }
        }
      }

      // High threshold for similarity (0.85) to avoid false positives
      if (bestFuzzyScore >= 0.85) {
        matchFound = true;
        matchType = 'fuzzy';
        matchedText = bestFuzzyWord;
      }
    }

    // 3. Related Skill Check (Related-But-Not-Matched)
    if (!matchFound) {
      // Find related group
      const relatedGroup = RELATED_GROUPS.find(group => group.includes(targetName));
      if (relatedGroup) {
        // Check if resume contains any other skill from the same related group
        let relatedSkillFound = '';
        for (const related of relatedGroup) {
          if (related === targetName) continue;
          const relatedSyns = synonymsDb[related] || [related];
          for (const syn of relatedSyns) {
            const regex = new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'i');
            if (regex.test(fullResumeText)) {
              relatedSkillFound = related;
              break;
            }
          }
          if (relatedSkillFound) break;
        }

        if (relatedSkillFound) {
          matchedSkills.push({
            skill: targetName,
            category: target.category,
            matchType: 'related-not-matched',
            matchedText: `Related skill found: "${relatedSkillFound}"`
          });
          continue; // Skip adding to missing list, since it's flagged as related
        }
      }
    }

    if (matchFound) {
      matchedSkills.push({
        skill: targetName,
        category: target.category,
        matchType,
        matchedText
      });
    } else {
      missingSkills.push({
        skill: targetName,
        category: target.category
      });
    }
  }

  return {
    matchedSkills,
    missingSkills
  };
}

module.exports = {
  matchSkills,
  jaroWinkler
};
