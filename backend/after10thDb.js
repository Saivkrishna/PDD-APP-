const after10thCategories = [
  {
    id: "intermediate",
    title: "Intermediate / 11th & 12th",
    icon: "📘",
    description: "Continue formal schooling with specific stream selections leading to degree courses.",
    duration: "2 Years"
  },
  {
    id: "diploma",
    title: "Diploma / Polytechnic",
    icon: "🛠️",
    description: "Technical diploma courses offering practical knowledge and lateral entry into engineering.",
    duration: "3 Years"
  },
  {
    id: "iti",
    title: "ITI Courses",
    icon: "🔧",
    description: "Industrial Training Institute programs offering immediate vocational and industrial jobs.",
    duration: "1–2 Years"
  },
  {
    id: "shortterm",
    title: "Short-Term Skill Courses",
    icon: "💻",
    description: "Fast-track certification programs to gain specific industry skills and start working quickly.",
    duration: "1–6 Months"
  },
  {
    id: "vocational",
    title: "Vocational Courses",
    icon: "🌾",
    description: "Job-oriented programs focusing on practical skill development in specific sectors.",
    duration: "1–2 Years"
  },
  {
    id: "specialized",
    title: "Specialized Professional Courses",
    icon: "🌟",
    description: "Creative and niche professional certifications with high employment potential.",
    duration: "1–3 Years"
  }
];

const after10thCourses = [
  // ── CATEGORY: INTERMEDIATE ──────────────────────────────────────────
  {
    id: "mpc",
    categoryId: "intermediate",
    title: "MPC – Mathematics, Physics, Chemistry",
    icon: "🔢",
    description: "The core science stream ideal for students aiming for engineering, technology, architecture, and defense careers.",
    duration: "2 Years",
    skillsRequired: ["Analytical Thinking", "Mathematical Aptitude", "Problem Solving", "Scientific Inquiry"],
    higherStudies: ["B.Tech / B.E. (Engineering)", "B.Arch (Architecture)", "B.Sc (Mathematics / Physics)", "BCA (Computer Applications)", "NDA (National Defence Academy)"],
    futureScope: "High demand in engineering, software development, aviation, and data sciences. Excellent base for technical and administrative exams.",
    careerOpportunities: [
      {
        id: "software-engineer-10",
        title: "Software Engineer",
        icon: "💻",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹4 LPA – ₹8 LPA",
        salaryExperienced: "₹15 LPA – ₹50+ LPA",
        description: "Develops, tests, and deploys software systems, applications, and tools for global clients.",
        howToBecome: [
          "Complete Intermediate MPC",
          "Pursue B.Tech/B.E. in Computer Science or BCA followed by MCA",
          "Learn programming languages like Python, Java, or JavaScript",
          "Build a portfolio of projects and apply for internships"
        ],
        skills: ["Programming (Python/Java/JS)", "Algorithms & Data Structures", "Database Management", "System Design"],
        workplaces: ["IT Multinationals", "Startups", "Software Consultation Firms", "Freelancing"],
        future: "Evergrowing market with advancements in AI, Cloud Computing, and Blockchain.",
        certifications: ["AWS Developer Associate", "Oracle Certified Java Professional"],
        higherStudy: "M.Tech in Computer Science, MS in US/Germany, or MBA"
      },
      {
        id: "defense-officer-10",
        title: "Defense Officer (Army/Navy/Air Force)",
        icon: "🪖",
        category: "Government",
        categoryIcon: "🛡️",
        salaryFresher: "₹65,000/month + Allowances",
        salaryExperienced: "₹2,000,000+/year",
        description: "Commissioned officers leading tactical units, managing border security, or flying fighter aircraft.",
        howToBecome: [
          "Complete Intermediate MPC stream",
          "Clear the NDA entrance exam conducted by UPSC",
          "Pass the Services Selection Board (SSB) Interview",
          "Undergo physical medical exams and complete 3-4 years training at NDA Pune"
        ],
        skills: ["Leadership", "Physical Endurance", "Strategic Thinking", "Discipline"],
        workplaces: ["Indian Army", "Indian Navy", "Indian Air Force"],
        future: "Highly prestigious life-long career with excellent rank promotions and retired pensions.",
        certifications: ["NDA Commissioning Certificate"],
        higherStudy: "Defense Staff College degrees, administrative courses during service"
      }
    ]
  },
  {
    id: "bipc",
    categoryId: "intermediate",
    title: "BiPC – Biology, Physics, Chemistry",
    icon: "🧬",
    description: "The medical and life sciences stream. Best path for students passionate about healthcare, curing illnesses, and understanding biology.",
    duration: "2 Years",
    skillsRequired: ["Memory Retention", "Patience", "Empathy", "Observation Skills", "Laboratory Practice"],
    higherStudies: ["MBBS (Medicine & Surgery)", "BDS (Dental Surgery)", "B.Pharm (Pharmacy)", "B.Sc Nursing", "B.Sc Biotechnology", "Veterinary Sciences (BVSc)"],
    futureScope: "Continuous demand in healthcare and pharma. High growth potential in genetics, clinical research, and bio-tech industries.",
    careerOpportunities: [
      {
        id: "physician-10",
        title: "General Physician / Doctor",
        icon: "🏥",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹6 LPA – ₹12 LPA",
        salaryExperienced: "₹20 LPA – ₹80+ LPA",
        description: "Diagnoses illnesses, prescribes treatments, and manages patient healthcare in clinics and hospitals.",
        howToBecome: [
          "Complete Intermediate BiPC stream",
          "Clear the NEET-UG medical entrance exam with a high rank",
          "Complete MBBS degree (5.5 Years) from a recognized medical college",
          "Register with the Medical Council of India (MCI)"
        ],
        skills: ["Clinical Diagnosis", "Communication", "Patience", "Medical Ethics"],
        workplaces: ["Hospitals (Govt & Private)", "Private Clinics", "Diagnostic Centers", "NGOs"],
        future: "Evergreen demand, recession-proof career. Specializations (Cardiology, Pediatrics) increase value dramatically.",
        certifications: ["MBBS Degree License", "MD/MS Specialization Certificate"],
        higherStudy: "MD (Doctor of Medicine) or MS (Master of Surgery)"
      },
      {
        id: "pharmacist-10",
        title: "Pharmacist / Drug Inspector",
        icon: "💊",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2.5 LPA – ₹5 LPA",
        salaryExperienced: "₹8 LPA – ₹20 LPA",
        description: "Manages pharmacies, dispenses medications, guides patients on drug usage, or inspects pharma manufacturing standards.",
        howToBecome: [
          "Complete Intermediate BiPC stream",
          "Pursue B.Pharm (Bachelor of Pharmacy) or D.Pharm",
          "Obtain registered pharmacist license from State Pharmacy Council",
          "Pass government exams for Drug Inspector roles"
        ],
        skills: ["Pharmacology Knowledge", "Attention to Detail", "Inventory Management", "Customer Service"],
        workplaces: ["Hospital Pharmacies", "Retail Pharmacy Chains", "Pharmaceutical Plants", "Government Drug Control Dept"],
        future: "Steady growth supported by expanding retail networks and export of medicines.",
        certifications: ["Registered Pharmacist License"],
        higherStudy: "M.Pharm or Pharm.D (Doctor of Pharmacy)"
      }
    ]
  },
  {
    id: "mec",
    categoryId: "intermediate",
    title: "MEC – Mathematics, Economics, Commerce",
    icon: "📊",
    description: "The ideal stream bridging commercial calculations and economic systems. Excellent foundation for business finance.",
    duration: "2 Years",
    skillsRequired: ["Quantitative Ability", "Financial Interest", "Business Literacy", "Analytical Mindset"],
    higherStudies: ["B.Com (Commerce)", "BBA (Business Administration)", "BMS (Management Studies)", "Chartered Accountancy (CA)", "Actuarial Science"],
    futureScope: "High integration into corporate sectors, financial institutions, banking houses, and global business consulting firms.",
    careerOpportunities: [
      {
        id: "chartered-accountant-10",
        title: "Chartered Accountant (CA)",
        icon: "💼",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹7 LPA – ₹12 LPA",
        salaryExperienced: "₹20 LPA – ₹60+ LPA",
        description: "Audits financial statements, handles corporate taxation, provides strategic financial advisory to corporations.",
        howToBecome: [
          "Complete Intermediate MEC or CEC",
          "Register for CA Foundation Exam with ICAI",
          "Pass CA Intermediate, complete 2-3 years Articleship training",
          "Pass CA Final Examination to become a member"
        ],
        skills: ["Auditing", "Tax Law", "Corporate Finance", "Financial Analysis"],
        workplaces: ["Audit Firms (Big 4)", "Corporate Finance Departments", "Banks", "Independent Practice"],
        future: "Every registered business requires professional auditing and tax planning, ensuring steady demand.",
        certifications: ["ICAI Membership Certificate"],
        higherStudy: "CFA (USA) or MBA Finance"
      },
      {
        id: "financial-analyst-10",
        title: "Financial Analyst",
        icon: "📈",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹4 LPA – ₹8 LPA",
        salaryExperienced: "₹15 LPA – ₹35 LPA",
        description: "Examines financial data to guide companies on investment decisions, stock market trends, and growth planning.",
        howToBecome: [
          "Complete Intermediate MEC stream",
          "Pursue B.Com (Hons), BBA Finance, or B.Sc Economics",
          "Learn financial modeling and Excel software",
          "Consider clearing CFA Level 1 during graduation"
        ],
        skills: ["Financial Modeling", "Data Analysis", "MS Excel", "Corporate Valuation"],
        workplaces: ["Investment Banks", "Wealth Management Firms", "Corporate Treasury Units", "Consultancies"],
        future: "Strong demand in equity research, venture capital, and corporate finance.",
        certifications: ["CFA (Chartered Financial Analyst)", "FRM (Financial Risk Manager)"],
        higherStudy: "MBA from Top B-Schools or MS in Finance"
      }
    ]
  },
  {
    id: "cec",
    categoryId: "intermediate",
    title: "CEC – Civics, Economics, Commerce",
    icon: "⚖️",
    description: "Focused on public systems, economic structures, and mercantile businesses. Excellent path for humanities, administration, and law.",
    duration: "2 Years",
    skillsRequired: ["Reading Comprehension", "Logical Reasoning", "Social Awareness", "Basic Accounting"],
    higherStudies: ["B.Com (General / Computers)", "BA (Economics / Political Science)", "Integrated Law (BA LLB / B.Com LLB)", "CS (Company Secretary)"],
    futureScope: "Wide scope in corporate compliance, legal services, administrative roles, and social sciences.",
    careerOpportunities: [
      {
        id: "corporate-lawyer-10",
        title: "Corporate Lawyer",
        icon: "⚖️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹4 LPA – ₹10 LPA",
        salaryExperienced: "₹18 LPA – ₹50+ LPA",
        description: "Handles corporate governance, drafts commercial contracts, manages mergers/acquisitions, and resolves legal disputes.",
        howToBecome: [
          "Complete Intermediate CEC or Arts",
          "Prepare for CLAT (Common Law Admission Test)",
          "Join a 5-year integrated BA LLB / B.Com LLB program in a National Law University",
          "Enroll with the State Bar Council after graduation"
        ],
        skills: ["Contract Drafting", "Legal Research", "Oral Advocacy", "Negotiation"],
        workplaces: ["Corporate Law Firms", "Legal Departments of MNCs", "Independent Law Practice", "Judiciary Services"],
        future: "Growing complexity in international trade, cybersecurity, and startup funding demands specialized corporate legal brains.",
        certifications: ["Bar Council of India License"],
        higherStudy: "LLM (Master of Laws) or Corporate Compliance Diplomas"
      },
      {
        id: "company-secretary-10",
        title: "Company Secretary (CS)",
        icon: "🏢",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹3.5 LPA – ₹6 LPA",
        salaryExperienced: "₹12 LPA – ₹30 LPA",
        description: "Ensures the company complies with statutory and regulatory requirements, and guides board directors on corporate governance.",
        howToBecome: [
          "Complete Intermediate CEC",
          "Enroll in ICSI (Institute of Company Secretaries of India) CS Course",
          "Pass CSEET (Entrance), Executive, and Professional stages",
          "Complete mandatory management training"
        ],
        skills: ["Company Law", "Corporate Governance", "Compliance Management", "Minute Writing"],
        workplaces: ["Public Listed Companies", "Legal Advisory Firms", "CS Consultancy Practices"],
        future: "Mandatory requirement for large companies ensures stable employment and proximity to boardrooms.",
        certifications: ["ICSI Member Certificate"],
        higherStudy: "LLB (Law Degree) to combine CS and legal advice"
      }
    ]
  },
  {
    id: "arts",
    categoryId: "intermediate",
    title: "Arts / Humanities",
    icon: "🎭",
    description: "A creative, culture-rich, and socially relevant stream covering literature, history, psychology, and journalism.",
    duration: "2 Years",
    skillsRequired: ["Creative Writing", "Public Speaking", "Social Empathy", "Research & Inquiry"],
    higherStudies: ["BA (Journalism / Psychology / English / Fine Arts)", "Bachelor of Social Work (BSW)", "Integrated B.Ed (Teaching)", "Diploma in Design"],
    futureScope: "Immense growth in digital content creation, human resource management, counseling, publishing, media, and civil service sectors.",
    careerOpportunities: [
      {
        id: "journalist-10",
        title: "Journalist / News Reporter",
        icon: "📰",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2.5 LPA – ₹4.5 LPA",
        salaryExperienced: "₹10 LPA – ₹25 LPA",
        description: "Gathers information, writes reports, interviews subjects, and broadcasts news to update the public.",
        howToBecome: [
          "Complete Intermediate Arts stream",
          "Pursue BA in Journalism & Mass Communication (BJMC)",
          "Do internships with print, digital, or TV news organizations",
          "Build a portfolio of published articles or video reports"
        ],
        skills: ["Investigative Reporting", "Clear Writing", "Interviewing", "Camera Confidence"],
        workplaces: ["Newspaper Agencies", "News Channels", "Digital News Portals", "Public Relations Firms"],
        future: "Transitioning to digital media, podcasts, and independent news setups with massive reach.",
        certifications: ["Mass Comm Degree Certificate"],
        higherStudy: "Post-Graduate Diploma from IIMC or MASCOM"
      },
      {
        id: "counselor-10",
        title: "Counseling Psychologist",
        icon: "🧠",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹3 LPA – ₹5 LPA",
        salaryExperienced: "₹10 LPA – ₹25 LPA",
        description: "Assists clients in managing stress, emotional difficulties, relationship issues, and psychological challenges.",
        howToBecome: [
          "Complete Intermediate Arts/Humanities",
          "Complete BA/B.Sc in Psychology",
          "Complete MA/M.Sc in Counseling or Clinical Psychology",
          "Undergo supervised internship hours and start practice"
        ],
        skills: ["Active Listening", "Empathy", "Patience", "Diagnostic Knowledge"],
        workplaces: ["Schools & Colleges", "Mental Health Clinics", "Rehab Centers", "Private Practice / Online Platforms"],
        future: "Rapidly rising awareness of mental health makes psychology one of the fastest-growing careers globally.",
        certifications: ["RCI Registration (required for clinical psychologists)"],
        higherStudy: "M.Phil in Clinical Psychology or Ph.D."
      }
    ]
  },

  // ── CATEGORY: DIPLOMA/POLYTECHNIC ──────────────────────────────────
  {
    id: "cse-diploma",
    categoryId: "diploma",
    title: "CSE – Computer Science Engineering",
    icon: "💻",
    description: "Practical engineering diploma focusing on computer systems, programming, and software applications.",
    duration: "3 Years",
    skillsRequired: ["Logical Thinking", "Computer Operations", "Keyboard Skills", "Basic Coding Interest"],
    higherStudies: ["B.Tech Lateral Entry (Direct 2nd Year)", "BCA / B.Sc Computer Science", "Industry Certifications (Cloud, Security)"],
    futureScope: "High job opportunities directly after diploma, with quick options to complete engineering alongside.",
    careerOpportunities: [
      {
        id: "web-designer-10",
        title: "Web Designer / Frontend Developer",
        icon: "🌐",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹2.5 LPA – ₹4 LPA",
        salaryExperienced: "₹8 LPA – ₹20 LPA",
        description: "Creates layout structures, designs visual styles, and codes frontend scripts for responsive websites.",
        howToBecome: [
          "Complete Diploma in CSE",
          "Learn HTML, CSS, JavaScript, and Tailwind CSS",
          "Master UI mockups in Figma",
          "Build 5 portfolio websites showing diverse layouts"
        ],
        skills: ["HTML & CSS", "JavaScript", "Responsive UI Design", "Figma Designer"],
        workplaces: ["Web Design Agencies", "IT Services Firms", "Freelance Portals", "E-commerce Companies"],
        future: "Every small and large business requires modern web presence, ensuring continuous freelance and corporate work.",
        certifications: ["FreeCodeCamp Frontend Libraries Certificate", "Google UX Design Professional Certificate"],
        higherStudy: "B.Tech CSE (Lateral Entry)"
      },
      {
        id: "it-support-10",
        title: "IT Support Technician",
        icon: "🖥️",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹2 LPA – ₹3.5 LPA",
        salaryExperienced: "₹6 LPA – ₹12 LPA",
        description: "Installs system hardware, troubleshoots network issues, resolves OS bugs, and handles tech support tickets.",
        howToBecome: [
          "Complete Diploma in CSE or ECE",
          "Learn about computer assembly, network routing, and OS installation",
          "Get certified in networking basics",
          "Apply for helpdesk roles in corporate offices"
        ],
        skills: ["Hardware Troubleshooting", "OS Installation (Windows/Linux)", "Network Setup", "Customer Service"],
        workplaces: ["Corporate Office IT Teams", "Hardware Service Centers", "Datacenters", "Telecom Companies"],
        future: "Essential support role across all sectors, offering progression into System Administration and Network Security.",
        certifications: ["CompTIA A+", "Cisco CCNA"],
        higherStudy: "B.Tech Lateral Entry or Linux SysAdmin training"
      }
    ]
  },
  {
    id: "mechanical-diploma",
    categoryId: "diploma",
    title: "Mechanical Engineering",
    icon: "⚙️",
    description: "Hands-on technical diploma dealing with machines, engine mechanisms, drafting, and manufacturing operations.",
    duration: "3 Years",
    skillsRequired: ["Mechanical Skills", "Drawing and CAD basics", "Physical stamina", "Machine operations"],
    higherStudies: ["B.Tech Lateral Entry", "CAD/CAM advanced courses", "Industrial safety certifications"],
    futureScope: "Continuous demand in core manufacturing, automobile assembly lines, heavy industries, and aviation maintenance.",
    careerOpportunities: [
      {
        id: "cad-draftsman-10",
        title: "CAD Draftsman / CAD Designer",
        icon: "📐",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2.2 LPA – ₹3.6 LPA",
        salaryExperienced: "₹6 LPA – ₹15 LPA",
        description: "Creates detailed 2D blueprints and 3D digital models of mechanical parts using industry design software.",
        howToBecome: [
          "Complete Diploma in Mechanical Engineering",
          "Learn AutoCAD, SolidWorks, or CATIA design software",
          "Practice blueprint drafting standards",
          "Prepare a portfolio of mechanical part designs"
        ],
        skills: ["AutoCAD Mechanical", "SolidWorks 3D Modeling", "Geometric Dimensioning", "Blueprint Reading"],
        workplaces: ["Industrial Design Offices", "Manufacturing Plants", "Automobile Design Units", "Construction Agencies"],
        future: "Key design role translating engineers' sketches into precise templates for CNC machining.",
        certifications: ["SolidWorks Certified Associate (CSWA)"],
        higherStudy: "B.Tech Lateral Entry or Advanced CAM Courses"
      }
    ]
  },
  {
    id: "civil-diploma",
    categoryId: "diploma",
    title: "Civil Engineering",
    icon: "🏗️",
    description: "Structural technical diploma covering building materials, land surveying, and construction site management.",
    duration: "3 Years",
    skillsRequired: ["Estimation skills", "Field surveying", "AutoCAD", "Supervisory capability"],
    higherStudies: ["B.Tech Lateral Entry", "Construction Management Diploma", "Architectural drafting certifications"],
    futureScope: "High recruitment in infrastructure projects, roads/highway development, and residential construction sites.",
    careerOpportunities: [
      {
        id: "site-supervisor-10",
        title: "Construction Site Supervisor",
        icon: "🏗️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2 LPA – ₹3.5 LPA",
        salaryExperienced: "₹6 LPA – ₹14 LPA",
        description: "Supervises masonry work, schedules material inputs, manages site labor, and ensures structures follow structural drawing files.",
        howToBecome: [
          "Complete Diploma in Civil Engineering",
          "Acquire onsite training through apprenticeships",
          "Learn structural material testing codes",
          "Apply to building developers or contracting firms"
        ],
        skills: ["Labor Management", "Drawing Interpretation", "Concrete Testing", "Construction Safety"],
        workplaces: ["Construction Sites", "Real Estate Companies", "Infrastructure Developers", "PWD Contractor Units"],
        future: "Crucial execution role leading to Project Manager with experience and higher study.",
        certifications: ["Safety officer OSHA certificate"],
        higherStudy: "B.Tech Civil (Lateral Entry)"
      }
    ]
  },
  {
    id: "ece-diploma",
    categoryId: "diploma",
    title: "ECE – Electronics & Communication",
    icon: "📡",
    description: "Covers electronic circuits, digital signals, microcontroller chips, and telecommunications systems.",
    duration: "3 Years",
    skillsRequired: ["Circuit Reading", "Soldering", "Logical Analysis", "Basic Instrument handling"],
    higherStudies: ["B.Tech Lateral Entry", "Embedded Systems course", "IoT development specialization"],
    futureScope: "High industry integration with electronics manufacture, telecom operators, and smart gadget testing.",
    careerOpportunities: [
      {
        id: "pcb-designer-10",
        title: "PCB Designer",
        icon: "📟",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2.4 LPA – ₹3.8 LPA",
        salaryExperienced: "₹7 LPA – ₹18 LPA",
        description: "Designs the copper trace layouts for printed circuit boards (PCBs) powering electronic devices.",
        howToBecome: [
          "Complete Diploma in ECE",
          "Learn PCB design software (Altium Designer, KiCad, or Eagle)",
          "Understand component placement and thermal layouts",
          "Build sample IoT or electronic board designs"
        ],
        skills: ["KiCad / Altium", "Schematic Capture", "Component Packaging", "Signal Integrity"],
        workplaces: ["Electronics Manufacturing Plants", "IoT R&D Firms", "Consumer Appliance Design Teams"],
        future: "Crucial role as India expands local semiconductor assembly and hardware manufacturing.",
        certifications: ["IPC CID Certification"],
        higherStudy: "B.Tech Lateral Entry or Embedded Hardware Engineering"
      }
    ]
  },
  {
    id: "electrical-diploma",
    categoryId: "diploma",
    title: "Electrical Engineering",
    icon: "⚡",
    description: "Deals with electrical power generation, electrical machines, switchgears, and power line distributions.",
    duration: "3 Years",
    skillsRequired: ["Wiring safety", "Machine diagnostics", "Circuit reading", "Stamina"],
    higherStudies: ["B.Tech Lateral Entry", "Electrical Supervisor License", "Industrial automation (PLC / SCADA)"],
    futureScope: "Steady recruitment in state electricity boards, power sub-stations, factory maintenance, and solar installations.",
    careerOpportunities: [
      {
        id: "electrical-supervisor-10",
        title: "Electrical Maintenance Supervisor",
        icon: "🔌",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2.2 LPA – ₹3.6 LPA",
        salaryExperienced: "₹6 LPA – ₹15 LPA",
        description: "Monitors factory machinery, resolves power faults, installs high-voltage panels, and maintains factory safety compliance.",
        howToBecome: [
          "Complete Diploma in Electrical Engineering",
          "Apply for State Electricity Board licensing exams",
          "Acquire hands-on machine maintenance experience"
        ],
        skills: ["Fault Diagnostics", "HV Switchgears", "PLC Automation", "Safety Rules"],
        workplaces: ["Heavy Manufacturing Plants", "Power Sub-stations", "Residential High-rises", "Railways Maintenance Workshops"],
        future: "Growth into Chief Electrical Officer (CEO) of factories with government permits.",
        certifications: ["Supervisor 'B' Grade License"],
        higherStudy: "B.Tech EEE Lateral Entry"
      }
    ]
  },
  {
    id: "automobile-diploma",
    categoryId: "diploma",
    title: "Automobile Engineering",
    icon: "🚗",
    description: "Focuses on internal combustion engines, automobile structures, vehicle dynamics, and modern EV engineering.",
    duration: "3 Years",
    skillsRequired: ["Engine Mechanics", "Diagnostics", "Hand tools coordination", "Technical logic"],
    higherStudies: ["B.Tech Lateral Entry", "Electric Vehicle Technology specialized certificates"],
    futureScope: "Strong transition phase with high recruitment for EV battery pack assembly, service workshops, and production plants.",
    careerOpportunities: [
      {
        id: "auto-workshop-supervisor-10",
        title: "Automobile Workshop Supervisor",
        icon: "🛠️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2 LPA – ₹3.5 LPA",
        salaryExperienced: "₹5 LPA – ₹15 LPA",
        description: "Manages vehicle servicing schedules, guides mechanics on engine/transmission diagnosis, and handles final quality checks.",
        howToBecome: [
          "Complete Diploma in Automobile Engineering",
          "Join service center networks as an apprentice",
          "Learn modern ECU electronic diagnostics"
        ],
        skills: ["Engine Overhaul", "ECU Scanner Operations", "Customer Advisory", "Team Supervision"],
        workplaces: ["Authorized Vehicle Service Centers", "Automobile Dealerships", "Fleet Operator Garages"],
        future: "Transition to EV service management ensures continuous growth.",
        certifications: ["Automotive Service Excellence (ASE) standard certificates"],
        higherStudy: "B.Tech Lateral Entry or EV Specialization Courses"
      }
    ]
  },

  // ── CATEGORY: ITI COURSES ───────────────────────────────────────────
  {
    id: "electrician-iti",
    categoryId: "iti",
    title: "Electrician",
    icon: "⚡",
    description: "Provides core technical skills in building wiring, household electrical systems, and machine connections.",
    duration: "2 Years",
    skillsRequired: ["Wiring", "Safety Protocols", "Circuit Testers", "Hand Tool Dexterity"],
    higherStudies: ["Polytechnic Diploma Lateral Entry (Direct 2nd Year)", "Apprentice Training in Government Sectors"],
    futureScope: "Extremely stable government and private job recruitment, with opportunities in every locality.",
    careerOpportunities: [
      {
        id: "iti-electrician-10",
        title: "ITI Electrician / Lineman",
        icon: "🔌",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.5 LPA – ₹2.5 LPA",
        salaryExperienced: "₹4 LPA – ₹10 LPA",
        description: "Conducts domestic wiring, installs grid lines, repairs motors, and works on power supply systems.",
        howToBecome: [
          "Complete ITI Electrician course from a recognized institute",
          "Apply for State Electricity Board Wireman License",
          "Appear for National Apprenticeship Certificate (NAC) exams"
        ],
        skills: ["Domestic Wiring", "Industrial Panel Connections", "Transformer Maintenance", "Safety Gear"],
        workplaces: ["State Electricity Boards (Discoms)", "Factories", "Railways", "Contractor Firms"],
        future: "Transition to government lineman or independent commercial contractor.",
        certifications: ["Wireman Permit Certificate"],
        higherStudy: "Diploma in Electrical Engineering"
      }
    ]
  },
  {
    id: "fitter-iti",
    categoryId: "iti",
    title: "Fitter",
    icon: "🔩",
    description: "Teaches precision metal machining, bench fitting, assembly, and mechanical maintenance operations.",
    duration: "2 Years",
    skillsRequired: ["Bench Fitting", "Tool Handling", "Precision Measurement", "Stamina"],
    higherStudies: ["Polytechnic Diploma Lateral Entry", "Apprenticeship in defense, railways, or space research units"],
    futureScope: "High demand in mechanical assembly yards, heavy vehicle manufacturing, and steel fabrication yards.",
    careerOpportunities: [
      {
        id: "mechanical-fitter-10",
        title: "Mechanical Fitter / Assembly Fitter",
        icon: "⚙️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.5 LPA – ₹2.4 LPA",
        salaryExperienced: "₹4 LPA – ₹10 LPA",
        description: "Assembles metal machinery parts according to blueprints, fits valves, and services heavy machinery.",
        howToBecome: [
          "Complete ITI Fitter trade course",
          "Complete PSU apprenticeships (BHEL, IOCL, Railways)"
        ],
        skills: ["Precision Measuring Tools", "Filing & Fitting", "Drilling & Tapping", "Blueprint Analysis"],
        workplaces: ["Manufacturing Factories", "PSU Units", "Shipbuilding Yards", "Railways Maintenance Sheds"],
        future: "Progression into Shift Foreman or Senior Toolmaker.",
        certifications: ["National Trade Certificate (NTC)"],
        higherStudy: "Diploma in Mechanical Engineering"
      }
    ]
  },
  {
    id: "welder-iti",
    categoryId: "iti",
    title: "Welder",
    icon: "🔥",
    description: "Fast-track technical trade learning arc, gas, TIG, and MIG welding processes.",
    duration: "1 Year",
    skillsRequired: ["Welding techniques", "Thermal cutting", "Safety gear compliance", "Stamina"],
    higherStudies: ["Advanced TIG/MIG specialization courses", "Boiler quality welding certification"],
    futureScope: "High international career potential, especially in Gulf region fabrication projects.",
    careerOpportunities: [
      {
        id: "structural-welder-10",
        title: "Structural Welder / Fabricator",
        icon: "👨‍🏭",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.6 LPA – ₹2.8 LPA",
        salaryExperienced: "₹5 LPA – ₹18 LPA (International)",
        description: "Joins steel beams, plates, and pipelines using gas and arc welding techniques.",
        howToBecome: [
          "Complete ITI Welder course",
          "Pass welding certification tests (6G welder tests for high salary jobs)"
        ],
        skills: ["Arc/MIG/TIG Welding", "Metal Cutting", "Welding Safety Standards"],
        workplaces: ["Heavy Industry", "Construction Sites", "Shipyards", "Pipeline Projects (Offshore)"],
        future: "High potential to work overseas in Oil & Gas sectors with high salary.",
        certifications: ["6G Welding Certification", "American Welding Society (AWS) Certificate"],
        higherStudy: "Advanced NDT (Non-Destructive Testing) Inspection Courses"
      }
    ]
  },
  {
    id: "mechanic-iti",
    categoryId: "iti",
    title: "Mechanic",
    icon: "🚗",
    description: "Industrial training program focused on auto mechanics, engine tuning, and air conditioner diagnostics.",
    duration: "2 Years",
    skillsRequired: ["Troubleshooting", "Tool Handling", "Physical Stamina", "Engine Knowledge"],
    higherStudies: ["Automobile Diploma", "OEM advanced training certificates"],
    futureScope: "High options for starting independent garage workshops or service chain setups.",
    careerOpportunities: [
      {
        id: "auto-mechanic-10",
        title: "Auto Mechanic",
        icon: "🔧",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.5 LPA – ₹2.5 LPA",
        salaryExperienced: "₹5 LPA – ₹12 LPA",
        description: "Conducts repairs, services brakes, diagnoses engine codes, and changes parts on cars and bikes.",
        howToBecome: [
          "Complete ITI Mechanic (Motor Vehicle / Diesel) course",
          "Apprenticeship at OEM centers"
        ],
        skills: ["Engine Disassembly", "Brake Overhaul", "Vehicle Scanning", "Tool Dexterity"],
        workplaces: ["Authorized Service Centers", "Private Repair Garages", "Transport Fleet Depot"],
        future: "Independent garage owner with high earning potential.",
        certifications: ["NTC Mechanic Certificate"],
        higherStudy: "Diploma in Automobile Engineering"
      }
    ]
  },
  {
    id: "copa-iti",
    categoryId: "iti",
    title: "COPA – Computer Operator & Programming Assistant",
    icon: "💻",
    description: "Fast computer application trade covering databases, basic programming (HTML/CSS/JS), office spreadsheets, and typing.",
    duration: "1 Year",
    skillsRequired: ["Typing speed", "PC operations", "Internet browsing", "Spreadsheets basics"],
    higherStudies: ["BCA", "Diploma in Computer Applications", "Commercial web design courses"],
    futureScope: "Steady recruitment in office support, data entry, and helpdesk systems in both public and private spaces.",
    careerOpportunities: [
      {
        id: "data-entry-operator-10",
        title: "Data Entry Operator / Tally Assistant",
        icon: "⌨️",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹1.4 LPA – ₹2.2 LPA",
        salaryExperienced: "₹4 LPA – ₹8 LPA",
        description: "Transcribes paperwork into digital systems, checks spreadsheets, and writes accounting vouchers in Tally.",
        howToBecome: [
          "Complete ITI COPA course",
          "Achieve English typing speed of 35+ WPM"
        ],
        skills: ["Fast Typing", "MS Excel", "Tally ERP 9 / Prime", "Office Filing"],
        workplaces: ["Government Offices", "Supermarket Back Offices", "Schools/Colleges", "Private SME Offices"],
        future: "Progression into Office Administrator or Inventory Manager.",
        certifications: ["National Trade Certificate (NTC) in COPA", "Tally Academy Certification"],
        higherStudy: "B.Com Computers or BCA"
      }
    ]
  },

  // ── CATEGORY: SHORT-TERM SKILL COURSES ─────────────────────────────
  {
    id: "computer-courses",
    categoryId: "shortterm",
    title: "Computer Courses (MS Office, Tally)",
    icon: "🖥️",
    description: "Basic computer software courses focused on spreadsheet calculation, database filing, document templates, and Tally vouchers.",
    duration: "3 Months",
    skillsRequired: ["Basic Literacy", "Typing Interest", "Filing Logic"],
    higherStudies: ["Advanced Accounting GST Practitioner Course", "Office Management Diploma"],
    futureScope: "Basic office qualification for all receptionist, billing, and administrative support roles.",
    careerOpportunities: [
      {
        id: "billing-clerk-10",
        title: "Billing Cashier / Front Desk Assistant",
        icon: "💳",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.2 LPA – ₹2 LPA",
        salaryExperienced: "₹3.5 LPA – ₹7 LPA",
        description: "Handles customer checkout billing, reconciles daily cash registers, and receives visitors.",
        howToBecome: [
          "Complete Short-term MS Office & Tally course",
          "Gain basic communication skills"
        ],
        skills: ["Billing Software (POS)", "Cash Handling", "MS Excel", "Customer Relations"],
        workplaces: ["Retail Outlets", "Hospitals", "Hotels", "Supermarkets"],
        future: "Stable entry-level job leading to Store Manager with retail experience.",
        certifications: ["Tally Accounting Certificate", "CCC Certificate"],
        higherStudy: "B.Com Distance Education"
      }
    ]
  },
  {
    id: "graphic-design",
    categoryId: "shortterm",
    title: "Graphic Design",
    icon: "🎨",
    description: "Covers visual layouts, typography, brand assets, social media banner creation using design apps.",
    duration: "3–6 Months",
    skillsRequired: ["Creative visualization", "Canva / Photoshop basics", "Color palettes logic", "Typography"],
    higherStudies: ["UI/UX Design certification", "Diploma in Animation/VFX"],
    futureScope: "Vibrant career field due to content creation explosion and digital brand requirements.",
    careerOpportunities: [
      {
        id: "social-media-designer-10",
        title: "Social Media Designer / Graphic Designer",
        icon: "🎨",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹1.8 LPA – ₹3 LPA",
        salaryExperienced: "₹6 LPA – ₹18 LPA",
        description: "Creates advertising banners, Instagram post templates, YouTube thumbnails, and logo formats.",
        howToBecome: [
          "Complete 3-6 months Graphic Design certificate course",
          "Learn Adobe Photoshop and Illustrator",
          "Build a portfolio on Behance showcasing diverse mock designs"
        ],
        skills: ["Adobe Photoshop", "Canva Pro", "Logo Vectorization", "Creative Aesthetics"],
        workplaces: ["Advertising Agencies", "Digital Marketing Startups", "Freelance Marketplaces", "Publishing Units"],
        future: "Can easily scale into UI/UX Design (Web/App layouts) which commands extremely high salary package.",
        certifications: ["Adobe Certified Professional (Photoshop)"],
        higherStudy: "UX Design Specialization by Google"
      }
    ]
  },
  {
    id: "video-editing",
    categoryId: "shortterm",
    title: "Video Editing",
    icon: "🎬",
    description: "Practical program covering timeline editing, transitions, sound sync, and export standards using PC or mobile applications.",
    duration: "2–3 Months",
    skillsRequired: ["Pacing/Timing", "Premiere Pro / CapCut", "Sound mixing", "Video storage logic"],
    higherStudies: ["Advanced Color Grading (DaVinci)", "VFX and Motion Graphics (After Effects)"],
    futureScope: "Massive scale-up driven by short-form video content (Reels, TikTok) and YouTube channels.",
    careerOpportunities: [
      {
        id: "youtube-editor-10",
        title: "YouTube Video Editor / Reel Editor",
        icon: "🎬",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹1.8 LPA – ₹3.5 LPA",
        salaryExperienced: "₹6 LPA – ₹20+ LPA",
        description: "Cuts raw footage, syncs audio tracks, highlights hook points, adds visual subtitles, and formats video files.",
        howToBecome: [
          "Complete Video Editing short-term course",
          "Learn Adobe Premiere Pro or CapCut PC",
          "Edit 5 sample reels and contact online content creators"
        ],
        skills: ["Premiere Pro", "CapCut", "Sound Leveling", "Thumbnail/Reel hook logic"],
        workplaces: ["Social Media Creators", "YouTube Production Units", "Ad Video Startups", "Freelancing"],
        future: "High potential to work remotely for international clients.",
        certifications: ["Premiere Pro Certified Associate"],
        higherStudy: "Motion Graphics (After Effects) course"
      }
    ]
  },
  {
    id: "digital-marketing",
    categoryId: "shortterm",
    title: "Digital Marketing",
    icon: "📱",
    description: "Fast-track course covering Search Engine Optimization (SEO), Meta ads, Google ads, and content strategy.",
    duration: "3 Months",
    skillsRequired: ["Basic English", "Analytical tools", "Social Media usage", "Copywriting basics"],
    higherStudies: ["Advanced SEO course", "E-commerce advertising certificate"],
    futureScope: "Critical business department; every brand requires digital advertising specialists to drive sales.",
    careerOpportunities: [
      {
        id: "seo-executive-10",
        title: "SEO Executive / Social Media Executive",
        icon: "📈",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹1.8 LPA – ₹3 LPA",
        salaryExperienced: "₹6 LPA – ₹15 LPA",
        description: "Optimizes website keywords to increase Google ranking, schedules posts, and replies to page feedback.",
        howToBecome: [
          "Complete 3 months Digital Marketing course",
          "Acquire free Google/HubSpot digital marketing certifications"
        ],
        skills: ["Keyword Research", "Google Analytics", "Social Media scheduling", "Ad Copywriting"],
        workplaces: ["Digital Marketing Agencies", "E-commerce Brands", "MNC Marketing Teams", "Freelancing"],
        future: "Progression to Campaign Strategist or Digital Marketing Manager.",
        certifications: ["Google Digital Marketing Fundamentals", "Hubspot Inbound Marketing Certificate"],
        higherStudy: "BBA Marketing (Distance/Regular)"
      }
    ]
  },

  // ── CATEGORY: VOCATIONAL COURSES ───────────────────────────────────
  {
    id: "agriculture-vocational",
    categoryId: "vocational",
    title: "Agriculture",
    icon: "🌾",
    description: "Practical program focusing on greenhouse farming, soil testing, fertilizer ratios, seed analysis, and modern drip irrigation.",
    duration: "1 Year",
    skillsRequired: ["Practical Fieldwork", "Organic Farming logic", "Pesticides calculations", "Weather monitoring"],
    higherStudies: ["B.Sc Agriculture (after qualifying board exams)", "Organic Farming Consultation certifications"],
    futureScope: "Growing sector with modern greenhouse nurseries, organic farms, and agri-startups.",
    careerOpportunities: [
      {
        id: "field-assistant-10",
        title: "Agricultural Field Assistant",
        icon: "🌾",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.5 LPA – ₹2.5 LPA",
        salaryExperienced: "₹4 LPA – ₹8 LPA",
        description: "Monitors crop health, helps in nursery seedling preparation, runs drip lines, and demonstrates seed test files to farmers.",
        howToBecome: [
          "Complete Vocational Course in Agriculture",
          "Apply for field representative roles in seed/fertilizer companies"
        ],
        skills: ["Greenhouse Care", "Fertilizer Ratios", "Seed Quality Analysis", "Drip System Setup"],
        workplaces: ["Agri-chemical Companies", "Commercial Greenhouses", "Organic Farming Units", "Nursery Outlets"],
        future: "Can expand into nursery consulting or start independent organic food farming.",
        certifications: ["Vocational Agriculture Certificate"],
        higherStudy: "B.Sc Agriculture or Horticulture"
      }
    ]
  },
  {
    id: "healthcare-vocational",
    categoryId: "vocational",
    title: "Healthcare Assistant",
    icon: "🏥",
    description: "Vocational program training nursing aids, basic first aid, ward management, vital monitoring, and patient mobility.",
    duration: "1 Year",
    skillsRequired: ["Empathy", "Physical stamina", "First Aid knowledge", "Patient Care hygiene"],
    higherStudies: ["B.Sc Nursing", "General Nursing & Midwifery (GNM) (after completing 12th equivalent)"],
    futureScope: "High recruitment in private nursing homes, hospital wards, and home care services.",
    careerOpportunities: [
      {
        id: "nursing-aid-10",
        title: "Nursing Aid / General Duty Assistant",
        icon: "🏥",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.5 LPA – ₹2.5 LPA",
        salaryExperienced: "₹3.5 LPA – ₹8 LPA",
        description: "Assists ICU/ward nurses, monitors temperature/pulse rates, manages patient hygiene, and moves patients in wheelchairs.",
        howToBecome: [
          "Complete Vocational Healthcare Assistant / GDA program",
          "Apply at municipal hospitals or nursing home networks"
        ],
        skills: ["Vital Signs Monitoring", "First Aid & CPR", "Patient Mobility", "Basic Sanitization"],
        workplaces: ["Private Hospitals", "Old-age Nursing Homes", "Home Care Service Providers", "Physiotherapy Centers"],
        future: "Highly essential healthcare worker; stable long-term career prospects.",
        certifications: ["First Aid & CPR Certification (Red Cross)", "GDA Vocational Certificate"],
        higherStudy: "GNM / B.Sc Nursing"
      }
    ]
  },
  {
    id: "retail-vocational",
    categoryId: "vocational",
    title: "Retail Management",
    icon: "🛍️",
    description: "Covers store layouts, POS billing software, inventory shelf stocking, customer relations, and retail cash flow.",
    duration: "1 Year",
    skillsRequired: ["Polite Speech", "POS operations", "Stock cataloging", "Stamina to stand"],
    higherStudies: ["Diploma in Retail Marketing", "BBA Retail Management"],
    futureScope: "Continuous recruitment driven by rapid malls expansion, supermarket chains, and clothing showrooms.",
    careerOpportunities: [
      {
        id: "retail-sales-10",
        title: "Retail Sales Executive",
        icon: "🛍️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.4 LPA – ₹2.2 LPA",
        salaryExperienced: "₹4 LPA – ₹10 LPA",
        description: "Greets customers, explains product benefits, manages display shelves, and handles store sales goals.",
        howToBecome: [
          "Complete Vocational Course in Retail Management",
          "Apply for sales associate roles at clothing showrooms or malls"
        ],
        skills: ["Customer Communication", "Product Knowledge", "Billing POS", "Stock Cataloging"],
        workplaces: ["Shopping Malls", "Brand Showrooms", "Large Supermarkets", "Electronics Stores"],
        future: "Can advance to Floor Manager and Retail Store Manager with sales experience.",
        certifications: ["NSDC Retail Associate Certificate"],
        higherStudy: "BBA in Retail / Marketing"
      }
    ]
  },
  {
    id: "tourism-vocational",
    categoryId: "vocational",
    title: "Tourism & Hospitality",
    icon: "✈️",
    description: "Vocational program covering tour guiding, ticketing coordination, itinerary planning, and guest hospitality management.",
    duration: "1 Year",
    skillsRequired: ["Languages fluency", "Storytelling", "Itinerary booking", "Helpful hospitality"],
    higherStudies: ["Bachelor of Tourism Management (BTM)", "Travel Agency management diploma"],
    futureScope: "High demand in tour operator agencies, booking centers, resort hotels, and historic destinations.",
    careerOpportunities: [
      {
        id: "tour-guide-10",
        title: "Tourist Guide / Travel Coordinator",
        icon: "🗺️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.5 LPA – ₹2.8 LPA",
        salaryExperienced: "₹5 LPA – ₹12 LPA",
        description: "Accompanies tourist groups, delivers historical details of sights, checks hotel room bookings, and handles group tickets.",
        howToBecome: [
          "Complete Tourism Vocational Course",
          "Apply for State Tourism Board guide licensing exam",
          "Learn local history and one additional foreign language (optional)"
        ],
        skills: ["Public Speaking", "Itinerary Planning", "Historic Details Knowledge", "Crisis Management"],
        workplaces: ["Travel Agencies", "Tourism Boards", "Heritage Monuments", "Adventure Resorts"],
        future: "Opportunity to start independent travel/trekking agency.",
        certifications: ["State Tourism Guide License"],
        higherStudy: "Bachelor of Tourism Administration (BTA)"
      }
    ]
  },

  // ── CATEGORY: SPECIALIZED PROFESSIONAL COURSES ──────────────────────
  {
    id: "hotel-management",
    categoryId: "specialized",
    title: "Hotel Management",
    icon: "🏨",
    description: "Covers front desk operations, food and beverage (F&B) serving, basic chef training, and housekeeping rules.",
    duration: "3 Years",
    skillsRequired: ["Professional Grooming", "Cooking basics", "Customer hospitality", "English Communication"],
    higherStudies: ["Bachelor in Hotel Management (BHM)", "Culinary Arts specialized degrees"],
    futureScope: "Vast career scope with international cruise lines, five-star hotel chains, and airline catering.",
    careerOpportunities: [
      {
        id: "front-desk-10",
        title: "Front Desk Executive / Hospitality Trainee",
        icon: "🛎️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.8 LPA – ₹3 LPA",
        salaryExperienced: "₹6 LPA – ₹15 LPA",
        description: "Manages check-ins/check-outs, inputs guest details in PMS software, coordinates room requests, and processes bills.",
        howToBecome: [
          "Complete Certificate or Diploma in Hotel Management",
          "Build excellent soft skills and grooming standards",
          "Apply to hotel chains for entry-level traineeships"
        ],
        skills: ["PMS Software", "Telephone Etiquette", "Problem Solving", "Billing Checkout"],
        workplaces: ["Hotels & Resorts", "Luxury Guest Houses", "Hospital Reception Desks", "Corporate Clubs"],
        future: "Can advance to Front Office Manager and Rooms Division Manager.",
        certifications: ["Hotel Management Diploma"],
        higherStudy: "BHM (Bachelor of Hotel Management)"
      }
    ]
  },
  {
    id: "fashion-designing",
    categoryId: "specialized",
    title: "Fashion Designing",
    icon: "👗",
    description: "Creative program teaching sketch drawing, fabric selecting, pattern cutting, sewing machine operating, and trend styling.",
    duration: "2–3 Years",
    skillsRequired: ["Drawing/Sketching", "Stitching patterns", "Fabric textures knowledge", "Color aesthetics"],
    higherStudies: ["B.Des Fashion Design (after 12th equivalent)", "Apparel Merchandising advanced diploma"],
    futureScope: "High options for independent boutique startups, designer assistant jobs, and garment exports industries.",
    careerOpportunities: [
      {
        id: "fashion-assistant-10",
        title: "Fashion Design Assistant / Pattern Maker",
        icon: "✂️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹1.8 LPA – ₹2.8 LPA",
        salaryExperienced: "₹5 LPA – ₹15 LPA",
        description: "Draws base sketches, sources fabric supplies, cuts cardboard patterns, and supervises sewing processes.",
        howToBecome: [
          "Complete Diploma in Fashion Designing after 10th",
          "Build a design portfolio of stitched garments",
          "Apply as an intern with boutiques or design houses"
        ],
        skills: ["Pattern Drafting", "Machine Stitching", "Sketching", "Fabric Sourcing"],
        workplaces: ["Boutiques", "Apparel Production Units", "Fashion Design Houses", "Garment Export Hubs"],
        future: "Transition to Chief Fashion Designer or launch independent boutique.",
        certifications: ["Fashion Design Diploma Certificate"],
        higherStudy: "B.Des in Fashion Design"
      }
    ]
  },
  {
    id: "animation",
    categoryId: "specialized",
    title: "Animation & VFX",
    icon: "🎬",
    description: "Covers 3D modeling layouts, storyboard drawing, digital lighting, character keyframing, and video composites.",
    duration: "2 Years",
    skillsRequired: ["Drawing skills", "3D software (Blender/Maya)", "Color rendering", "Stamina"],
    higherStudies: ["B.Sc Animation", "Game Art & Programming Degree"],
    futureScope: "Massive sector growth in India due to animation outsourcing, mobile games design, and VFX movie pipelines.",
    careerOpportunities: [
      {
        id: "animator-assistant-10",
        title: "3D Modeler / Animation Assistant",
        icon: "👾",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹2 LPA – ₹3.5 LPA",
        salaryExperienced: "₹6 LPA – ₹20 LPA",
        description: "Builds digital wireframe meshes of characters/environments and maps textures using 3D graphics tools.",
        howToBecome: [
          "Complete Animation & VFX Diploma/Certificate after 10th",
          "Master Blender or Autodesk Maya",
          "Build a showreel showing 3D model turns and simple walks"
        ],
        skills: ["Autodesk Maya / Blender", "Character Modeling", "Texture Mapping", "Lighting Basics"],
        workplaces: ["Gaming Companies", "VFX Studios", "Ad Production Houses", "E-learning Content Units"],
        future: "Can advance to Senior Animator, Rigging Lead, or Art Director.",
        certifications: ["Autodesk Certified User (Maya)"],
        higherStudy: "B.Sc Animation & Multimedia"
      }
    ]
  },
  {
    id: "aviation",
    categoryId: "specialized",
    title: "Aviation (Airport Management / Cabin Crew)",
    icon: "✈️",
    description: "Focuses on airport ticketing software, terminal operations, guest safety, customer support, and aviation etiquette.",
    duration: "1–2 Years",
    skillsRequired: ["Excellent English", "Professional Grooming", "Ticketing tools", "Patience"],
    higherStudies: ["B.Sc Aviation", "MBA Aviation Management"],
    futureScope: "Growing sector with rapid expansion of domestic airlines and construction of new smart airports.",
    careerOpportunities: [
      {
        id: "ground-staff-10",
        title: "Airport Ground Staff / Ticketing Executive",
        icon: "✈️",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹2.2 LPA – ₹3.5 LPA",
        salaryExperienced: "₹5 LPA – ₹10 LPA",
        description: "Checks passenger IDs, issues boarding passes, resolves luggage weights, and manages boarding gates.",
        howToBecome: [
          "Complete Aviation & Airport Management certificate course",
          "Acquire fluent English and regional languages communication",
          "Apply during airline ground staff recruitment drives"
        ],
        skills: ["SABRE/Amadeus Ticketing Software", "Passenger Relations", "Baggage Rules", "Terminal Safety"],
        workplaces: ["Airports", "Commercial Airlines", "Aviation Ticketing Agencies"],
        future: "Opportunity to progress to Duty Manager or Cabin Crew.",
        certifications: ["Airport Management Diploma", "Amadeus Software Certificate"],
        higherStudy: "BBA in Aviation Management"
      }
    ]
  }
];

module.exports = {
  after10thCategories,
  after10thCourses
};
