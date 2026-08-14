const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const DB = require('./services/db');

function cleanJSONString(str) {
  let result = '';
  let inString = false;
  let escape = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (escape) {
      result += char;
      escape = false;
      continue;
    }
    if (char === '\\') {
      result += char;
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (inString) {
      if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else if (char === '\t') {
        result += '\\t';
      } else if (char.charCodeAt(0) < 32) {
        // Skip other control characters
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }
  return result;
}

const srcDir = path.join(__dirname, '../frontend/src');

// List of 22 topics defined in aptitudeData.js
const TOPICS = [
  'lcm-hcf',
  'divisibility-remainder',
  'problems-ages',
  'probability',
  'equation',
  'series-progression',
  'mensuration',
  'geometry-perimeter',
  'percentages',
  'profit-loss',
  'time-work',
  'clocks-calendar',
  'ratio-proportion',
  'mixture-alligation',
  'time-speed-distance',
  'permutation-combination',
  'mean-median-mode',
  'data-interpretation',
  'pie-chart',
  'graphical-chart',
  'simple-arithmetic',
  'averages'
];

// Mock function mapTopic from allQuizQuestions.js, adding 'percentage' -> 'percentages'
const mapTopic = (topic, qText, catText) => {
  const q = (qText || '').toLowerCase();
  const cat = (catText || '').toLowerCase();
  
  if (topic === 'pipes-cisterns') return 'time-work';
  if (topic === 'squares') return 'simple-arithmetic';
  if (topic === 'interest') return 'profit-loss';
  
  // Normalizations
  if (topic === 'percentage') return 'percentages';
  if (topic === 'percentages') return 'percentages';
  
  if (topic === 'number-system') {
    if (q.includes('lcm') || q.includes('hcf') || cat.includes('lcm') || cat.includes('hcf')) {
      return 'lcm-hcf';
    }
    if (q.includes('remain') || q.includes('divis') || cat.includes('remain') || cat.includes('divis')) {
      return 'divisibility-remainder';
    }
    return 'simple-arithmetic';
  }
  return topic;
};

// Helper to load array from file
function loadArrayFromFile(filename, varName) {
  const fileContent = fs.readFileSync(path.join(srcDir, filename), 'utf8');
  let jsCode = fileContent
    .replace(/import\s+.*?;/g, '')
    .replace(/export\s+default\s+.*?;/g, '')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+let\s+/g, 'let ');
  
  const sandbox = {};
  eval(jsCode + `;\n sandbox.data = ${varName};`);
  return sandbox.data;
}

// Aggregation logic of existing questions
function getExistingQuestions() {
  const timeWorkQuestions = loadArrayFromFile('timeWorkQuizData.js', 'timeWorkQuizQuestions');
  const generatedQuestions = loadArrayFromFile('generatedQuizQuestions.js', 'generatedQuizQuestions');
  const lcmHcfQuestions = loadArrayFromFile('lcmHcfQuizData.js', 'lcmHcfQuizQuestions');
  const divisibilityRemainderQuestions = loadArrayFromFile('divisibilityRemainderQuizData.js', 'divisibilityRemainderQuizQuestions');
  const problemsAgesQuestions = loadArrayFromFile('problemsAgesQuizData.js', 'problemsAgesQuizQuestions');
  const probabilityQuestions = loadArrayFromFile('probabilityQuizData.js', 'probabilityQuizQuestions');
  const equationQuestions = loadArrayFromFile('equationQuizData.js', 'equationQuizQuestions');
  const seriesProgressionQuestions = loadArrayFromFile('seriesProgressionQuizData.js', 'seriesProgressionQuizQuestions');
  const mensurationQuestions = loadArrayFromFile('mensurationQuizData.js', 'mensurationQuizQuestions');
  const percentageQuestions = loadArrayFromFile('percentageQuizData.js', 'percentageQuizQuestions');
  const geometryPerimeterQuestions = loadArrayFromFile('geometryPerimeterQuizData.js', 'geometryPerimeterQuizQuestions');
  const profitLossQuestions = loadArrayFromFile('profitLossQuizData.js', 'profitLossQuizQuestions');
  const clocksCalendarQuestions = loadArrayFromFile('clocksCalendarQuizData.js', 'clocksCalendarQuizQuestions');
  const ratioProportionQuestions = loadArrayFromFile('ratioProportionQuizData.js', 'ratioProportionQuizQuestions');
  const mixtureAlligationQuestions = loadArrayFromFile('mixtureAlligationQuizData.js', 'mixtureAlligationQuizQuestions');
  const timeSpeedDistanceQuestions = loadArrayFromFile('timeSpeedDistanceQuizData.js', 'timeSpeedDistanceQuizQuestions');
  const permutationCombinationQuestions = loadArrayFromFile('permutationCombinationQuizData.js', 'permutationCombinationQuizQuestions');

  // Attach variables globally for eval
  global.timeWorkQuizQuestions = timeWorkQuestions;
  global.generatedQuizQuestions = generatedQuestions;
  global.lcmHcfQuizQuestions = lcmHcfQuestions;
  global.divisibilityRemainderQuizQuestions = divisibilityRemainderQuestions;
  global.problemsAgesQuizQuestions = problemsAgesQuestions;
  global.probabilityQuizQuestions = probabilityQuestions;
  global.equationQuizQuestions = equationQuestions;
  global.seriesProgressionQuizQuestions = seriesProgressionQuestions;
  global.mensurationQuizQuestions = mensurationQuestions;
  global.percentageQuizQuestions = percentageQuestions;
  global.geometryPerimeterQuizQuestions = geometryPerimeterQuestions;
  global.profitLossQuizQuestions = profitLossQuestions;
  global.clocksCalendarQuizQuestions = clocksCalendarQuestions;
  global.ratioProportionQuizQuestions = ratioProportionQuestions;
  global.mixtureAlligationQuizQuestions = mixtureAlligationQuestions;
  global.timeSpeedDistanceQuizQuestions = timeSpeedDistanceQuestions;
  global.permutationCombinationQuizQuestions = permutationCombinationQuestions;
  global.mapTopic = mapTopic;

  const allQuizQuestionsContent = fs.readFileSync(path.join(srcDir, 'allQuizQuestions.js'), 'utf8');
  let allQuizQuestionsCleaned = allQuizQuestionsContent
    .replace(/import\s+.*?;/g, '')
    .replace(/export\s+const\s+(\w+)/g, 'global.$1')
    .replace(/export\s+default\s+.*?;/g, '')
    .replace(/const\s+(\w+)\s*=/g, 'global.$1 =')
    .replace(/let\s+(\w+)\s*=/g, 'global.$1 =');

  eval(allQuizQuestionsCleaned);

  // Normalize topic names and set source: "existing"
  return global.uniqueCombined.map(q => ({
    ...q,
    id: q.id ? q.id.toString() : Math.random().toString(36).substring(2, 9),
    topic: mapTopic(q.topic, q.q, q.category),
    source: 'existing'
  }));
}

// Normalize question text for duplicate detection
function normalizeQText(qText) {
  return (qText || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log('🚀 Starting Aptitude Question Bank Seeder...');
  
  // 1. Gather all existing unique questions from the code
  const existingQuestions = getExistingQuestions();
  console.log(`📦 Found ${existingQuestions.length} existing questions in static files.`);

  // 2. Load all currently stored questions from database (to make it fully idempotent/resumable)
  let dbQuestions = [];
  try {
    for (const topic of TOPICS) {
      const qs = await DB.getAptitudeQuestions(topic, 'all');
      dbQuestions = dbQuestions.concat(qs);
    }
    console.log(`🗄️ Currently loaded ${dbQuestions.length} questions in the database.`);
  } catch (err) {
    console.warn('⚠️ Error reading database questions:', err.message);
  }

  // 3. Seed existing questions that aren't in the database yet
  const dbNormalizedTexts = new Set(dbQuestions.map(q => normalizeQText(q.q)));
  const dbIds = new Set(dbQuestions.map(q => q.id));
  
  let seededCount = 0;
  for (const q of existingQuestions) {
    const norm = normalizeQText(q.q);
    if (!dbNormalizedTexts.has(norm) && !dbIds.has(q.id)) {
      await DB.saveAptitudeQuestion(q);
      dbNormalizedTexts.add(norm);
      dbIds.add(q.id);
      dbQuestions.push(q);
      seededCount++;
    }
  }
  if (seededCount > 0) {
    console.log(`✅ Seeded ${seededCount} new existing questions to the database.`);
  } else {
    console.log('ℹ️ All existing static questions are already seeded.');
  }

  // 4. Check API Key configuration for Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '' || apiKey.includes('REMOVED')) {
    console.error('❌ GEMINI_API_KEY is not configured or disabled per organization policy. Skipping dynamic question seeding.');
    printReport(dbQuestions);
    process.exit(0);
  }

  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  // 5. Check counts and generate missing questions
  for (const topic of TOPICS) {
    for (const diff of ['easy', 'medium', 'hard']) {
      // Find current questions in DB for this category
      const currentQs = dbQuestions.filter(q => q.topic === topic && q.difficulty === diff);
      const count = currentQs.length;
      
      if (count < 10) {
        const missingCount = 10 - count;
        console.log(`🤖 Topic: "${topic}" (${diff}) has ${count}/10 questions. Generating ${missingCount} missing questions...`);
        
        let attempts = 0;
        let success = false;
        
        while (attempts < 3 && !success) {
          attempts++;
          try {
            const existingTexts = currentQs.map(q => q.q);
            const prompt = `You are a professional aptitude coach and question designer.
Generate exactly ${missingCount} multiple-choice questions for the category:
Topic: "${topic}"
Difficulty: "${diff}" (Definitions: "easy" = simple calculations, basic concepts; "medium" = multi-step calculations, word problems; "hard" = tricky configs, campus placement questions, complex logic).

Existing questions in this category (Do NOT duplicate their phrasing, numbers, or logic):
${existingTexts.map((q, idx) => `${idx + 1}. ${q}`).join('\n')}

For each generated question, output a JSON object with these EXACT keys:
- "id": Unique string starting with "gemini_${topic}_${diff}_" followed by 5 random lowercase letters/numbers
- "topic": "${topic}"
- "difficulty": "${diff}"
- "category": "Sub-concept name (e.g. Simple Average, Unit Digit, Fermat Theorem)"
- "q": "The question text"
- "options": ["A) ...", "B) ...", "C) ...", "D) ..."] (Exactly 4 choices with capital letter prefixes)
- "answer": "Option value matching the correct options choice exactly"
- "explanation": "Detailed step-by-step worked out numerical explanation"
- "shortcut": "An optional shortcut/tip"
- "company": ["TCS", "Infosys", "Wipro", "Cognizant"] (At least 1-2 companies that ask this)

Return ONLY a valid JSON array of these objects. Do not include markdown code block backticks (like \`\`\`json) or any additional conversational text. Ensure all quotes are properly escaped.`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt
            });

            let text = response.text || '';
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            text = cleanJSONString(text);

            const generated = JSON.parse(text);
            if (!Array.isArray(generated)) {
              throw new Error('Response is not a JSON array');
            }

            if (generated.length !== missingCount) {
              throw new Error(`Generated ${generated.length} questions, expected ${missingCount}`);
            }

            // Validate each generated question
            const validated = [];
            for (const q of generated) {
              if (!q.q || !Array.isArray(q.options) || q.options.length !== 4 || !q.answer || !q.explanation) {
                throw new Error('Question missing key properties');
              }
              if (!q.options.includes(q.answer)) {
                throw new Error('Correct answer does not exist in options list');
              }
              
              // Duplicate checks
              const normText = normalizeQText(q.q);
              if (dbNormalizedTexts.has(normText)) {
                throw new Error('Generated question text duplicates an existing database question');
              }

              validated.push({
                ...q,
                id: q.id || `gemini_${topic}_${diff}_${Math.random().toString(36).substring(2, 7)}`,
                topic,
                difficulty: diff,
                source: 'gemini'
              });
            }

            // If we get here, all generated questions are valid!
            for (const q of validated) {
              await DB.saveAptitudeQuestion(q);
              dbNormalizedTexts.add(normalizeQText(q.q));
              dbIds.add(q.id);
              dbQuestions.push(q);
            }

            console.log(`✅ Successfully generated and saved ${validated.length} questions for "${topic}" (${diff}).`);
            success = true;
          } catch (e) {
            console.warn(`⚠️ Attempt ${attempts} failed for "${topic}" (${diff}): ${e.message}. Retrying...`);
          }
        }

        if (!success) {
          console.error(`❌ Failed to generate questions for "${topic}" (${diff}) after 3 attempts. Resuming on next seed run.`);
        }
      }
    }
  }

  // Print final summary status
  printReport(dbQuestions);
}

function printReport(questions) {
  console.log('\n=============================================================');
  console.log('            APTITUDE QUESTION BANK STATUS REPORT             ');
  console.log('=============================================================');
  
  let totalExisting = 0;
  let totalGemini = 0;
  let totalMissing = 0;

  TOPICS.forEach(topic => {
    const easyQs = questions.filter(q => q.topic === topic && q.difficulty === 'easy');
    const medQs = questions.filter(q => q.topic === topic && q.difficulty === 'medium');
    const hardQs = questions.filter(q => q.topic === topic && q.difficulty === 'hard');

    const eStatus = easyQs.length >= 10 ? '✓' : `${easyQs.length}/10`;
    const mStatus = medQs.length >= 10 ? '✓' : `${medQs.length}/10`;
    const hStatus = hardQs.length >= 10 ? '✓' : `${hardQs.length}/10`;

    totalExisting += questions.filter(q => q.topic === topic && q.source === 'existing').length;
    totalGemini += questions.filter(q => q.topic === topic && q.source === 'gemini').length;
    
    if (easyQs.length < 10) totalMissing += (10 - easyQs.length);
    if (medQs.length < 10) totalMissing += (10 - medQs.length);
    if (hardQs.length < 10) totalMissing += (10 - hardQs.length);

    console.log(`${topic.padEnd(25)} | Easy: ${eStatus.padEnd(5)} | Medium: ${mStatus.padEnd(5)} | Hard: ${hStatus.padEnd(5)}`);
  });

  console.log('-------------------------------------------------------------');
  console.log(`Total Original (Existing) Questions : ${totalExisting}`);
  console.log(`Total Gemini-Generated Questions    : ${totalGemini}`);
  console.log(`Total Database Questions            : ${questions.length}`);
  console.log(`Remaining Missing Questions         : ${totalMissing}`);
  console.log('=============================================================');
}

run();
