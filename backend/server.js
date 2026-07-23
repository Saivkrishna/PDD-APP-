const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const careerData = require('./data');
const DB = require('./services/db');

// Ensure a default Demo User exists in the database
async function initDemoUser() {
  try {
    const demoUser = await DB.findUserByEmail('demo@careerpath.ai');
    if (!demoUser) {
      await DB.createUser({
        name: 'Demo User',
        email: 'demo@careerpath.ai',
        password: 'demo1234'
      });
      console.log('✅ Demo user initialized');
    }
  } catch (e) {
    console.log('Demo user already initialized or error:', e.message);
  }
}

// initDemoUser();

const app = express();
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/build'), {
  etag: false,
  lastModified: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// ─── UTILITIES & SECURITY FUNCTIONS ───────────────────────────────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

// ─── AUTHENTICATION ROUTES ───────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await DB.createUser({ name, email, password });
    res.status(201).json({ success: true, user });
  } catch (err) {
    console.error('Error in registration endpoint:', err);
    if (err.message === 'Email already registered') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = sanitizeInput(email).toLowerCase();

    console.log(`[AUTH] Login attempt for: ${email}`);

    if (!email || !password) {
      console.log(`[AUTH] Missing email or password`);
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!emailRegex.test(email)) {
      console.log(`[AUTH] Invalid email format: ${email}`);
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const user = await DB.verifyUserCredentials(email, password);
    console.log(`[AUTH] DB verify credentials result:`, user ? `Found user ${user.email} (ID: ${user.id})` : 'Not found / Mismatch');

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error in login endpoint:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/auth/sync', async (req, res) => {
  try {
    let { id, name, email } = req.body;
    id = sanitizeInput(id);
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();

    if (!id || !email) {
      return res.status(400).json({ error: 'id and email are required' });
    }

    const user = await DB.syncFirebaseUser({ id, name, email });
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error in sync endpoint:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    let { email } = req.body;
    email = sanitizeInput(email).toLowerCase();

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const token = await DB.generateResetToken(email);
    console.log(`🔑 Reset Code for ${email}: ${token}`);
    res.status(200).json({ success: true, message: `Password reset link/code sent to ${email}`, code: token });
  } catch (err) {
    console.error('Error in forgot-password endpoint:', err);
    if (err.message.includes('No user found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    let { email, code, password } = req.body;
    email = sanitizeInput(email).toLowerCase();
    code = sanitizeInput(code);

    if (!email || !code || !password) {
      return res.status(400).json({ error: 'Email, reset code, and new password are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    await DB.resetPasswordWithToken(email, code, password);
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error('Error in reset-password endpoint:', err);
    if (err.message.includes('Invalid or expired')) {
      return res.status(400).json({ error: err.message });
    }
    if (err.message.includes('No user found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// ─── DYNAMIC TRENDING JOBS CRAWLER ───────────────────────────────
const https = require('https');

const defaultTrending = [
  {
    id: "software-ai-engineer",
    title: "Software & AI Engineer",
    industry: "engineering",
    growth: "42% YoY",
    icon: "💻",
    salary: "₹12,0,000 - ₹35,00,000 per annum",
    description: "Designs, develops, and deploys scalable software products and intelligent artificial intelligence systems. Focuses on coding, algorithm optimization, and machine learning pipelines.",
    skills: ["Software Engineering", "Machine Learning", "System Design", "Algorithm Optimization", "Cloud Computing"],
    tools: ["Python", "JavaScript", "React", "Docker", "AWS", "Git"],
    certifications: ["AWS Certified Solutions Architect", "Google Professional Cloud Developer"],
    higherStudies: ["M.Tech in Artificial Intelligence", "M.S. in Computer Science", "Ph.D. in Computer Engineering"],
    futureScope: "High demand with the exponential growth of artificial intelligence, automated software platforms, and digital cloud migrations.",
    locations: ["Bengaluru", "Hyderabad", "Pune", "San Francisco (USA)", "London (UK)"]
  },
  {
    id: "mbbs-doctor-surgeon",
    title: "MBBS Doctor / Surgeon",
    industry: "medical",
    growth: "Evergreen",
    icon: "🏥",
    salary: "₹10,00,000 - ₹30,00,000 per annum",
    description: "Diagnoses patients, provides medical consultations, performs surgeries, and manages healthcare systems. Responsible for patient care, diagnostics, and pharmaceutical prescriptions.",
    skills: ["Clinical Diagnostics", "Patient Care", "Surgical Operations", "Emergency Medicine", "Medical Ethics"],
    tools: ["Diagnostic Systems", "Electronic Health Records (EHR)", "Stethoscope", "Imaging Tools"],
    certifications: ["Basic Life Support (BLS)", "Advanced Cardiovascular Life Support (ACLS)", "USMLE / PLAB"],
    higherStudies: ["MD (Doctor of Medicine)", "MS (Master of Surgery)", "Fellowship in Clinical Cardiology"],
    futureScope: "Evergreen industry with high demand driven by global population growth, aging societies, and advanced telemedicine/robotic surgeries.",
    locations: ["New Delhi", "Mumbai", "Chennai", "Boston (USA)", "London (UK)"]
  },
  {
    id: "financial-analyst-banker",
    title: "Financial Analyst & Banker",
    industry: "finance",
    growth: "32% YoY",
    icon: "📊",
    salary: "₹8,0,000 - ₹24,00,000 per annum",
    description: "Performs financial planning, investment banking operations, portfolio analysis, and financial market evaluations. Guides companies in investment strategies, budgeting, and risk mitigation.",
    skills: ["Financial Analysis", "Portfolio Management", "Market Research", "Valuation modeling", "Risk Assessment"],
    tools: ["Excel", "Bloomberg Terminal", "SQL", "Tableau", "Power BI"],
    certifications: ["Chartered Financial Analyst (CFA)", "Financial Risk Manager (FRM)", "Investment Banking Certification"],
    higherStudies: ["MBA in Finance", "M.S. in Financial Engineering", "M.Com in Investment Banking"],
    futureScope: "Strong growth fueled by global capital expansion, corporate expansions, and algorithmic trading systems.",
    locations: ["Mumbai", "Bengaluru", "Gurugram", "New York (USA)", "Singapore"]
  },
  {
    id: "cloud-architect-admin",
    title: "Cloud Architect & IT Administrator",
    industry: "engineering",
    growth: "35% YoY",
    icon: "☁️",
    salary: "₹9,0,000 - ₹22,0,000 per annum",
    description: "Designs, maintains, and manages robust enterprise cloud infrastructures and system security networks. Oversees server deployments, database management, and cybersecurity protocols.",
    skills: ["Cloud Architecture", "System Administration", "Network Security", "DevOps", "Database Management"],
    tools: ["AWS", "Microsoft Azure", "Linux", "Kubernetes", "Terraform"],
    certifications: ["AWS Certified Solutions Architect - Professional", "Microsoft Certified: Azure Solutions Architect"],
    higherStudies: ["M.Tech in Cyber Security", "M.S. in Cloud Computing", "PG Diploma in Cloud & DevOps"],
    futureScope: "Critical role as global enterprises transition physical operations entirely to secure, serverless cloud architectures.",
    locations: ["Bengaluru", "Hyderabad", "Noida", "Austin (USA)", "Frankfurt (Germany)"]
  },
  {
    id: "corporate-lawyer",
    title: "Corporate Lawyer",
    industry: "law",
    growth: "25% YoY",
    icon: "⚖️",
    salary: "₹7,0,000 - ₹20,00,000 per annum",
    description: "Handles corporate mergers, acquisitions, intellectual property legalities, compliance audits, and commercial contract drafting. Represents corporate clients in commercial disputes.",
    skills: ["Commercial Law", "Contract Drafting", "Legal Research", "Mergers & Acquisitions (M&A)", "Regulatory Compliance"],
    tools: ["Westlaw", "LexisNexis", "DocuSign", "Legal Billing Software"],
    certifications: ["Bar Council License", "Corporate Law Fellowship", "Certified Compliance Officer"],
    higherStudies: ["LLM in Corporate Law", "Master in Business Law", "LLM in Intellectual Property"],
    futureScope: "Continuous demand in global legal markets as regulatory environments, international trade, and IP legalities become more complex.",
    locations: ["New Delhi", "Mumbai", "Bengaluru", "London (UK)", "New York (USA)"]
  },
  {
    id: "business-development-manager",
    title: "Business Development Manager",
    industry: "management",
    growth: "30% YoY",
    icon: "👔",
    salary: "₹6,0,000 - ₹18,0,000 per annum",
    description: "Drives business growth, client partnerships, sales outreach, brand positioning, and product marketing initiatives. Leads negotiations, client relations, and revenue target operations.",
    skills: ["Business Development", "Client Relationship Management (CRM)", "Sales Strategy", "Negotiation", "Lead Generation"],
    tools: ["Salesforce", "HubSpot", "LinkedIn Navigator", "Slack", "MS PowerPoint"],
    certifications: ["Certified Sales Professional (CSP)", "Strategic Management Certification"],
    higherStudies: ["MBA in Marketing / Strategy", "M.S. in Strategic Management", "PGDM in Business Analytics"],
    futureScope: "Evergreen management role. Vital for company expansion, partnership creation, and revenue generation in competitive consumer and B2B markets.",
    locations: ["Mumbai", "Bengaluru", "Pune", "Berlin (Germany)", "Chicago (USA)"]
  }
];

let liveTrendingJobs = [];

function fetchLiveJobs() {
  return new Promise((resolve) => {
    https.get('https://www.arbeitnow.com/api/job-board-api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && Array.isArray(json.data) && json.data.length > 0) {
            resolve(json.data);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

function processLiveJobMarket(apiJobs) {
  const counts = {
    engineering: 0,
    medical: 0,
    finance: 0,
    law: 0,
    management: 0
  };

  const locationsFound = new Set();

  apiJobs.forEach(job => {
    const title = (job.title || '').toLowerCase();
    const tags = (job.tags || []).map(t => t.toLowerCase());
    const desc = (job.description || '').toLowerCase();
    
    if (job.location) locationsFound.add(job.location);

    const matches = (keywords) => {
      return keywords.some(k => title.includes(k) || desc.includes(k) || tags.some(t => t.includes(k)));
    };

    if (matches(['developer', 'engineer', 'program', 'it ', 'software', 'cloud', 'sysadm', 'tech', 'data', 'coder', 'web', 'network', 'system'])) {
      counts.engineering++;
    } else if (matches(['doctor', 'medical', 'health', 'clinical', 'nurse', 'hospital', 'patient', 'pharma', 'biotech', 'physician'])) {
      counts.medical++;
    } else if (matches(['finance', 'banking', 'investment', 'account', 'tax', 'buchhaltung', 'auditing', 'controlling', 'cfa', 'treasury'])) {
      counts.finance++;
    } else if (matches(['law', 'legal', 'compliance', 'attorney', 'advocate', 'lawyer', 'paralegal', 'patent', 'bar council'])) {
      counts.law++;
    } else if (matches(['manager', 'management', 'lead', 'director', 'geschaftsfuhrer', 'business development', 'sales', 'outreach', 'marketing', 'recruiter', 'hr ', 'strategy'])) {
      counts.management++;
    }
  });

  console.log('📊 Crawled Active Job Volume by Sector:', counts);

  const locationsList = Array.from(locationsFound).slice(0, 3);

  const mapped = defaultTrending.map(career => {
    const sectorCount = counts[career.industry] || 0;
    
    let growth = career.growth;
    let label = "Stable Market";
    if (sectorCount > 10) {
      growth = `${40 + Math.min(10, sectorCount)}% YoY`;
      label = "🔥 High Demand";
    } else if (sectorCount > 5) {
      growth = `${30 + sectorCount}% YoY`;
      label = "📈 Active Hiring";
    } else if (sectorCount > 0) {
      growth = `${20 + sectorCount * 2}% YoY`;
      label = "🟢 Moderate Demand";
    } else {
      growth = "Evergreen";
      label = "💼 Stable Demand";
    }

    const dynamicSnippet = sectorCount > 0 
      ? ` [Live Update: We detected ${sectorCount} active job vacancies in the market for this sector this hour.]`
      : ` [Live Update: Market demand remains stable and active.]`;

    const finalLocations = locationsList.length > 0 
      ? [...locationsList, ...career.locations.slice(0, 3)] 
      : career.locations;

    return {
      ...career,
      growth: `${growth} (${label})`,
      description: career.description + dynamicSnippet,
      locations: finalLocations.slice(0, 5),
      liveCount: sectorCount
    };
  });

  mapped.sort((a, b) => b.liveCount - a.liveCount);

  return mapped;
}

async function updateTrendingJobs() {
  console.log('🔄 Fetching live industry job updates...');
  const apiJobs = await fetchLiveJobs();
  if (!apiJobs) {
    console.log('⚠️ Could not fetch live jobs. Using default trending careers.');
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY' && apiKey.trim() !== '') {
    try {
      console.log('🤖 Querying Google Gemini 2.5 Flash to analyze job market trends...');
      const { GoogleGenAI } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey });

      // Prepare a simplified summary of the fetched jobs for the prompt
      const jobsSummary = apiJobs.slice(0, 35).map(j => ({
        title: j.title,
        company: j.company_name,
        tags: j.tags,
        location: j.location
      }));

      const prompt = `Analyze these real-time job listings from the market to determine the top 10 trending high-growth career tracks right now:
${JSON.stringify(jobsSummary)}

For each of the top 10 career tracks, output a valid JSON object matching this exact format:
{
  "title": "...",
  "icon": "...", // a single emoji matching the career
  "growth": "...", // e.g. "45% YoY (🔥 High Demand)" or "35% YoY (📈 Active Hiring)"
  "salary": "...", // e.g. "$120k - $160k" or "₹12L - ₹18L"
  "industry": "engineering" | "medical" | "finance" | "law" | "management",
  "locations": ["...", "..."], // list of 3-4 cities/regions
  "description": "...", // 1-2 sentence description explaining why it is trending based on the active market listings.
  "higherStudies": ["...", "..."], // 2-3 higher education options for this career
  "futureScope": "..." // 1-2 sentences on the long-term career outlook
}

Return ONLY a valid JSON array of these 10 career track objects. Do not include markdown code block backticks (like \`\`\`json) or any additional conversational text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let text = response.text || '';
      // Strip out markdown code blocks if Gemini returns them
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        liveTrendingJobs = parsed;
        console.log(`✅ Google Gemini successfully updated trending jobs with ${parsed.length} dynamic market categories.`);
        return;
      }
    } catch (geminiError) {
      console.error('❌ Google Gemini job market analysis failed, using keyword fallback:', geminiError.message);
    }
  }

  // Fallback to local keyword processing if Gemini is unavailable or fails
  try {
    const mapped = processLiveJobMarket(apiJobs);
    if (mapped.length > 0) {
      liveTrendingJobs = mapped;
      console.log(`✅ Successfully updated live job trends using local keyword fallback.`);
      return;
    }
  } catch (e) {
    console.error('❌ Error processing live jobs locally:', e);
  }
}

// Fetch on startup and then every 10 minutes
updateTrendingJobs();
setInterval(updateTrendingJobs, 10 * 60 * 1000);

app.get('/api/overview', (req, res) => {
  res.json({
    tagline: "Your Dreams Begin With the Right Path",
    trending: liveTrendingJobs.length > 0 ? liveTrendingJobs : defaultTrending
  });
});

const Category = require('./models/Category');
const Course = require('./models/Course');

app.get('/api/after10th/categories', (req, res) => {
  res.json(Category.getAll());
});

app.get('/api/after10th/categories/:categoryId/courses', (req, res) => {
  res.json(Course.getByCategoryId(req.params.categoryId));
});

app.get('/api/after10th/courses/:courseId', (req, res) => {
  const course = Course.getById(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
});

app.get('/api/after10th/streams', (req, res) => res.json(Category.getAll()));
app.get('/api/after10th/jobs', (req, res) => res.json(careerData.after10th.jobs));
app.get('/api/after10th/jobs/:id', (req, res) => {
  const job = careerData.after10th.jobs.find(j => j.id === req.params.id);
  job ? res.json(job) : res.status(404).json({ error: 'Not found' });
});

app.get('/api/after12th/streams', (req, res) => {
  const streams = Object.keys(careerData.after12th).map(key => ({ id: key, label: careerData.after12th[key].label }));
  res.json(streams);
});
app.get('/api/after12th/jobs', (req, res) => res.json(careerData.after12th_jobs || []));
app.get('/api/after12th/sectors/:stream', (req, res) => {
  const stream = careerData.after12th[req.params.stream];
  stream ? res.json(stream.sectors) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/after12th/sector/:stream/:sectorId', (req, res) => {
  const stream = careerData.after12th[req.params.stream];
  if (!stream) return res.status(404).json({ error: 'Not found' });
  const sector = stream.sectors.find(s => s.id === req.params.sectorId);
  sector ? res.json(sector) : res.status(404).json({ error: 'Not found' });
});

app.get('/api/aftergraduation/sectors', (req, res) => {
  res.json(careerData.afterGraduation.sectors.map(s => ({
    id: s.id,
    title: s.title,
    icon: s.icon,
    deptCount: s.departments.length
  })));
});
app.get('/api/aftergraduation/sectors/:sectorId', (req, res) => {
  const sector = careerData.afterGraduation.sectors.find(s => s.id === req.params.sectorId);
  sector ? res.json(sector) : res.status(404).json({ error: 'Sector not found' });
});
app.get('/api/aftergraduation/departments/:deptId', (req, res) => {
  let found = null;
  for (const s of careerData.afterGraduation.sectors) {
    const d = s.departments.find(x => x.id === req.params.deptId);
    if (d) { found = d; break; }
  }
  found ? res.json(found) : res.status(404).json({ error: 'Department not found' });
});

app.get('/api/aftergraduation/higherstudy', (req, res) => res.json(careerData.afterGraduation.higherStudy));
app.get('/api/aftergraduation/jobs', (req, res) => res.json(careerData.afterGraduation.jobs));
app.get('/api/aftergraduation/jobs/:id', (req, res) => {
  const job = careerData.afterGraduation.jobs.find(j => j.id === req.params.id);
  job ? res.json(job) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/aftergraduation/studyabroad', (req, res) => res.json(careerData.afterGraduation.studyAbroad));
app.get('/api/aftergraduation/studyabroad/:id', (req, res) => {
  const c = careerData.afterGraduation.studyAbroad.find(x => x.id === req.params.id);
  c ? res.json(c) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/aftergraduation/higherstudy/:id', (req, res) => {
  const h = careerData.afterGraduation.higherStudy.find(x => x.id === req.params.id);
  h ? res.json(h) : res.status(404).json({ error: 'Not found' });
});

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json([]);
  const results = [];

  // 1. After 10th Categories & Courses
  const Course = require('./models/Course');
  const Category = require('./models/Category');

  try {
    Category.getAll().forEach(cat => {
      if (cat.title.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
        results.push({
          type: '10th Category',
          title: cat.title,
          icon: cat.icon || '📘',
          id: cat.id,
          payload: { type: 'after10th', categoryId: cat.id }
        });
      }
    });

    Course.getAll().forEach(c => {
      if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
        results.push({
          type: '10th Course',
          title: c.title,
          icon: c.icon || '🎯',
          id: c.id,
          payload: { type: 'after10th', categoryId: c.categoryId, courseId: c.id }
        });
      }
    });

    // 2. After 10th Jobs
    if (careerData.after10th && Array.isArray(careerData.after10th.jobs)) {
      careerData.after10th.jobs.forEach(j => {
        if (j.title.toLowerCase().includes(q) || (j.description && j.description.toLowerCase().includes(q))) {
          results.push({
            type: '10th Job',
            title: j.title,
            icon: j.icon || '💼',
            id: j.id,
            payload: { type: 'after10th', tab: 'jobs', jobId: j.id }
          });
        }
      });
    }

    // 3. After 12th Streams, Sectors, Departments
    if (careerData.after12th) {
      Object.keys(careerData.after12th).forEach(streamKey => {
        const stream = careerData.after12th[streamKey];
        if (streamKey.toLowerCase().includes(q) || (stream.label && stream.label.toLowerCase().includes(q))) {
          results.push({
            type: '12th Stream',
            title: stream.label || streamKey,
            icon: '📗',
            id: streamKey,
            payload: { type: 'after12th', streamId: streamKey }
          });
        }
        if (Array.isArray(stream.sectors)) {
          stream.sectors.forEach(sec => {
            if (sec.title.toLowerCase().includes(q)) {
              results.push({
                type: '12th Sector',
                title: `${sec.title} (${streamKey})`,
                icon: sec.icon || '🧭',
                id: sec.id,
                payload: { type: 'after12th', streamId: streamKey, sectorId: sec.id }
              });
            }
            if (Array.isArray(sec.departments)) {
              sec.departments.forEach(dept => {
                if (dept.title.toLowerCase().includes(q) || (dept.description && dept.description.toLowerCase().includes(q))) {
                  results.push({
                    type: '12th Department',
                    title: `${dept.title} (${streamKey})`,
                    icon: '🎯',
                    id: dept.id,
                    payload: { type: 'after12th', streamId: streamKey, sectorId: sec.id, deptId: dept.id }
                  });
                }
              });
            }
          });
        }
      });
    }

    // 4. After 12th Jobs
    if (Array.isArray(careerData.after12th_jobs)) {
      careerData.after12th_jobs.forEach(j => {
        if (j.title.toLowerCase().includes(q) || (j.description && j.description.toLowerCase().includes(q))) {
          results.push({
            type: '12th Job',
            title: j.title,
            icon: j.icon || '💼',
            id: j.id,
            payload: { type: 'after12th', tab: 'jobs', jobId: j.id }
          });
        }
      });
    }

    // 5. Graduation Sectors & Departments
    if (careerData.afterGraduation && Array.isArray(careerData.afterGraduation.sectors)) {
      careerData.afterGraduation.sectors.forEach(sec => {
        if (sec.title.toLowerCase().includes(q)) {
          results.push({
            type: 'Graduation Sector',
            title: sec.title,
            icon: sec.icon || '🎓',
            id: sec.id,
            payload: { type: 'graduation', tab: 'jobs', sectorId: sec.id }
          });
        }
        if (Array.isArray(sec.departments)) {
          sec.departments.forEach(dept => {
            if (dept.title.toLowerCase().includes(q) || (dept.description && dept.description.toLowerCase().includes(q))) {
              results.push({
                type: 'Graduation Department',
                title: dept.title,
                icon: dept.icon || '🎯',
                id: dept.id,
                payload: { type: 'graduation', tab: 'jobs', sectorId: sec.id, deptId: dept.id }
              });
            }
          });
        }
      });
    }

    // 6. Graduation Jobs
    if (careerData.afterGraduation && Array.isArray(careerData.afterGraduation.jobs)) {
      careerData.afterGraduation.jobs.forEach(j => {
        if (j.title.toLowerCase().includes(q) || (j.description && j.description.toLowerCase().includes(q))) {
          results.push({
            type: 'Graduation Job',
            title: j.title,
            icon: j.icon || '👨‍💼',
            id: j.id,
            payload: { type: 'graduation', tab: 'jobs', jobId: j.id }
          });
        }
      });
    }

    // 7. Graduation Higher Study (Master's)
    if (careerData.afterGraduation && Array.isArray(careerData.afterGraduation.higherStudy)) {
      careerData.afterGraduation.higherStudy.forEach(h => {
        if (h.title.toLowerCase().includes(q) || h.sector.toLowerCase().includes(q)) {
          results.push({
            type: "Master's Degree",
            title: h.title,
            icon: '🎓',
            id: h.id,
            payload: { type: 'graduation', tab: 'study', masterId: h.id }
          });
        }
      });
    }

    // 8. Graduation Study Abroad Countries
    if (careerData.afterGraduation && Array.isArray(careerData.afterGraduation.studyAbroad)) {
      careerData.afterGraduation.studyAbroad.forEach(c => {
        if (c.country.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || (c.description && c.description.toLowerCase().includes(q))) {
          results.push({
            type: 'Study Abroad Program',
            title: `${c.country} Study Guide`,
            icon: '✈️',
            id: c.id,
            payload: { type: 'graduation', tab: 'abroad', countryId: c.id }
          });
        }
      });
    }
  } catch (err) {
    console.error('Search query processing error:', err);
  }

  res.json(results.slice(0, 15));
});

// --- PROFILE & SETTINGS ROUTES ---
app.post('/api/profile/update', async (req, res) => {
  try {
    let { userId, name, email } = req.body;
    userId = sanitizeInput(userId);
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();

    if (!userId || !name || !email) {
      return res.status(400).json({ error: 'User ID, name, and email are required' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address format' });
    }

    const user = await DB.updateUserProfile(userId, { name, email });
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error in profile update endpoint:', err);
    if (err.message.includes('already in use')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// --- SAVED CAREERS ROUTES ---
app.get('/api/saved-careers', async (req, res) => {
  try {
    const userId = sanitizeInput(req.query.userId);
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const saved = await DB.getSavedCareers(userId);
    res.status(200).json(saved);
  } catch (err) {
    console.error('Error in get saved-careers endpoint:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/saved-careers', async (req, res) => {
  try {
    const userId = sanitizeInput(req.body.userId);
    const { career } = req.body;

    if (!userId || !career || !career.id || !career.title) {
      return res.status(400).json({ error: 'User ID and structured career details are required' });
    }

    const saved = await DB.addSavedCareer(userId, career);
    res.status(201).json({ success: true, saved });
  } catch (err) {
    console.error('Error in post saved-careers endpoint:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.delete('/api/saved-careers', async (req, res) => {
  try {
    const userId = sanitizeInput(req.query.userId);
    const careerId = sanitizeInput(req.query.careerId);

    if (!userId || !careerId) {
      return res.status(400).json({ error: 'User ID and Career ID are required' });
    }

    await DB.removeSavedCareer(userId, careerId);
    res.status(200).json({ success: true, message: 'Career unsaved successfully' });
  } catch (err) {
    console.error('Error in delete saved-careers endpoint:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/profile/reset-data', async (req, res) => {
  try {
    const userId = sanitizeInput(req.body.userId);
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    await DB.clearUserData(userId);
    res.status(200).json({ success: true, message: 'User data and bookmarks cleared successfully' });
  } catch (err) {
    console.error('Error in reset-data endpoint:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// ─── GOOGLE GEMINI AI RECOMMENDATIONS ENDPOINT ───────────────────

function getMockAIRecommendation(quizType, answers) {
  return {
    title: `AI Recommended Track (${quizType === 'suggestions-10th' ? 'After 10th' : 'After 12th'})`,
    description: `Please set up your GEMINI_API_KEY in the backend/.env file to enable live Gemini AI-powered recommendations. Currently showing a default track based on your selection of "${JSON.stringify(answers)}".`,
    salary: "₹6,0,000 - ₹15,00,000 per annum",
    milestones: [
      { step: "1", title: "Fundamental Learning", description: "Master the basic concepts and foundations of your selected path.", duration: "6 Months" },
      { step: "2", title: "Hands-on Projects", description: "Build 3-4 real-world projects to build your portfolio.", duration: "3 Months" },
      { step: "3", title: "Specialized Certification", description: "Prepare for and earn industry-standard certifications.", duration: "3 Months" },
      { step: "4", title: "Internship & Job Search", description: "Apply for roles and gain industry experience.", duration: "Ongoing" }
    ],
    skillsAcquired: ["Core Competency", "Problem Solving", "Technical Communication", "Project Building"],
    skillsGaps: [
      { skill: "Practical Portfolio", importance: "High", actionPlan: "Develop open-source contributions and deploy live projects on GitHub." },
      { skill: "Interview Readiness", importance: "Medium", actionPlan: "Practice behavioral questions and mock technical challenges." }
    ],
    marketDemand: {
      growthRate: "28% YoY",
      activeVacancies: "High",
      outlook: "Excellent long-term growth across public and private sectors."
    }
  };
}

app.post('/api/ai/recommendation', async (req, res) => {
  try {
    const userId = sanitizeInput(req.body.userId);
    const quizType = sanitizeInput(req.body.quizType);
    const { answers } = req.body;

    if (!userId || !quizType || !answers) {
      return res.status(400).json({ error: 'userId, quizType, and answers are required' });
    }

    // 1. Check database cache
    let cached = null;
    try {
      cached = await DB.getCachedRecommendation(userId, quizType, answers);
    } catch (cacheErr) {
      console.warn('⚠️ Warning: Failed to query recommendation cache:', cacheErr.message);
    }

    if (cached) {
      console.log('🎯 Returning cached recommendation');
      return res.status(200).json({ success: true, data: cached.recommendation, cached: true });
    }

    // 2. Generate recommendation
    let recommendation;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.warn('⚠️ GEMINI_API_KEY is missing or empty. Using mock fallback recommendation.');
      recommendation = getMockAIRecommendation(quizType, answers);
    } else {
      console.log('🤖 Querying Google Gemini API...');
      try {
        const { GoogleGenAI } = require('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a career guidance assistant for Indian students.

Give practical and realistic career recommendations.

Student Details:
- Education Level: ${quizType === 'suggestions-10th' ? 'After 10th' : 'After 12th'}
- Interests: ${Array.isArray(answers) ? answers.join(', ') : JSON.stringify(answers)}
- Country: India

Rules:
- Recommend only practical careers for Indian students
- Avoid research scientist and overly advanced careers
- Use INR salaries instead of dollars
- Keep explanation simple and student-friendly
- Suggest courses, skills, roadmap, and salary
- Focus on careers common in India

Output format:
You must output valid JSON conforming exactly to the schema:
- Map 'Career Name' to the 'title' property.
- Map 'Why suitable' and general explanation to the 'description' property.
- Map 'Salary in INR' (e.g. ₹X,00,000 - ₹Y,00,000 per annum) to the 'salary' property.
- Map 'Step-by-step roadmap' to the 'milestones' array property (each milestone must have step, title, description, and duration).
- Map 'Skills Needed' to the 'skillsAcquired' array property.
- Map 'Required Course' and action plans for skill improvement to the 'skillsGaps' array property.
- Map 'Future Scope' to the 'marketDemand' property (with growthRate, activeVacancies, and outlook).`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                title: { type: 'STRING' },
                description: { type: 'STRING' },
                salary: { type: 'STRING' },
                milestones: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      step: { type: 'STRING' },
                      title: { type: 'STRING' },
                      description: { type: 'STRING' },
                      duration: { type: 'STRING' }
                    },
                    required: ['step', 'title', 'description', 'duration']
                  }
                },
                skillsAcquired: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                skillsGaps: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      skill: { type: 'STRING' },
                      importance: { type: 'STRING' },
                      actionPlan: { type: 'STRING' }
                    },
                    required: ['skill', 'importance', 'actionPlan']
                  }
                },
                marketDemand: {
                  type: 'OBJECT',
                  properties: {
                    growthRate: { type: 'STRING' },
                    activeVacancies: { type: 'STRING' },
                    outlook: { type: 'STRING' }
                  },
                  required: ['growthRate', 'activeVacancies', 'outlook']
                }
              },
              required: ['title', 'description', 'salary', 'milestones', 'skillsAcquired', 'skillsGaps', 'marketDemand']
            }
          }
        });

        recommendation = JSON.parse(response.text);
      } catch (geminiError) {
        console.error('❌ Google Gemini API error or JSON parsing failed. Falling back to mock recommendation:', geminiError.message);
        recommendation = getMockAIRecommendation(quizType, answers);
      }
    }

    // 3. Cache inside Firestore
    try {
      await DB.cacheRecommendation(userId, quizType, answers, recommendation);
      console.log('✅ Recommendation successfully generated and cached in database');
    } catch (cacheWriteErr) {
      console.warn('⚠️ Warning: Failed to write recommendation cache:', cacheWriteErr.message);
    }

    res.status(200).json({ success: true, data: recommendation, cached: false });
  } catch (err) {
    console.error('Error generating AI career recommendation:', err);
    res.status(500).json({ error: 'Failed to generate recommendation: ' + err.message });
  }
});

app.get('/api/technologies', async (req, res) => {
  try {
    const techs = await DB.getTechnologies();
    res.json(techs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── CHATBOT PROFESSIONAL AI ASSISTANT ENDPOINT ──────────────────

// ─── CHATBOT & PREMIUM AI WORKSPACE SYSTEM ──────────────────

function detectSmartMode(promptText = '', fileInfo = null) {
  const p = promptText.toLowerCase();

  if (fileInfo || p.includes('pdf') || p.includes('docx') || p.includes('document') || p.includes('file') || p.includes('summarize file') || p.includes('attached')) {
    return { key: 'document', name: 'Document Assistant', icon: '📄', description: 'Document Analysis & Content Extraction' };
  }
  if (p.includes('resume') || p.includes('cv') || p.includes('portfolio') || p.includes('cover letter') || p.includes('job application')) {
    return { key: 'resume', name: 'Resume Assistant', icon: '💼', description: 'Career & Resume Optimization' };
  }
  if (p.includes('code') || p.includes('debug') || p.includes('function') || p.includes('api') || p.includes('database') || p.includes('sql') || p.includes('bug') || p.includes('python') || p.includes('javascript') || p.includes('react') || p.includes('flutter') || p.includes('java') || p.includes('c++') || p.includes('html') || p.includes('css') || p.includes('json')) {
    if (p.includes('debug') || p.includes('error') || p.includes('fix') || p.includes('exception')) {
      return { key: 'debugging', name: 'Debugging Assistant', icon: '🐞', description: 'Code Debugging & Error Diagnostics' };
    }
    return { key: 'coding', name: 'Coding Assistant', icon: '💻', description: 'Software Development & Architecture' };
  }
  if (p.includes('quiz') || p.includes('test') || p.includes('study') || p.includes('flashcard') || p.includes('exam') || p.includes('concept') || p.includes('learn') || p.includes('syllabus') || p.includes('roadmap')) {
    return { key: 'study', name: 'Study Assistant', icon: '📚', description: 'Academic Guidance & Test Prep' };
  }
  if (p.includes('email') || p.includes('subject line') || p.includes('outreach') || p.includes('newsletter') || p.includes('reply')) {
    return { key: 'email', name: 'Email Assistant', icon: '✉️', description: 'Professional Email Drafting' };
  }
  if (p.includes('translate') || p.includes('translation') || p.includes('in hindi') || p.includes('in telugu') || p.includes('in spanish') || p.includes('in french') || p.includes('language')) {
    return { key: 'translation', name: 'Translation Assistant', icon: '🌐', description: 'Multilingual & Local Translation' };
  }
  if (p.includes('plan') || p.includes('schedule') || p.includes('strategy') || p.includes('milestone') || p.includes('gantt') || p.includes('timeline')) {
    return { key: 'planning', name: 'Planning Assistant', icon: '🗺️', description: 'Project & Execution Planning' };
  }
  if (p.includes('brainstorm') || p.includes('idea') || p.includes('creative') || p.includes('concept') || p.includes('innovate')) {
    return { key: 'brainstorming', name: 'Brainstorming Assistant', icon: '💡', description: 'Creative Ideation & Innovation' };
  }
  if (p.includes('ui') || p.includes('ux') || p.includes('design') || p.includes('figma') || p.includes('css') || p.includes('layout') || p.includes('wireframe')) {
    return { key: 'uiux', name: 'UI/UX Assistant', icon: '🎨', description: 'Interface & Visual Experience Design' };
  }
  if (p.includes('data') || p.includes('graph') || p.includes('metrics') || p.includes('table') || p.includes('chart') || p.includes('excel') || p.includes('statistics')) {
    return { key: 'data_analysis', name: 'Data Analysis Assistant', icon: '📊', description: 'Data Insights & Analytics' };
  }
  if (p.includes('prompt') || p.includes('system instruction') || p.includes('ai response') || p.includes('llm')) {
    return { key: 'prompt_engineering', name: 'Prompt Engineering Assistant', icon: '⚡', description: 'LLM Prompt Optimization' };
  }
  if (p.includes('business') || p.includes('startup') || p.includes('market') || p.includes('competitor') || p.includes('pitch') || p.includes('revenue')) {
    return { key: 'business', name: 'Business Assistant', icon: '🏢', description: 'Business Strategy & Growth' };
  }
  if (p.includes('career') || p.includes('job') || p.includes('salary') || p.includes('stream') || p.includes('degree') || p.includes('college')) {
    return { key: 'career', name: 'Career Assistant', icon: '🎯', description: 'Career Guidance & Skill Roadmaps' };
  }
  if (p.includes('research') || p.includes('paper') || p.includes('source') || p.includes('citation') || p.includes('deep dive')) {
    return { key: 'research', name: 'Research Assistant', icon: '🔍', description: 'In-depth Technical & Academic Research' };
  }

  return { key: 'writing', name: 'Writing Assistant', icon: '✍️', description: 'Content Writing & Refinement' };
}

function buildDynamicSystemInstruction(mode) {
  return `You are "CareerPath AI - ${mode.name}", an elite AI intelligence engine powered by Google Gemini.
Your objective is to provide high-value, production-ready, beautiful, and complete assistance.

GLOBAL BEHAVIOR & RULES:
1. Always adapt to the user's intent. Do not generate incomplete snippets or truncated output.
2. Structure your output with clean Markdown:
   - Use bold titles, bullet points, numbered lists, and Markdown tables where appropriate.
   - For code, ALWAYS use fenced code blocks with language identifiers (e.g. \`\`\`python, \`\`\`javascript, \`\`\`flutter, \`\`\`html, \`\`\`sql). Include line comments and production-grade logic.
3. For monetary estimations, default to Indian Rupees (₹) unless asked otherwise.
4. Mode focus: You are currently acting in **${mode.name}** mode. Specialize your vocabulary, guidance, and structure to excel at ${mode.description}.
5. Response headers to include naturally when helpful:
   - 🎯 **Direct Answer / Solution**
   - 📖 **Detailed Explanation / Insights**
   - 🛣 **Step-by-Step Action Roadmap**
   - 💡 **Pro Tips & Best Practices**
   - ✅ **Next Steps**`;
}

function generateSuggestedFollowUps(mode, promptText, aiResponse) {
  const p = promptText.toLowerCase();

  if (mode.key === 'coding' || mode.key === 'debugging') {
    return [
      "💡 Optimize performance & refactor this code",
      "🧪 Generate unit tests & test cases",
      "🔒 Review for security vulnerabilities & edge cases"
    ];
  }
  if (mode.key === 'document') {
    return [
      "📌 Highlight top 5 key takeaways",
      "📝 Generate a 3-bullet executive summary",
      "❓ Create a 5-question comprehension quiz based on this"
    ];
  }
  if (mode.key === 'study' || mode.key === 'career') {
    return [
      "🗺️ Create a 30-day step-by-step learning roadmap",
      "🎯 Generate 5 practice quiz questions with answer keys",
      "💼 What are top high-paying industry job roles in this field?"
    ];
  }
  if (mode.key === 'resume') {
    return [
      "⚡ Enhance impact verbs & quantifiable achievements",
      "🎯 Format for ATS keyword optimization",
      "✉️ Draft a matching high-impact cover letter"
    ];
  }

  return [
    "📝 Rewrite in a more professional tone",
    "⚡ Expand this into a comprehensive guide",
    "💡 Provide 3 alternative creative approaches"
  ];
}

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { message, history, screenContext, image, customAction } = req.body;
    const sanitizedMsg = message ? message.trim() : '';

    const mode = detectSmartMode(sanitizedMsg, image);
    const systemInst = buildDynamicSystemInstruction(mode);

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
      const followUps = generateSuggestedFollowUps(mode, sanitizedMsg, '');
      return res.status(200).json({
        success: true,
        mode: mode,
        suggestedFollowUps: followUps,
        response: `🎯 **Direct Answer (Offline Assistant Mode)**\n\nGoogle Gemini API is currently offline because no valid \`GEMINI_API_KEY\` was configured in the backend \`.env\` file.\n\n📖 **Explanation**\nI am currently running in structured offline mode to ensure your application continues working seamlessly.\n\n🛣 **Step-by-Step Setup Guide**\n1. Open your \`backend/.env\` file.\n2. Add your key: \`GEMINI_API_KEY=AIzaSy...\`\n3. Save and restart the backend server.\n\n💡 **Current Context & Mode**\n- **Detected Mode:** ${mode.icon} ${mode.name}\n- **Screen Location:** ${screenContext?.currentPage || 'Workspace'}`
      });
    }

    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const contents = [];

    if (Array.isArray(history) && history.length > 0) {
      history.forEach(turn => {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }]
          });
        }
      });
    }

    let promptText = '';
    if (screenContext && screenContext.currentPage) {
      promptText += `[APP CONTEXT: User is viewing page '${screenContext.currentPage}' with selected target '${screenContext.selectedTrendingJob || 'None'}']\n`;
    }
    if (customAction) {
      promptText += `[ACTION INSTRUCTION: Apply '${customAction}' to the request below]:\n`;
    }

    promptText += sanitizedMsg;

    const userTurn = {
      role: 'user',
      parts: []
    };

    if (image && image.base64 && image.mimeType) {
      userTurn.parts.push({
        inlineData: {
          data: image.base64,
          mimeType: image.mimeType
        }
      });
    }

    userTurn.parts.push({ text: promptText });
    contents.push(userTurn);

    console.log(`🤖 Chat [${mode.name}]: Querying Gemini API...`);

    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let responseText = '';
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInst
          }
        });
        responseText = response.text || '';
        if (responseText) break;
      } catch (e) {
        lastError = e;
        console.warn(`⚠️ Gemini model ${modelName} call failed:`, e.message);
      }
    }

    if (!responseText) {
      throw lastError || new Error("Failed to receive response from Gemini models.");
    }

    const followUps = generateSuggestedFollowUps(mode, sanitizedMsg, responseText);

    res.status(200).json({
      success: true,
      mode: mode,
      suggestedFollowUps: followUps,
      response: responseText
    });
  } catch (err) {
    console.error('Error in chatbot backend:', err);
    res.status(200).json({
      success: true,
      mode: { key: 'general', name: 'AI Assistant', icon: '🤖', description: 'General AI Assistant' },
      suggestedFollowUps: ["Try resubmitting prompt", "Simplify query", "Check system logs"],
      response: `🎯 **Direct Answer**\nAn error occurred while contacting the Gemini service: ${err.message}.\n\n📖 **Troubleshooting**\n1. Verify your network connection.\n2. Ensure your \`GEMINI_API_KEY\` is valid and has remaining quota.`
    });
  }
});

// SSE Streaming Endpoint for Real-time Chunked Delivery
app.post('/api/chat/stream', async (req, res) => {
  const { message, history, screenContext, image, customAction } = req.body;
  const sanitizedMsg = message ? message.trim() : '';
  const mode = detectSmartMode(sanitizedMsg, image);
  const systemInst = buildDynamicSystemInstruction(mode);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY' || apiKey.trim() === '') {
    const offlineMsg = `🎯 **Direct Answer (Offline Mode)**\nGoogle Gemini API key is missing. Please set \`GEMINI_API_KEY\` in your \`backend/.env\` file.\n\nMode Detected: ${mode.icon} ${mode.name}`;
    res.write(`data: ${JSON.stringify({ chunk: offlineMsg, done: true, mode })}\n\n`);
    return res.end();
  }

  try {
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      history.forEach(turn => {
        if (turn.role && turn.text) {
          contents.push({ role: turn.role === 'user' ? 'user' : 'model', parts: [{ text: turn.text }] });
        }
      });
    }

    let promptText = customAction ? `[ACTION: ${customAction}]\n${sanitizedMsg}` : sanitizedMsg;
    const userTurn = { role: 'user', parts: [] };
    if (image && image.base64 && image.mimeType) {
      userTurn.parts.push({ inlineData: { data: image.base64, mimeType: image.mimeType } });
    }
    userTurn.parts.push({ text: promptText });
    contents.push(userTurn);

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: { systemInstruction: systemInst }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ chunk: chunk.text, mode })}\n\n`);
      }
    }

    const followUps = generateSuggestedFollowUps(mode, sanitizedMsg, '');
    res.write(`data: ${JSON.stringify({ done: true, suggestedFollowUps: followUps, mode })}\n\n`);
    res.end();
  } catch (e) {
    console.error('Error in SSE streaming chat:', e);
    res.write(`data: ${JSON.stringify({ error: e.message, done: true })}\n\n`);
    res.end();
  }
});

const DEFAULT_GAME_DATA = {
  coins: 200,
  xp: 0,
  streak: 0,
  lastPlayedDate: '',
  dailyCompletedDate: '',
  bestScore: 0,
  highestLevel: 1,
  gamesPlayed: 0,
  accuracy: 100.0,
  longestStreak: 0,
  avgReaction: 0
};

// --- GAME DATA ROUTES ---
app.get('/api/game-data', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }
    const data = await DB.getGameData(userId);
    if (!data) {
      return res.status(200).json({ ...DEFAULT_GAME_DATA, userId });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching game data:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/game-data', async (req, res) => {
  try {
    const { userId, gameData } = req.body;
    if (!userId || !gameData) {
      return res.status(400).json({ error: 'userId and gameData are required' });
    }
    await DB.saveGameData(userId, gameData);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving game data:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// --- ARITHMETIC RAIN GAME ROUTES ---
app.get('/api/arithmetic-rain/user-data', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId parameter is required' });
    }
    const data = await DB.getArithmeticRainUserData(userId);
    if (!data) {
      // Return default template
      return res.status(200).json({
        userId,
        history: [],
        statistics: {
          gamesPlayed: 0,
          totalSolved: 0,
          highestScorePractice: 0,
          highestScoreClassic: 0,
          highestScoreEndless: 0,
          highestScoreTimed: 0,
          accuracySum: 0,
          avgResponseTime: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          missedQuestions: 0
        },
        achievements: [],
        dailyChallenge: {
          lastPlayedDate: '',
          streak: 0,
          longestStreak: 0
        },
        settings: {
          music: true,
          sound: true,
          vibration: true
        }
      });
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching arithmetic rain user data:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/arithmetic-rain/save-session', async (req, res) => {
  try {
    const { userId, session } = req.body;
    if (!userId || !session) {
      return res.status(400).json({ error: 'userId and session are required' });
    }

    // 1. Update Global Profile Coins/XP
    let globalData = await DB.getGameData(userId);
    if (!globalData) {
      globalData = { coins: 200, xp: 0, streak: 0, lastPlayedDate: '' };
    }
    const earnedCoins = parseInt(session.coins, 10) || 0;
    const earnedXp = parseInt(session.xp, 10) || 0;
    globalData.coins = (globalData.coins || 0) + earnedCoins;
    globalData.xp = (globalData.xp || 0) + earnedXp;
    await DB.saveGameData(userId, globalData);

    // 2. Fetch or Init Game-Specific Data
    let rainData = await DB.getArithmeticRainUserData(userId);
    if (!rainData) {
      rainData = {
        userId,
        history: [],
        statistics: {
          gamesPlayed: 0,
          totalSolved: 0,
          highestScorePractice: 0,
          highestScoreClassic: 0,
          highestScoreEndless: 0,
          highestScoreTimed: 0,
          accuracySum: 0,
          avgResponseTime: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          missedQuestions: 0
        },
        achievements: [],
        dailyChallenge: {
          lastPlayedDate: '',
          streak: 0,
          longestStreak: 0
        },
        settings: {
          music: true,
          sound: true,
          vibration: true
        }
      };
    }

    // Ensure statistics structure is correct
    if (!rainData.statistics) {
      rainData.statistics = {
        gamesPlayed: 0, totalSolved: 0,
        highestScorePractice: 0, highestScoreClassic: 0,
        highestScoreEndless: 0, highestScoreTimed: 0,
        accuracySum: 0, avgResponseTime: 0,
        correctAnswers: 0, wrongAnswers: 0, missedQuestions: 0
      };
    }
    if (!rainData.history) rainData.history = [];
    if (!rainData.achievements) rainData.achievements = [];

    const stats = rainData.statistics;
    const sessionScore = parseInt(session.score, 10) || 0;
    const sessionCorrect = parseInt(session.correct, 10) || 0;
    const sessionWrong = parseInt(session.wrong, 10) || 0;
    const sessionMissed = parseInt(session.missed, 10) || 0;
    const sessionAccuracy = parseFloat(session.accuracy) || 0;
    const sessionAvgResponseTime = parseFloat(session.avgResponseTime) || 0;

    // 3. Update Statistics
    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    stats.totalSolved = (stats.totalSolved || 0) + sessionCorrect;
    stats.correctAnswers = (stats.correctAnswers || 0) + sessionCorrect;
    stats.wrongAnswers = (stats.wrongAnswers || 0) + sessionWrong;
    stats.missedQuestions = (stats.missedQuestions || 0) + sessionMissed;

    // Highest score per mode
    const mode = session.mode;
    if (mode === 'practice') {
      stats.highestScorePractice = Math.max(stats.highestScorePractice || 0, sessionScore);
    } else if (mode === 'classic') {
      stats.highestScoreClassic = Math.max(stats.highestScoreClassic || 0, sessionScore);
    } else if (mode === 'endless') {
      stats.highestScoreEndless = Math.max(stats.highestScoreEndless || 0, sessionScore);
    } else if (mode === 'timed') {
      stats.highestScoreTimed = Math.max(stats.highestScoreTimed || 0, sessionScore);
    }

    // Cumulative accuracy sum
    stats.accuracySum = (stats.accuracySum || 0) + sessionAccuracy;

    // Rolling average response time
    if (sessionAvgResponseTime > 0) {
      if (!stats.avgResponseTime || stats.avgResponseTime === 0) {
        stats.avgResponseTime = sessionAvgResponseTime;
      } else {
        stats.avgResponseTime = parseFloat(((stats.avgResponseTime + sessionAvgResponseTime) / 2).toFixed(2));
      }
    }

    // 4. Append to History
    rainData.history.unshift({
      date: session.date || new Date().toISOString(),
      mode: session.mode || 'classic',
      score: sessionScore,
      accuracy: sessionAccuracy,
      correct: sessionCorrect,
      wrong: sessionWrong,
      missed: sessionMissed,
      combo: parseInt(session.combo, 10) || 0,
      duration: parseInt(session.duration, 10) || 0,
      coins: earnedCoins,
      xp: earnedXp
    });
    if (rainData.history.length > 50) {
      rainData.history = rainData.history.slice(0, 50);
    }

    // 5. Evaluate Achievements
    const newAchievements = [];
    const checkUnlock = (id, title, desc, icon) => {
      if (!rainData.achievements.includes(id)) {
        rainData.achievements.push(id);
        newAchievements.push({ id, title, desc, icon });
      }
    };

    if (stats.totalSolved >= 10) checkUnlock('novice', 'Math Novice', 'Solve 10 arithmetic questions correctly.', '🥉');
    if (stats.totalSolved >= 100) checkUnlock('scholar', 'Math Scholar', 'Solve 100 arithmetic questions correctly.', '🥈');
    if (stats.totalSolved >= 500) checkUnlock('einstein', 'Arithmetic Einstein', 'Solve 500 arithmetic questions correctly.', '🧠');
    if (sessionAccuracy === 100 && sessionCorrect >= 15) checkUnlock('perfectionist', 'Perfect Brain', 'Complete a session with 100% accuracy (min. 15 questions solved).', '💯');
    if (sessionScore >= 1000) checkUnlock('rain_master', 'Rain Master', 'Score 1000+ points in a single session.', '👑');
    if (mode === 'endless' && sessionScore >= 500) checkUnlock('endless_survivor', 'Endless Survivor', 'Score 500+ points in Endless mode.', '🛡️');
    if (sessionAvgResponseTime > 0 && sessionAvgResponseTime < 1.5 && sessionCorrect >= 10) checkUnlock('speed_demon', 'Speed Demon', 'Achieve average response time under 1.5s (min. 10 solved).', '⚡');

    await DB.saveArithmeticRainUserData(userId, rainData);

    res.status(200).json({
      success: true,
      statistics: stats,
      achievements: rainData.achievements,
      newAchievements,
      globalCoins: globalData.coins,
      globalXp: globalData.xp
    });
  } catch (err) {
    console.error('Error saving game session:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/arithmetic-rain/save-daily', async (req, res) => {
  try {
    const { userId, userName, score, accuracy, duration, date } = req.body;
    if (!userId || !date) {
      return res.status(400).json({ error: 'userId and date are required' });
    }

    let rainData = await DB.getArithmeticRainUserData(userId);
    if (!rainData) {
      rainData = {
        userId,
        history: [],
        statistics: { gamesPlayed: 0, totalSolved: 0 },
        achievements: [],
        dailyChallenge: { lastPlayedDate: '', streak: 0, longestStreak: 0 },
        settings: { music: true, sound: true, vibration: true }
      };
    }

    if (!rainData.dailyChallenge) {
      rainData.dailyChallenge = { lastPlayedDate: '', streak: 0, longestStreak: 0 };
    }

    if (rainData.dailyChallenge.lastPlayedDate === date) {
      return res.status(400).json({ error: 'Daily Challenge already completed for today.' });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = rainData.dailyChallenge.streak || 0;
    if (rainData.dailyChallenge.lastPlayedDate === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    const longestStreak = Math.max(rainData.dailyChallenge.longestStreak || 0, currentStreak);

    rainData.dailyChallenge.lastPlayedDate = date;
    rainData.dailyChallenge.streak = currentStreak;
    rainData.dailyChallenge.longestStreak = longestStreak;

    const newAchievements = [];
    if (currentStreak >= 3) {
      if (!rainData.achievements.includes('daily_commuter')) {
        rainData.achievements.push('daily_commuter');
        newAchievements.push({
          id: 'daily_commuter',
          title: 'Daily Commuter',
          desc: 'Play the Daily Challenge 3 days in a row.',
          icon: '📅'
        });
      }
    }

    await DB.submitDailyChallengeScore(userId, userName, score, accuracy, duration, date);

    let globalData = await DB.getGameData(userId);
    if (!globalData) {
      globalData = { coins: 200, xp: 0, streak: 0, lastPlayedDate: '' };
    }
    const rewardCoins = 50;
    const rewardXp = 100;
    globalData.coins = (globalData.coins || 0) + rewardCoins;
    globalData.xp = (globalData.xp || 0) + rewardXp;
    await DB.saveGameData(userId, globalData);

    if (!rainData.statistics) {
      rainData.statistics = {
        gamesPlayed: 0, totalSolved: 0,
        highestScorePractice: 0, highestScoreClassic: 0,
        highestScoreEndless: 0, highestScoreTimed: 0,
        accuracySum: 0, avgResponseTime: 0,
        correctAnswers: 0, wrongAnswers: 0, missedQuestions: 0
      };
    }
    const stats = rainData.statistics;
    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    stats.totalSolved = (stats.totalSolved || 0) + (parseInt(req.body.correct, 10) || 0);
    stats.correctAnswers = (stats.correctAnswers || 0) + (parseInt(req.body.correct, 10) || 0);
    stats.wrongAnswers = (stats.wrongAnswers || 0) + (parseInt(req.body.wrong, 10) || 0);
    stats.missedQuestions = (stats.missedQuestions || 0) + (parseInt(req.body.missed, 10) || 0);
    stats.accuracySum = (stats.accuracySum || 0) + (parseFloat(accuracy) || 0);

    if (!rainData.history) rainData.history = [];
    rainData.history.unshift({
      date,
      mode: 'daily',
      score: parseInt(score, 10) || 0,
      accuracy: parseFloat(accuracy) || 0,
      correct: parseInt(req.body.correct, 10) || 0,
      wrong: parseInt(req.body.wrong, 10) || 0,
      missed: parseInt(req.body.missed, 10) || 0,
      combo: parseInt(req.body.combo, 10) || 0,
      duration: parseInt(duration, 10) || 0,
      coins: rewardCoins,
      xp: rewardXp
    });

    await DB.saveArithmeticRainUserData(userId, rainData);

    const leaderboard = await DB.getDailyLeaderboard(date);

    res.status(200).json({
      success: true,
      leaderboard,
      dailyChallenge: rainData.dailyChallenge,
      statistics: stats,
      achievements: rainData.achievements,
      newAchievements,
      globalCoins: globalData.coins,
      globalXp: globalData.xp
    });
  } catch (err) {
    console.error('Error submitting daily challenge:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.get('/api/arithmetic-rain/leaderboard', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'date parameter is required' });
    }
    const leaderboard = await DB.getDailyLeaderboard(date);
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/arithmetic-rain/settings', async (req, res) => {
  try {
    const { userId, settings } = req.body;
    if (!userId || !settings) {
      return res.status(400).json({ error: 'userId and settings are required' });
    }
    let rainData = await DB.getArithmeticRainUserData(userId);
    if (!rainData) {
      rainData = { userId };
    }
    rainData.settings = settings;
    await DB.saveArithmeticRainUserData(userId, rainData);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error saving settings:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

app.post('/api/arithmetic-rain/reset-stats', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    await DB.resetArithmeticRainStats(userId);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error resetting statistics:', err);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// Catch-all route to serve the React application's index.html file for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ CareerPath AI Monolith running on http://localhost:${PORT}`));

