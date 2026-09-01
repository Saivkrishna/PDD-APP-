class CareerDataRepository {
  // ─── DEFAULT TRENDING CAREERS ──────────────────────────────────────
  static const List<Map<String, dynamic>> defaultTrending = [
    {
      "id": "software-ai-engineer",
      "title": "Software & AI Engineer",
      "industry": "engineering",
      "growth": "42% YoY (🔥 High Demand)",
      "icon": "💻",
      "salary": "₹12,00,000 - ₹35,00,000 per annum",
      "description": "Designs, develops, and deploys scalable software products and intelligent artificial intelligence systems. Focuses on coding, algorithm optimization, and machine learning pipelines.",
      "skills": ["Software Engineering", "Machine Learning", "System Design", "Algorithm Optimization", "Cloud Computing"],
      "tools": ["Python", "JavaScript", "React", "Docker", "AWS", "Git"],
      "certifications": ["AWS Certified Solutions Architect", "Google Professional Cloud Developer"],
      "higherStudies": ["M.Tech in Artificial Intelligence", "M.S. in Computer Science", "Ph.D. in Computer Engineering"],
      "futureScope": "High demand with the exponential growth of artificial intelligence, automated software platforms, and digital cloud migrations.",
      "locations": ["Bengaluru", "Hyderabad", "Pune", "San Francisco (USA)", "London (UK)"]
    },
    {
      "id": "mbbs-doctor-surgeon",
      "title": "MBBS Doctor / Surgeon",
      "industry": "medical",
      "growth": "Evergreen (💼 Stable Demand)",
      "icon": "🏥",
      "salary": "₹10,00,000 - ₹30,00,000 per annum",
      "description": "Diagnoses patients, provides medical consultations, performs surgeries, and manages healthcare systems. Responsible for patient care, diagnostics, and pharmaceutical prescriptions.",
      "skills": ["Clinical Diagnostics", "Patient Care", "Surgical Operations", "Emergency Medicine", "Medical Ethics"],
      "tools": ["Diagnostic Systems", "Electronic Health Records (EHR)", "Stethoscope", "Imaging Tools"],
      "certifications": ["Basic Life Support (BLS)", "Advanced Cardiovascular Life Support (ACLS)", "USMLE / PLAB"],
      "higherStudies": ["MD (Doctor of Medicine)", "MS (Master of Surgery)", "Fellowship in Clinical Cardiology"],
      "futureScope": "Evergreen industry with high demand driven by global population growth, aging societies, and advanced telemedicine/robotic surgeries.",
      "locations": ["New Delhi", "Mumbai", "Chennai", "Boston (USA)", "London (UK)"]
    },
    {
      "id": "financial-analyst-banker",
      "title": "Financial Analyst & Banker",
      "industry": "finance",
      "growth": "32% YoY (📈 Active Hiring)",
      "icon": "📊",
      "salary": "₹8,00,000 - ₹24,00,000 per annum",
      "description": "Performs financial planning, investment banking operations, portfolio analysis, and financial market evaluations. Guides companies in investment strategies, budgeting, and risk mitigation.",
      "skills": ["Financial Analysis", "Portfolio Management", "Market Research", "Valuation modeling", "Risk Assessment"],
      "tools": ["Excel", "Bloomberg Terminal", "SQL", "Tableau", "Power BI"],
      "certifications": ["Chartered Financial Analyst (CFA)", "Financial Risk Manager (FRM)", "Investment Banking Certification"],
      "higherStudies": ["MBA in Finance", "M.S. in Financial Engineering", "M.Com in Investment Banking"],
      "futureScope": "Strong growth fueled by global capital expansion, corporate expansions, and algorithmic trading systems.",
      "locations": ["Mumbai", "Bengaluru", "Gurugram", "New York (USA)", "Singapore"]
    },
    {
      "id": "cloud-architect-admin",
      "title": "Cloud Architect & IT Administrator",
      "industry": "engineering",
      "growth": "35% YoY (🔥 High Demand)",
      "icon": "☁️",
      "salary": "₹9,00,000 - ₹22,00,000 per annum",
      "description": "Designs, maintains, and manages robust enterprise cloud infrastructures and system security networks. Oversees server deployments, database management, and cybersecurity protocols.",
      "skills": ["Cloud Architecture", "System Administration", "Network Security", "DevOps", "Database Management"],
      "tools": ["AWS", "Microsoft Azure", "Linux", "Kubernetes", "Terraform"],
      "certifications": ["AWS Certified Solutions Architect - Professional", "Microsoft Certified: Azure Solutions Architect"],
      "higherStudies": ["M.Tech in Cyber Security", "M.S. in Cloud Computing", "PG Diploma in Cloud & DevOps"],
      "futureScope": "Critical role as global enterprises transition physical operations entirely to secure, serverless cloud architectures.",
      "locations": ["Bengaluru", "Hyderabad", "Noida", "Austin (USA)", "Frankfurt (Germany)"]
    },
    {
      "id": "corporate-lawyer",
      "title": "Corporate Lawyer",
      "industry": "law",
      "growth": "25% YoY (🟢 Moderate Demand)",
      "icon": "⚖️",
      "salary": "₹7,00,000 - ₹20,00,000 per annum",
      "description": "Handles corporate mergers, acquisitions, intellectual property legalities, compliance audits, and commercial contract drafting. Represents corporate clients in commercial disputes.",
      "skills": ["Commercial Law", "Contract Drafting", "Legal Research", "Mergers & Acquisitions (M&A)", "Regulatory Compliance"],
      "tools": ["Westlaw", "LexisNexis", "DocuSign", "Legal Billing Software"],
      "certifications": ["Bar Council License", "Corporate Law Fellowship", "Certified Compliance Officer"],
      "higherStudies": ["LLM in Corporate Law", "Master in Business Law", "LLM in Intellectual Property"],
      "futureScope": "Continuous demand in global legal markets as regulatory environments, international trade, and IP legalities become more complex.",
      "locations": ["New Delhi", "Mumbai", "Bengaluru", "London (UK)", "New York (USA)"]
    },
    {
      "id": "business-development-manager",
      "title": "Business Development Manager",
      "industry": "management",
      "growth": "30% YoY (📈 Active Hiring)",
      "icon": "👔",
      "salary": "₹6,00,000 - ₹18,00,000 per annum",
      "description": "Drives business growth, client partnerships, sales outreach, brand positioning, and product marketing initiatives. Leads negotiations, client relations, and revenue target operations.",
      "skills": ["Business Development", "Client Relationship Management (CRM)", "Sales Strategy", "Negotiation", "Lead Generation"],
      "tools": ["Salesforce", "HubSpot", "LinkedIn Navigator", "Slack", "MS PowerPoint"],
      "certifications": ["Certified Sales Professional (CSP)", "Strategic Management Certification"],
      "higherStudies": ["MBA in Marketing / Strategy", "M.S. in Strategic Management", "PGDM in Business Analytics"],
      "futureScope": "Evergreen management role. Vital for company expansion, partnership creation, and revenue generation in competitive consumer and B2B markets.",
      "locations": ["Mumbai", "Bengaluru", "Pune", "Berlin (Germany)", "Chicago (USA)"]
    }
  ];

  // ─── AFTER 10TH DATASETS ──────────────────────────────────────────
  static const List<Map<String, dynamic>> after10thCategories = [
    {
      "id": "intermediate",
      "title": "Intermediate / 11th & 12th",
      "icon": "📘",
      "description": "Continue formal schooling with stream selection leading to university degrees.",
      "duration": "2 Years"
    },
    {
      "id": "diploma",
      "title": "Diploma / Polytechnic",
      "icon": "🛠️",
      "description": "Technical 3-year diplomas providing practical skills and lateral entry to B.Tech 2nd year.",
      "duration": "3 Years"
    },
    {
      "id": "iti",
      "title": "ITI Vocational Certifications",
      "icon": "🔧",
      "description": "Industrial training in electrical, mechanical, welder, fitter, and COPA trades.",
      "duration": "1–2 Years"
    },
    {
      "id": "shortterm",
      "title": "Short-Term Skill Courses",
      "icon": "💻",
      "description": "Fast-track certifications in coding, design, retail, and accounting for direct employment.",
      "duration": "1–6 Months"
    },
    {
      "id": "vocational",
      "title": "Vocational Stream Courses",
      "icon": "🌾",
      "description": "Job-oriented programs focusing on practical industry skill development.",
      "duration": "1–2 Years"
    }
  ];

  static const List<Map<String, dynamic>> after10thJobs = [
    {
      "id": "computer-operator",
      "title": "Computer Operator & Office Clerk",
      "icon": "🖥️",
      "category": "IT",
      "salary": "₹12,000 – ₹22,000 / month",
      "description": "Handle data entry, computer operations, filing, and office communications.",
      "skills": ["MS Office & Excel", "Fast Typing (35+ WPM)", "Email Etiquette", "Basic Troubleshooting"],
      "workplaces": ["Private Enterprises", "Schools & Colleges", "Banks", "Government Agencies"],
      "recruiters": ["Local Businesses", "TCS iON", "Government Offices", "Service Agencies"]
    },
    {
      "id": "certified-electrician",
      "title": "Certified Industrial & Domestic Electrician",
      "icon": "⚡",
      "category": "Non-IT",
      "salary": "₹15,000 – ₹32,000 / month",
      "description": "Install, inspect, repair, and maintain electrical wiring, panels, and machinery.",
      "skills": ["Wiring Diagrams", "Safety Compliance", "Circuit Testing", "Power Distribution"],
      "workplaces": ["Manufacturing Plants", "Construction Sites", "State Power Discoms", "Self-Employed"],
      "recruiters": ["L&T Construction", "Tata Power", "State Electricity Boards", "Havells"]
    },
    {
      "id": "graphic-designer-junior",
      "title": "Junior Graphic & Social Media Designer",
      "icon": "🎨",
      "category": "IT",
      "salary": "₹15,000 – ₹28,000 / month",
      "description": "Design visual assets, social media posts, banners, and marketing brochures.",
      "skills": ["Photoshop & Canva", "Typography", "Color Theory", "Social Media Layouts"],
      "workplaces": ["Marketing Agencies", "E-commerce Brands", "Printing Houses", "Freelance"],
      "recruiters": ["Ad Agencies", "Digital Marketing Firms", "Media Houses"]
    },
    {
      "id": "mechanical-fitter",
      "title": "Mechanical Fitter & Fabricator",
      "icon": "🔩",
      "category": "Non-IT",
      "salary": "₹14,000 – ₹30,000 / month",
      "description": "Assemble, fit, and align heavy machinery parts according to blueprint drawings.",
      "skills": ["Blueprint Reading", "Lathe Machine Operation", "Precision Measuring", "Welding"],
      "workplaces": ["Automotive Plants", "Railways", "Steel Mills", "Shipyards"],
      "recruiters": ["BHEL", "Indian Railways", "Maruti Suzuki", "Tata Motors"]
    }
  ];

  // ─── AFTER 12TH DATASETS ──────────────────────────────────────────
  static const List<Map<String, dynamic>> after12thStreams = [
    {"id": "MPC", "label": "Maths, Physics, Chemistry (MPC)"},
    {"id": "BiPC", "label": "Biology, Physics, Chemistry (BiPC)"},
    {"id": "CEC", "label": "Civics, Economics, Commerce (CEC)"},
    {"id": "MEC", "label": "Maths, Economics, Commerce (MEC)"},
    {"id": "HEC", "label": "Humanities / Arts (HEC)"},
    {"id": "Vocational", "label": "Vocational & Applied Trades"}
  ];

  static const Map<String, List<Map<String, dynamic>>> after12thSectorsMap = {
    "MPC": [
      {
        "id": "engineering-cs",
        "title": "Computer Science & IT Engineering",
        "icon": "💻",
        "description": "B.Tech/B.E. degree programs focusing on software engineering, AI, cybersecurity, and cloud.",
        "entranceExams": ["JEE Main", "JEE Advanced", "BITSAT", "State EAMCETs"],
        "eligibility": "Minimum 60% in 10+2 with Physics, Chemistry, and Mathematics",
        "duration": "4 Years",
        "avgFees": "₹1.5 Lakhs - ₹4 Lakhs / year",
        "avgSalary": "₹6 LPA - ₹25 LPA",
        "departments": [
          {"id": "btech-cse", "title": "B.Tech Computer Science & Engineering", "fees": "₹2L - ₹4L/yr", "salary": "₹7L - ₹30L/yr", "recruiters": ["Google", "Microsoft", "TCS", "Infosys"]},
          {"id": "btech-ai-ds", "title": "B.Tech Artificial Intelligence & Data Science", "fees": "₹2.5L - ₹4.5L/yr", "salary": "₹8L - ₹32L/yr", "recruiters": ["Amazon", "NVIDIA", "Intel", "IBM"]},
          {"id": "btech-ece", "title": "B.Tech Electronics & Communication", "fees": "₹1.8L - ₹3.5L/yr", "salary": "₹5L - ₹18L/yr", "recruiters": ["Qualcomm", "Intel", "Samsung", "ISRO"]}
        ]
      },
      {
        "id": "architecture-design",
        "title": "Architecture & Spatial Planning",
        "icon": "🏛️",
        "description": "5-year B.Arch degree program for building design, urban planning, and structural aesthetics.",
        "entranceExams": ["NATA", "JEE Main Paper 2"],
        "eligibility": "10+2 with PCM and minimum 50% aggregate",
        "duration": "5 Years",
        "avgFees": "₹1.2 Lakhs - ₹3 Lakhs / year",
        "avgSalary": "₹4.5 LPA - ₹15 LPA",
        "departments": [
          {"id": "barch", "title": "Bachelor of Architecture (B.Arch)", "fees": "₹1.5L - ₹3L/yr", "salary": "₹5L - ₹16L/yr", "recruiters": ["Hafeez Contractor", "L&T", "DLF", "Urban Development Depts"]}
        ]
      }
    ],
    "BiPC": [
      {
        "id": "medical-surgery",
        "title": "Medical Sciences & Surgery (MBBS/BDS)",
        "icon": "🩺",
        "description": "Doctor of Medicine and Dental Surgery programs for diagnosis, surgery, and clinical care.",
        "entranceExams": ["NEET UG"],
        "eligibility": "10+2 with Physics, Chemistry, Biology and minimum 50% marks",
        "duration": "5.5 Years (including 1 year internship)",
        "avgFees": "Govt: ₹15K/yr | Private: ₹12L - ₹25L/yr",
        "avgSalary": "₹8 LPA - ₹25 LPA",
        "departments": [
          {"id": "mbbs", "title": "MBBS – Bachelor of Medicine & Surgery", "fees": "₹50K - ₹20L/yr", "salary": "₹10L - ₹35L/yr", "recruiters": ["AIIMS", "Apollo Hospitals", "Fortis", "Max Healthcare"]},
          {"id": "bds", "title": "BDS – Bachelor of Dental Surgery", "fees": "₹1L - ₹8L/yr", "salary": "₹5L - ₹15L/yr", "recruiters": ["Dental Clinics", "Govt Hospitals", "Clove Dental"]}
        ]
      },
      {
        "id": "pharmacy-biotech",
        "title": "Pharmacy & Life Sciences",
        "icon": "🧪",
        "description": "B.Pharm and B.Sc Biotechnology for drug synthesis, pharmaceuticals, and genetic analysis.",
        "entranceExams": ["NEET UG", "State EAMCET / CET"],
        "eligibility": "10+2 with PCB/PCM",
        "duration": "4 Years",
        "avgFees": "₹80,000 - ₹2.5 Lakhs / year",
        "avgSalary": "₹4 LPA - ₹12 LPA",
        "departments": [
          {"id": "bpharm", "title": "B.Pharmacy – Bachelor of Pharmacy", "fees": "₹1L - ₹2.5L/yr", "salary": "₹4L - ₹10L/yr", "recruiters": ["Sun Pharma", "Dr. Reddy's", "Cipla", "Biocon"]},
          {"id": "bsc-biotech", "title": "B.Sc Biotechnology", "fees": "₹60K - ₹1.5L/yr", "salary": "₹3.5L - ₹9L/yr", "recruiters": ["Serum Institute", "Bharat Biotech", "Syngene"]}
        ]
      }
    ],
    "CEC": [
      {
        "id": "law-legal",
        "title": "Integrated Law (BA LLB)",
        "icon": "⚖️",
        "description": "5-year integrated law degree covering corporate law, constitutional law, and litigation.",
        "entranceExams": ["CLAT", "AILET", "LSAT India", "State LawCET"],
        "eligibility": "10+2 in any stream with minimum 45% aggregate",
        "duration": "5 Years",
        "avgFees": "₹1.5 Lakhs - ₹3.5 Lakhs / year",
        "avgSalary": "₹6 LPA - ₹18 LPA",
        "departments": [
          {"id": "ba-llb", "title": "BA LL.B (Hons)", "fees": "₹2L - ₹3.5L/yr", "salary": "₹7L - ₹20L/yr", "recruiters": ["AZB & Partners", "Cyril Amarchand Mangaldas", "Khaitan & Co", "Corporate Houses"]}
        ]
      }
    ],
    "MEC": [
      {
        "id": "finance-ca",
        "title": "Chartered Accountancy & Finance",
        "icon": "📊",
        "description": "Professional CA certification by ICAI along with B.Com Honors in accounting and tax.",
        "entranceExams": ["CA Foundation", "CUET UG"],
        "eligibility": "10+2 with Commerce / Mathematics",
        "duration": "4.5 Years",
        "avgFees": "₹50,000 - ₹1.5 Lakhs total",
        "avgSalary": "₹8 LPA - ₹22 LPA",
        "departments": [
          {"id": "ca-icai", "title": "CA – Chartered Accountant (ICAI)", "fees": "₹80K total", "salary": "₹9L - ₹25L/yr", "recruiters": ["Deloitte", "PwC", "EY", "KPMG", "Big 4 Firms"]}
        ]
      }
    ],
    "HEC": [
      {
        "id": "journalism-media",
        "title": "Journalism, Media & Psychology",
        "icon": "🎤",
        "description": "Mass communication, digital news, psychology, and public relations degree programs.",
        "entranceExams": ["CUET UG", "IIMC Entrance"],
        "eligibility": "10+2 in any stream",
        "duration": "3-4 Years",
        "avgFees": "₹50,000 - ₹2 Lakhs / year",
        "avgSalary": "₹3.5 LPA - ₹10 LPA",
        "departments": [
          {"id": "bjmc", "title": "BA Journalism & Mass Communication", "fees": "₹80K - ₹2L/yr", "salary": "₹4L - ₹12L/yr", "recruiters": ["NDTV", "Times of India", "BBC", "Ad Agencies"]}
        ]
      }
    ],
    "Vocational": [
      {
        "id": "paramedical-voc",
        "title": "Applied Paramedical & Health Tech",
        "icon": "🏥",
        "description": "Medical lab technology, radiology imaging, and emergency care diplomas.",
        "entranceExams": ["Direct Merit / State Counseling"],
        "eligibility": "10+2 in Science / Vocational",
        "duration": "2-3 Years",
        "avgFees": "₹40,000 - ₹1 Lakh / year",
        "avgSalary": "₹3 LPA - ₹7 LPA",
        "departments": [
          {"id": "dmlt", "title": "Diploma in Medical Lab Technology (DMLT)", "fees": "₹50K/yr", "salary": "₹3L - ₹6L/yr", "recruiters": ["Pathkind Labs", "Dr Lal PathLabs", "Metropolis"]}
        ]
      }
    ]
  };

  static const List<Map<String, dynamic>> after12thJobs = [
    {
      "id": "software-trainee",
      "title": "Software Trainee / Systems Associate",
      "category": "IT",
      "salary": "₹22,000 – ₹35,000 / month",
      "description": "Entry-level development and tech support role for computer stream graduates.",
      "skills": ["Java / Python", "SQL Querying", "Problem Solving"],
      "workplaces": ["IT Services", "Tech Startups"]
    },
    {
      "id": "bank-clerk-po",
      "title": "Bank Probationary Officer / Clerk",
      "category": "Government",
      "salary": "₹35,000 – ₹55,000 / month",
      "description": "Public sector banking roles for managing account operations and customer loans.",
      "skills": ["Quantitative Aptitude", "Reasoning", "Customer Relations"],
      "workplaces": ["State Bank of India", "Punjab National Bank", "Canara Bank"]
    }
  ];

  // ─── GRADUATION DATASETS ──────────────────────────────────────────
  static const List<Map<String, dynamic>> graduationSectors = [
    {"id": "engineering", "title": "Engineering & Technology", "icon": "🎓", "deptCount": 6},
    {"id": "it-software", "title": "IT & Software Services", "icon": "💻", "deptCount": 5},
    {"id": "healthcare-biotech", "title": "Healthcare & Biotechnology", "icon": "🏥", "deptCount": 4},
    {"id": "commerce-management", "title": "Commerce & Business Management", "icon": "📊", "deptCount": 5},
    {"id": "law-policy", "title": "Law & Public Policy", "icon": "⚖️", "deptCount": 3},
    {"id": "govt-defence", "title": "Government & Civil Services", "icon": "🏛️", "deptCount": 4}
  ];

  static const List<Map<String, dynamic>> graduationHigherStudy = [
    {
      "id": "mba",
      "title": "MBA – Master of Business Administration",
      "sector": "Management",
      "icon": "💼",
      "duration": "2 Years",
      "exams": "CAT, XAT, NMAT, SNAP, CMAT",
      "topColleges": "IIM Ahmedabad, IIM Bangalore, IIM Calcutta, XLRI, FMS Delhi",
      "avgFees": "₹12 Lakhs - ₹25 Lakhs total",
      "avgSalary": "₹16 LPA - ₹35 LPA",
      "description": "Premier postgraduate degree for corporate leadership, finance, marketing, and strategy."
    },
    {
      "id": "mtech",
      "title": "M.Tech – Master of Technology",
      "sector": "Engineering",
      "icon": "💻",
      "duration": "2 Years",
      "exams": "GATE Exam",
      "topColleges": "IIT Bombay, IIT Delhi, IIT Madras, IISc Bangalore, NIT Trichy",
      "avgFees": "₹50,000 - ₹2 Lakhs total (Stipend ₹12,400/mo via GATE)",
      "avgSalary": "₹10 LPA - ₹24 LPA",
      "description": "Advanced technical specialization in AI, VLSI, Robotics, Data Science, and Thermal Engineering."
    },
    {
      "id": "ms-abroad",
      "title": "MS – Master of Science (STEM)",
      "sector": "Technology",
      "icon": "✈️",
      "duration": "1.5 - 2 Years",
      "exams": "GRE, TOEFL / IELTS",
      "topColleges": "Stanford, MIT, CMU, TU Munich, University of Toronto",
      "avgFees": "₹20 Lakhs - ₹45 Lakhs total",
      "avgSalary": "₹50 LPA - ₹1.2 Crore (\$75K - \$130K/year)",
      "description": "International STEM master's degree with high ROI and OPT/post-study work visas."
    }
  ];

  static const List<Map<String, dynamic>> graduationStudyAbroad = [
    {
      "id": "usa",
      "country": "United States of America (USA)",
      "flag": "🇺🇸",
      "title": "US Higher Education & OPT Guide",
      "icon": "🗽",
      "exams": "GRE / GMAT, TOEFL / IELTS",
      "tuition": "₹25 Lakhs - ₹45 Lakhs / year",
      "livingCost": "₹8 Lakhs - ₹14 Lakhs / year",
      "visaRules": "3-Year OPT extension for STEM degree graduates.",
      "description": "World-leading technology hubs (Silicon Valley), top-tier research universities, and lucrative tech/finance salaries."
    },
    {
      "id": "germany",
      "country": "Germany",
      "flag": "🇩🇪",
      "title": "Free Public University Education",
      "icon": "🏰",
      "exams": "IELTS / TOEFL, German (B1/B2 for specific programs)",
      "tuition": "€0 (Free in Public Unis, nominal semester fee €300)",
      "livingCost": "€11,208 / year (Blocked Account requirement)",
      "visaRules": "18-month post-study job search visa.",
      "description": "Zero tuition fees at top public universities (TU9), strong engineering industry (BMW, Siemens, SAP), and European residence pathways."
    },
    {
      "id": "canada",
      "country": "Canada",
      "flag": "🇨🇦",
      "title": "Post-Graduation Work Permit (PGWP)",
      "icon": "🍁",
      "exams": "IELTS Academic (Min 6.5 band)",
      "tuition": "CAD \$18,000 - \$35,000 / year",
      "livingCost": "CAD \$15,000 / year",
      "visaRules": "Up to 3-Year PGWP with straightforward PR pathways (Express Entry).",
      "description": "High quality of life, welcoming international policies, and direct permanent residency points."
    }
  ];

  static const List<Map<String, dynamic>> graduationJobs = [
    {
      "id": "grad-software-engineer",
      "title": "Software Development Engineer (SDE-1)",
      "category": "IT",
      "salary": "₹6,00,000 – ₹18,00,000 / year",
      "description": "Build high-throughput backend services, web applications, and mobile products.",
      "skills": ["Algorithms & Data Structures", "Java / Python / Node.js", "System Design"],
      "workplaces": ["Product Companies", "Fintech Firms", "MNCs"]
    },
    {
      "id": "management-trainee",
      "title": "Management Trainee / Business Analyst",
      "category": "Corporate",
      "salary": "₹6,50,000 – ₹14,00,000 / year",
      "description": "Analyze business processes, create financial dashboards, and optimize operation workflows.",
      "skills": ["SQL & Excel", "Power BI / Tableau", "Business Process Modeling"],
      "workplaces": ["Deloitte", "McKinsey", "Amazon", "Flipkart"]
    }
  ];
}
