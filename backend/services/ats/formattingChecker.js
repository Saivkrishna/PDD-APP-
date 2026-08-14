/**
 * backend/services/ats/formattingChecker.js
 * deterministic formatting checks for checking if a resume's structure/format
 * can cause problems with typical ATS parsing engines.
 */

/**
 * Runs deterministic checks on resume text and sections.
 * @param {string} resumeText - Full extracted text.
 * @param {Object} resumeSections - Map of resume sections.
 * @returns {Object} Formatting checks list and aggregate score.
 */
function checkFormatting(resumeText = '', resumeSections = {}) {
  const checks = [];
  const text = resumeText.trim();
  const textLength = text.length;

  // 1. Text is extractable
  if (textLength === 0) {
    checks.push({
      checkName: 'Text Extractability',
      status: 'fail',
      message: 'No text could be extracted. The file may be empty or corrupted.'
    });
  } else if (textLength < 150) {
    checks.push({
      checkName: 'Text Extractability',
      status: 'warning',
      message: 'Extracted text is extremely short. Scanned PDF or image-only pages may prevent parsing.'
    });
  } else {
    checks.push({
      checkName: 'Text Extractability',
      status: 'pass',
      message: 'Resume text was successfully extracted and processed.'
    });
  }

  // 2. Contact Info Present
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

  const hasEmail = emailRegex.test(text);
  const hasPhone = phoneRegex.test(text);

  if (hasEmail && hasPhone) {
    checks.push({
      checkName: 'Contact Information',
      status: 'pass',
      message: 'Email address and phone number were successfully identified.'
    });
  } else if (hasEmail || hasPhone) {
    checks.push({
      checkName: 'Contact Information',
      status: 'warning',
      message: 'Potential ATS compatibility issue: missing either email or phone contact details.'
    });
  } else {
    checks.push({
      checkName: 'Contact Information',
      status: 'fail',
      message: 'Potential ATS compatibility issue: no email or phone number detected.'
    });
  }

  // 3. Standard Section Headings Detected
  const presentSections = Object.keys(resumeSections).filter(k => (resumeSections[k] || '').trim().length > 20);
  if (presentSections.length >= 4) {
    checks.push({
      checkName: 'Standard Section Headings',
      status: 'pass',
      message: 'A strong number of standard section headings were identified.'
    });
  } else if (presentSections.length >= 2) {
    checks.push({
      checkName: 'Standard Section Headings',
      status: 'warning',
      message: 'Potential ATS compatibility issue: few standard section headings were identified, which can hinder chunking.'
    });
  } else {
    checks.push({
      checkName: 'Standard Section Headings',
      status: 'fail',
      message: 'Potential ATS compatibility issue: almost no standard section headings were identified.'
    });
  }

  // 4. Education Section Exists
  if (resumeSections.EDUCATION && resumeSections.EDUCATION.trim().length > 10) {
    checks.push({
      checkName: 'Education Section Presence',
      status: 'pass',
      message: 'Education section is present and populated.'
    });
  } else {
    checks.push({
      checkName: 'Education Section Presence',
      status: 'warning',
      message: 'Potential ATS compatibility issue: no clear Education section was detected.'
    });
  }

  // 5. Skills Section Exists
  if (resumeSections.SKILLS && resumeSections.SKILLS.trim().length > 10) {
    checks.push({
      checkName: 'Skills Section Presence',
      status: 'pass',
      message: 'Skills section is present and populated.'
    });
  } else {
    checks.push({
      checkName: 'Skills Section Presence',
      status: 'warning',
      message: 'Potential ATS compatibility issue: no clear Skills section was detected.'
    });
  }

  // 6. Experience Section Exists
  if (resumeSections.EXPERIENCE && resumeSections.EXPERIENCE.trim().length > 15) {
    checks.push({
      checkName: 'Experience Section Presence',
      status: 'pass',
      message: 'Experience section is present and populated.'
    });
  } else {
    checks.push({
      checkName: 'Experience Section Presence',
      status: 'warning',
      message: 'Potential ATS compatibility issue: no clear Work Experience section was detected.'
    });
  }

  // 7. Content is Not Image-Only
  if (textLength > 300) {
    checks.push({
      checkName: 'Non-Image Content Check',
      status: 'pass',
      message: 'The file contains readable textual characters (not image-only).'
    });
  } else {
    checks.push({
      checkName: 'Non-Image Content Check',
      status: 'fail',
      message: 'Potential ATS compatibility issue: Very little extractable text detected. Scanned documents can cause failures.'
    });
  }

  // 8. Date Consistency Check
  const currentYear = new Date().getFullYear();
  const futureYearRegex = /\b(20[2-9][7-9])\b/g; // Years like 2027-2099
  const matchesFuture = text.match(futureYearRegex);

  let dateWarning = false;
  if (matchesFuture) {
    for (const match of matchesFuture) {
      const yearVal = parseInt(match, 10);
      if (yearVal > currentYear + 1) {
        dateWarning = true;
        break;
      }
    }
  }

  if (dateWarning) {
    checks.push({
      checkName: 'Date Consistency Check',
      status: 'warning',
      message: 'Potential ATS compatibility issue: dates in future years detected. Make sure spans are correct.'
    });
  } else {
    checks.push({
      checkName: 'Date Consistency Check',
      status: 'pass',
      message: 'All dates in the resume appear to be reasonable and consistent.'
    });
  }

  // 9. Structure Readability
  // Whitespace check
  const whitespaceCount = (text.match(/\s/g) || []).length;
  const whitespaceRatio = textLength > 0 ? whitespaceCount / textLength : 0;

  if (whitespaceRatio > 0.45) {
    checks.push({
      checkName: 'Whitespace density',
      status: 'warning',
      message: 'Potential ATS compatibility issue: excessive whitespace or empty spacing detected.'
    });
  } else {
    checks.push({
      checkName: 'Whitespace density',
      status: 'pass',
      message: 'Resume text has a healthy density of spacing and printable characters.'
    });
  }

  // 10. Excessive Formatting & Unicode Check
  // Flags excessive special unicode symbols/lines (e.g. ▬, ❖, ──)
  const specialChars = (text.match(/[■▲▼♦❖●○▪▫▬■◆■★✔✓❌✏✖📁📧📞🔗]|\-{3,}|_{3,}|={3,}/g) || []).length;
  if (specialChars > 15) {
    checks.push({
      checkName: 'Layout Decoration',
      status: 'warning',
      message: 'Potential ATS compatibility issue: excessive special symbols/lines can cause character corruption.'
    });
  } else {
    checks.push({
      checkName: 'Layout Decoration',
      status: 'pass',
      message: 'Unicode decorations are minimal, ensuring clean parser extraction.'
    });
  }

  // Calculate Formatting Sub-score
  let baseScore = 100;
  checks.forEach(c => {
    if (c.status === 'fail') baseScore -= 15;
    if (c.status === 'warning') baseScore -= 5;
  });

  const formattingScore = Math.min(100, Math.max(0, baseScore));

  return {
    checks,
    formattingScore
  };
}

module.exports = {
  checkFormatting
};
