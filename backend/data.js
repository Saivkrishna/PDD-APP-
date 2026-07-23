const careerData = {
  after10th: {
    streams: [
      {
        id: "intermediate",
        title: "Intermediate / 11th & 12th",
        icon: "📘",
        description: "Continue formal education with stream selection. Choose a stream based on your interests and career goals.",
        duration: "2 Years",
        subStreams: [
          {
            id: "mpc",
            label: "MPC – Mathematics, Physics, Chemistry",
            icon: "🔢",
            description: "Ideal for students interested in engineering, technology, defense and data science.",
            leadsTo: ["Engineering (B.Tech)", "NDA – National Defence Academy", "Architecture (B.Arch)", "Data Science", "B.Sc Mathematics / Physics"]
          },
          {
            id: "bipc",
            label: "BiPC – Biology, Physics, Chemistry",
            icon: "🧬",
            description: "Best path for careers in medicine, healthcare, pharmacy and life sciences.",
            leadsTo: ["MBBS – Doctor", "BDS – Dental Surgery", "B.Pharmacy", "B.Sc Nursing", "Biotechnology"]
          },
          {
            id: "mec",
            label: "MEC – Mathematics, Economics, Commerce",
            icon: "📊",
            description: "Perfect for students interested in finance, banking, business and accounting.",
            leadsTo: ["B.Com / B.Com (Hons)", "CA – Chartered Accountancy", "Banking & Finance", "BBA – Business Administration", "Economics"]
          },
          {
            id: "cec",
            label: "CEC – Civics, Economics, Commerce",
            icon: "⚖️",
            description: "Gateway to law, civil services, government jobs and social science careers.",
            leadsTo: ["Law (BA LLB)", "Civil Services (IAS/IPS)", "Degree (BA/B.Com)", "Government Jobs", "Political Science"]
          },
          {
            id: "arts",
            label: "Arts / Humanities",
            icon: "🎭",
            description: "For students passionate about literature, journalism, psychology, and social impact.",
            leadsTo: ["Journalism & Mass Communication", "Psychology", "UPSC Civil Services", "Literature & Languages", "Teaching / Education"]
          }
        ],
        options: ["MPC – Maths, Physics, Chemistry", "BiPC – Biology, Physics, Chemistry", "MEC – Maths, Economics, Commerce", "CEC – Civics, Economics, Commerce", "Arts / Humanities"]
      },
      {
        id: "diploma",
        title: "Diploma / Polytechnic",
        icon: "🛠️",
        description: "3-year technical diploma programs after 10th. Get industry-ready skills and earn while you learn.",
        duration: "3 Years",
        departments: [
          { name: "CSE – Computer Science Engineering", icon: "💻", jobs: ["Software Developer", "Web Designer", "IT Support"] },
          { name: "Mechanical Engineering", icon: "⚙️", jobs: ["Mechanical Technician", "Production Supervisor", "Design Drafter"] },
          { name: "Civil Engineering", icon: "🏗️", jobs: ["Site Supervisor", "Draftsman", "Survey Technician"] },
          { name: "ECE – Electronics & Communication", icon: "📡", jobs: ["Electronics Technician", "PCB Designer", "Network Technician"] },
          { name: "Electrical Engineering", icon: "⚡", jobs: ["Electrical Technician", "Wireman", "Sub-Station Operator"] },
          { name: "Automobile Engineering", icon: "🚗", jobs: ["Auto Mechanic", "Service Advisor", "Workshop Supervisor"] }
        ],
        leadsTo: ["Technical Jobs (₹12,000–₹35,000/month)", "B.Tech Lateral Entry (2nd Year Direct Admission)"],
        options: ["CSE", "Mechanical", "Civil", "ECE", "Electrical", "Automobile"]
      },
      {
        id: "iti",
        title: "ITI Courses",
        icon: "🔧",
        description: "Industrial Training Institute programs. Job-ready technical trades in 1–2 years with government recognition.",
        duration: "1–2 Years",
        trades: [
          { name: "Electrician", icon: "⚡", duration: "2 Years", jobs: ["Electrician", "Wireman", "Maintenance Technician"] },
          { name: "Fitter", icon: "🔩", duration: "2 Years", jobs: ["Mechanical Fitter", "Maintenance Fitter", "Plant Operator"] },
          { name: "Welder", icon: "🔥", duration: "1 Year", jobs: ["Welder", "Fabricator", "Pipeline Technician"] },
          { name: "Mechanic (MRAC)", icon: "🚗", duration: "2 Years", jobs: ["Auto Mechanic", "Workshop Technician", "Service Advisor"] },
          { name: "COPA – Computer Operator & Programming", icon: "💻", duration: "1 Year", jobs: ["Computer Operator", "Data Entry Operator", "Office Assistant"] }
        ],
        leadsTo: ["Technician Jobs (₹10,000–₹28,000/month)", "Government Trade Jobs (NTPC, Railways, ONGC)", "Apprenticeship in PSUs"],
        options: ["Electrician", "Fitter", "Welder", "Mechanic", "COPA"]
      },
      {
        id: "shortterm",
        title: "Short-Term Skill Courses",
        icon: "💻",
        description: "Fast-track skill certificates for immediate employment. Complete in weeks to months.",
        duration: "1–6 Months",
        courses: [
          { name: "Computer Courses (MS Office, Tally)", icon: "🖥️", duration: "3 Months", jobs: ["Data Entry Operator", "Office Assistant", "Accountant Assistant"] },
          { name: "Graphic Design", icon: "🎨", duration: "3–6 Months", jobs: ["Graphic Designer", "Social Media Designer", "Freelance Artist"] },
          { name: "Video Editing", icon: "🎬", duration: "2–3 Months", jobs: ["Video Editor", "YouTube Content Creator", "Reel Editor"] },
          { name: "Digital Marketing", icon: "📱", duration: "3 Months", jobs: ["Digital Marketer", "SEO Executive", "Social Media Manager"] }
        ],
        leadsTo: ["Freelancing (₹10,000–₹50,000+/month)", "Private Jobs", "Self-Employment / Startup"],
        options: ["Computer Courses", "Graphic Design", "Video Editing", "Digital Marketing"]
      },
      {
        id: "vocational",
        title: "Vocational Courses",
        icon: "🌾",
        description: "Government-recognized vocational training programs aligned with industry demand.",
        duration: "1–2 Years",
        courses: [
          { name: "Agriculture", icon: "🌾", duration: "1 Year", jobs: ["Agriculture Assistant", "Agri-Business Executive", "Govt Agriculture Officer"] },
          { name: "Healthcare Assistant", icon: "🏥", duration: "1 Year", jobs: ["Healthcare Assistant", "Nursing Aid", "Hospital Support Staff"] },
          { name: "Retail Management", icon: "🛍️", duration: "1 Year", jobs: ["Retail Executive", "Store Manager", "Sales Associate"] },
          { name: "Tourism & Hospitality", icon: "✈️", duration: "1 Year", jobs: ["Tour Guide", "Travel Agent", "Hotel Staff"] }
        ],
        leadsTo: ["Industry-Specific Jobs", "Government Sector Jobs", "Further Diploma Courses"],
        options: ["Agriculture", "Healthcare", "Retail", "Tourism"]
      },
      {
        id: "specialized",
        title: "Specialized Professional Courses",
        icon: "🌟",
        description: "Creative and professional certificate programs with strong job placement and industry demand.",
        duration: "1–3 Years",
        courses: [
          { name: "Hotel Management", icon: "🏨", duration: "3 Years", jobs: ["Hotel Manager", "Chef", "Front Desk Executive", "F&B Manager"] },
          { name: "Fashion Designing", icon: "👗", duration: "2–3 Years", jobs: ["Fashion Designer", "Costume Designer", "Textile Designer", "Stylist"] },
          { name: "Animation & VFX", icon: "🎬", duration: "2 Years", jobs: ["Animator", "VFX Artist", "Game Designer", "Motion Graphic Designer"] },
          { name: "Aviation (Airport Management)", icon: "✈️", duration: "1–2 Years", jobs: ["Airport Ground Staff", "Cabin Crew", "Aviation Executive", "Air Ticketing Agent"] }
        ],
        leadsTo: ["Creative Industry Jobs (₹15,000–₹60,000+/month)", "International Career Opportunities", "Entrepreneurship & Freelancing"],
        options: ["Hotel Management", "Fashion Designing", "Animation & VFX", "Aviation"]
      }
    ],
    jobs: [
      {
        id: "computer-operator",
        title: "Computer Operator",
        icon: "🖥️",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹10K–₹18K/month",
        salaryExperienced: "₹25K+/month",
        salary: "₹10K–₹18K/month",
        description: "Handle data entry, computer operations and basic IT tasks in offices, banks, schools and government organizations.",
        howToBecome: ["Basic Computer Course", "MS Office Skills"],
        skills: ["Typing", "Excel", "Communication"],
        workplaces: ["Offices", "Schools", "Shops"],
        future: "Can grow to Data Analyst, Office Manager. Pursue graduation while working.",
        certifications: ["O Level (NIELIT)", "CCC Certificate", "Tally ERP 9"],
        higherStudy: "B.Com, BCA, or Diploma in Computer Science"
      },
      {
        id: "graphic-designer",
        title: "Graphic Designer",
        icon: "🎨",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹15K–₹25K/month",
        salaryExperienced: "₹40K+/month",
        salary: "₹15K–₹25K/month",
        description: "Create visual content for brands, social media, advertisements and digital platforms using design tools.",
        howToBecome: ["Learn Photoshop/Canva"],
        skills: ["Creativity", "Design Skills"],
        workplaces: ["Marketing Agencies", "Freelancing"],
        future: "Freelance opportunities, UI/UX Design, Creative Director roles with experience.",
        certifications: ["Adobe Certified Professional", "Graphic Design Certificate (Udemy/Coursera)"],
        higherStudy: "BFA, B.Des, or Diploma in Graphic Design"
      },
      {
        id: "video-editor",
        title: "Video Editor",
        icon: "🎬",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹15K–₹30K/month",
        salaryExperienced: "₹50K+/month",
        salary: "₹15K–₹30K/month",
        description: "Edit and produce video content for YouTube channels, media companies, brands and social media platforms.",
        howToBecome: ["Learn Premiere Pro/CapCut"],
        skills: ["Editing", "Creativity"],
        workplaces: ["YouTube Channels", "Media Companies"],
        future: "Grow into Director of Photography, Motion Designer or start your own production house.",
        certifications: ["Adobe Premiere Pro Certificate", "DaVinci Resolve Certification"],
        higherStudy: "Diploma in Film Making, B.Sc Mass Communication"
      },
      {
        id: "web-design-assistant",
        title: "Web Design Assistant",
        icon: "🌐",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹15K–₹25K/month",
        salaryExperienced: "₹45K+/month",
        salary: "₹15K–₹25K/month",
        description: "Assist in designing and building website interfaces for clients using HTML, CSS and design tools.",
        howToBecome: ["Learn HTML/CSS basics"],
        skills: ["UI Basics", "Creativity"],
        workplaces: ["IT Companies", "Freelancing"],
        future: "Become a Full Stack Developer or UI/UX Designer with more skills and experience.",
        certifications: ["Google UX Design Certificate", "FreeCodeCamp HTML/CSS"],
        higherStudy: "BCA, Diploma in Web Development"
      },
      {
        id: "social-media-manager",
        title: "Social Media Manager",
        icon: "📱",
        category: "IT",
        categoryIcon: "💻",
        salaryFresher: "₹15K–₹25K/month",
        salaryExperienced: "₹50K+/month",
        salary: "₹15K–₹25K/month",
        description: "Manage brand presence, create content and run marketing campaigns across social media platforms like Instagram, Facebook and YouTube.",
        howToBecome: ["Learn Instagram/Facebook Marketing"],
        skills: ["Communication", "Marketing"],
        workplaces: ["Brands", "Agencies"],
        future: "Grow into Digital Marketing Manager, Brand Strategist or start your own agency.",
        certifications: ["Google Digital Marketing Certificate", "Meta Blueprint Certification"],
        higherStudy: "BBA Marketing, Diploma in Digital Marketing"
      },
      {
        id: "electrician",
        title: "Electrician",
        icon: "⚡",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹12K–₹20K/month",
        salaryExperienced: "₹35K+/month",
        salary: "₹12K–₹20K/month",
        description: "Install, maintain and repair electrical systems in homes, industries and commercial buildings.",
        howToBecome: ["ITI Electrician"],
        skills: ["Wiring", "Electrical Repair"],
        workplaces: ["Construction", "Factories"],
        future: "Electrical Contractor, Supervisor, or Diploma in Electrical Engineering.",
        certifications: ["ITI Electrician Certificate", "Wireman License (State Electricity Board)"],
        higherStudy: "Diploma in Electrical Engineering → B.Tech EEE"
      },
      {
        id: "mechanic",
        title: "Mechanic",
        icon: "🔩",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹12K–₹20K/month",
        salaryExperienced: "₹40K+/month",
        salary: "₹12K–₹20K/month",
        description: "Diagnose, repair and maintain vehicles and mechanical equipment at garages, service centers and factories.",
        howToBecome: ["ITI Mechanic"],
        skills: ["Vehicle Repair", "Tool Handling"],
        workplaces: ["Garages", "Service Centers"],
        future: "Senior Mechanic, Workshop Owner, Automobile Service Manager.",
        certifications: ["ITI MRAC Certificate", "Automobile Manufacturer Training (Maruti, Hero, Bajaj)"],
        higherStudy: "Diploma in Automobile Engineering"
      },
      {
        id: "welder-fitter",
        title: "Welder / Fitter",
        icon: "🔥",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹12K–₹22K/month",
        salaryExperienced: "₹45K+/month",
        salary: "₹12K–₹22K/month",
        description: "Join and fabricate metal structures using welding and fitting techniques for factories, construction and industrial projects.",
        howToBecome: ["ITI Welder/Fitter"],
        skills: ["Welding", "Fabrication"],
        workplaces: ["Factories", "Industries"],
        future: "Senior Welder, Fabrication Supervisor, or work on international projects (Gulf countries).",
        certifications: ["ITI Welder Certificate", "AWS Welding Certification", "ASME Certification"],
        higherStudy: "Diploma in Mechanical Engineering"
      },
      {
        id: "police-constable",
        title: "Police Constable",
        icon: "👮",
        category: "Government",
        categoryIcon: "🛡️",
        salaryFresher: "₹25K–₹40K/month",
        salaryExperienced: "",
        salary: "₹25K–₹40K/month",
        description: "Maintain law and order, assist in investigations and serve the community under state police forces.",
        howToBecome: ["State Police Exams"],
        skills: ["Fitness", "Discipline"],
        workplaces: ["Police Department"],
        future: "Sub Inspector, Inspector through departmental promotions over time.",
        certifications: ["State Police Written Exam", "Physical Fitness Test", "Medical Test"],
        higherStudy: "Pursue graduation during service for SI exam eligibility"
      },
      {
        id: "army-soldier",
        title: "Army Soldier",
        icon: "🪖",
        category: "Government",
        categoryIcon: "🛡️",
        salaryFresher: "₹30K–₹50K/month",
        salaryExperienced: "",
        salary: "₹30K–₹50K/month",
        description: "Serve in the Indian Army as a soldier, protect national borders and participate in defence operations and disaster relief.",
        howToBecome: ["Army Recruitment Rally"],
        skills: ["Physical Fitness", "Discipline"],
        workplaces: ["Indian Army"],
        future: "Promotion to Naik, Havildar, JCO. Pension and benefits after 15+ years of service.",
        certifications: ["Army Recruitment Rally Selection", "Combat & Trade Training Certificate"],
        higherStudy: "B.Tech / Graduation through distance education while in service"
      },
      {
        id: "railway-jobs",
        title: "Railway Jobs (RRB)",
        icon: "🚆",
        category: "Government",
        categoryIcon: "🛡️",
        salaryFresher: "₹25K–₹45K/month",
        salaryExperienced: "",
        salary: "₹25K–₹45K/month",
        description: "Work in Indian Railways as Group D staff, ticketing, track maintenance and station operations.",
        howToBecome: ["RRB Exams"],
        skills: ["Technical Skills", "Aptitude"],
        workplaces: ["Indian Railways"],
        future: "Group C promotions, departmental advancement through RRB exams.",
        certifications: ["RRB NTPC Exam", "RRB Group D Exam", "RPF Constable Exam"],
        higherStudy: "Graduation for higher railway officer roles (RRB JE, SSE)"
      },
      {
        id: "retail-staff",
        title: "Retail Staff",
        icon: "🛒",
        category: "Non-IT",
        categoryIcon: "🔧",
        salaryFresher: "₹10K–₹18K/month",
        salaryExperienced: "₹25K+/month",
        salary: "₹10K–₹18K/month",
        description: "Handle customer service, billing and store operations in malls, supermarkets and retail outlets.",
        howToBecome: ["Communication Skills"],
        skills: ["Customer Service", "Sales"],
        workplaces: ["Malls", "Supermarkets"],
        future: "Store Manager, Area Sales Manager, or move into corporate retail operations.",
        certifications: ["Retail Management Certificate (NSDC)", "Customer Service Training"],
        higherStudy: "BBA, Diploma in Retail Management"
      }
    ]
  },

  after12th: {
    MPC: {
      label: "MPC – Maths, Physics, Chemistry",
      sectors: [
        {
          id: "engineering",
          title: "Engineering & Technology",
          icon: "🎓",
          departments: [
            { id: "cse", title: "Computer Science Engineering (CSE)", icon: "💻", description: "Core computer science program focusing on software, theory, and systems.", entranceExams: ["JEE Main", "JEE Advanced", "AP/TS EAMCET", "VITEEE"], topColleges: ["IITs", "NITs", "IIITs", "BITS Pilani"], skills: ["Programming", "Data Structures", "Algorithms", "Databases"], salary: "Fresher: ₹4–12 LPA | Experienced: ₹18–50+ LPA", careers: ["Software Engineer", "Systems Architect", "Full Stack Developer"], certifications: ["AWS Certified Developer", "Oracle Java Programmer"] },
            { id: "cse_ai", title: "CSE (AI) – Artificial Intelligence", icon: "🤖", description: "Specialization focusing on Machine Learning, neural networks, and automated systems.", entranceExams: ["JEE Main", "AP/TS EAMCET", "VITEEE"], topColleges: ["IIT Hyderabad", "IIIT Bangalore", "BITS Pilani"], skills: ["Python", "Machine Learning", "Neural Networks", "Data Modeling"], salary: "Fresher: ₹5–15 LPA | Experienced: ₹20–60+ LPA", careers: ["AI Engineer", "Machine Learning Engineer", "Research Scientist"], certifications: ["Google Cloud ML Engineer", "TensorFlow Developer"] },
            { id: "cse_ds", title: "CSE (DS) – Data Science", icon: "📊", description: "Focuses on extracting knowledge from large data sets and data processing methodologies.", entranceExams: ["JEE Main", "AP/TS EAMCET", "VITEEE"], topColleges: ["IIT Madras", "IIIT Delhi", "VIT Vellore"], skills: ["Data Analytics", "SQL", "Python", "Statistical Modeling"], salary: "Fresher: ₹4.5–12 LPA | Experienced: ₹18–50 LPA", careers: ["Data Scientist", "Data Analyst", "Data Architect"], certifications: ["IBM Data Science", "Microsoft Azure Data Scientist"] },
            { id: "cse_cs", title: "CSE (CS) – Cyber Security", icon: "🛡️", description: "Specialization in securing networks, cryptography, and defending against cyber threats.", entranceExams: ["JEE Main", "AP/TS EAMCET", "VITEEE"], topColleges: ["IIT Jammu", "NIT Kurukshetra", "VIT Vellore"], skills: ["Network Security", "Cryptography", "Penetration Testing", "Ethical Hacking"], salary: "Fresher: ₹4–10 LPA | Experienced: ₹15–40+ LPA", careers: ["Security Analyst", "Ethical Hacker", "Cyber Security Engineer"], certifications: ["CEH (Ethical Hacker)", "CISSP", "CompTIA Security+"] },
            { id: "it", title: "IT – Information Technology", icon: "🌐", description: "Applies computer systems to store, retrieve, transmit, and manipulate business data.", entranceExams: ["JEE Main", "AP/TS EAMCET", "VITEEE"], topColleges: ["IIIT Allahabad", "NIT Trichy", "NSUT Delhi"], skills: ["Web Technologies", "Database Management", "System Administration"], salary: "Fresher: ₹3.5–10 LPA | Experienced: ₹15–45 LPA", careers: ["IT Analyst", "Database Administrator", "System Administrator"], certifications: ["Cisco CCNA", "Microsoft Certified Solutions Associate"] },
            { id: "eee", title: "EEE – Electrical & Electronics Engineering", icon: "⚡", description: "Covers electrical machines, power transmission systems, and power electronics.", entranceExams: ["JEE Main", "AP/TS EAMCET", "SRMJEEE"], topColleges: ["IIT Kharagpur", "NIT Surathkal", "BITS Pilani"], skills: ["Circuit Design", "Power Systems Analysis", "Control Systems", "MATLAB"], salary: "Fresher: ₹3.5–8 LPA | Experienced: ₹10–25 LPA", careers: ["Electrical Engineer", "Power Plant Manager", "Control Systems Engineer"], certifications: ["PLC/SCADA Certification", "Power Systems Specialist"] },
            { id: "ece", title: "ECE – Electronics & Communication Engineering", icon: "🔌", description: "Focuses on microprocessors, electromagnetic waves, and telecommunication networks.", entranceExams: ["JEE Main", "AP/TS EAMCET", "VITEEE"], topColleges: ["IIT Roorkee", "NIT Trichy", "IIIT Hyderabad"], skills: ["Embedded Systems", "VLSI Design", "Signal Processing", "Circuit Simulation"], salary: "Fresher: ₹4–10 LPA | Experienced: ₹15–35+ LPA", careers: ["Embedded Engineer", "VLSI Designer", "Telecom Engineer"], certifications: ["Embedded Systems Certificate", "VLSI Design Professional"] },
            { id: "eie", title: "EIE – Electronics & Instrumentation Engineering", icon: "📡", description: "Deals with automated systems, sensor technologies, and measurement tools for chemical processes.", entranceExams: ["JEE Main", "AP/TS EAMCET"], topColleges: ["IIT Kharagpur", "NIT Rourkela", "BITS Pilani"], skills: ["Sensor Design", "Process Control", "Industrial Automation", "LabVIEW"], salary: "Fresher: ₹3.5–8 LPA | Experienced: ₹10–28 LPA", careers: ["Instrumentation Engineer", "Automation Analyst", "Quality Control Inspector"], certifications: ["ISA Certified Automation Professional"] },
            { id: "me", title: "ME – Mechanical Engineering", icon: "⚙️", description: "Core engineering stream covering materials, design drafting, thermodynamics, and manufacturing.", entranceExams: ["JEE Main", "JEE Advanced", "AP/TS EAMCET"], topColleges: ["IIT Bombay", "NIT Trichy", "BITS Pilani"], skills: ["CAD Modeling", "Thermodynamics", "Materials Testing", "Manufacturing Systems"], salary: "Fresher: ₹3–8 LPA | Experienced: ₹10–30 LPA", careers: ["Mechanical Engineer", "Production Engineer", "Maintenance Supervisor"], certifications: ["SolidWorks Certified Associate", "AutoCAD Professional"] },
            { id: "ce", title: "CE – Civil Engineering", icon: "🏗️", description: "Focuses on designing, construction, and managing public structures like roads, bridges, and dams.", entranceExams: ["JEE Main", "AP/TS EAMCET", "MHT CET"], topColleges: ["IIT Delhi", "NIT Trichy", "COEP Pune"], skills: ["Structural Analysis", "AutoCAD Civil 3D", "Estimation", "Project Management"], salary: "Fresher: ₹3–7 LPA | Experienced: ₹10–25 LPA", careers: ["Civil Engineer", "Structural Engineer", "Site Manager"], certifications: ["STAAD Pro Certification", "Primavera Project Management"] },
            { id: "ae", title: "AE – Automobile Engineering", icon: "🚗", description: "Specialized engineering branch covering automotive electronics, engines, and vehicle dynamics.", entranceExams: ["JEE Main", "AP/TS EAMCET", "SRMJEEE"], topColleges: ["Anna University", "MIT Manipal", "PSG Tech Coimbatore"], skills: ["Engine Diagnostics", "AutoCAD", "Vehicle Dynamics", "EV Tech basics"], salary: "Fresher: ₹3.5–8 LPA | Experienced: ₹12–28 LPA", careers: ["Automotive Engineer", "Vehicle Tester", "Service Manager"], certifications: ["EV Design & Technology Cert"] },
            { id: "aero", title: "AERO – Aeronautical Engineering", icon: "🛰️", description: "Deals with designing, manufacturing, and maintenance of airplanes, satellites, and rockets.", entranceExams: ["JEE Main", "JEE Advanced", "VITEEE"], topColleges: ["IIT Bombay", "IIT Madras", "IIEST Shibpur"], skills: ["Aerodynamics", "Flight Mechanics", "Propulsion Systems", "Ansys Simulation"], salary: "Fresher: ₹5–12 LPA | Experienced: ₹15–40+ LPA", careers: ["Aerospace Engineer", "Flight Data Analyst", "Aero Engine Designer"], certifications: ["Aviation Safety Systems Cert"] }
          ]
        },
        {
          id: "it_computer",
          title: "IT & Computer Courses",
          icon: "💻",
          departments: [
            { id: "bca", title: "BCA – Computer Applications", icon: "💻", description: "Core computer software application degree covering database design, programming, and web systems.", entranceExams: ["IPU CET", "CUET", "State CETs"], topColleges: ["Christ University Bangalore", "Symbiosis Institute Pune"], skills: ["Java Programming", "HTML/CSS", "Database Querying", "Software Testing"], salary: "Fresher: ₹3.5–7 LPA | MCA Graduate: ₹12–30 LPA", careers: ["Software Developer", "IT Specialist", "Quality Analyst"], certifications: ["Oracle Certified Associate Java"] },
            { id: "wd", title: "WD – Web Development", icon: "🌐", description: "Specialized training in front-end designs, back-end servers, and full-stack web applications.", entranceExams: ["Direct Merit", "Institute Tests"], topColleges: ["Scaler Academy", "NIIT Centres", "FreeCodeCamp Programs"], skills: ["JavaScript", "React.js / Angular", "Node.js & Express", "MongoDB/SQL"], salary: "Fresher: ₹4–9 LPA | Senior Developer: ₹15–40 LPA", careers: ["Full Stack Web Developer", "Frontend Engineer", "Backend Developer"], certifications: ["Meta Frontend/Backend Developer Certificate"] },
            { id: "ad", title: "AD – App Development", icon: "📱", description: "Focuses on designing, building, and deploying applications on Android and iOS devices.", entranceExams: ["Institute Entrances", "Direct Merit"], topColleges: ["Udacity Nanodegrees", "NIIT", "Private IT Academies"], skills: ["Kotlin / Java for Android", "Swift for iOS", "Flutter / React Native"], salary: "Fresher: ₹4–10 LPA | Lead iOS Developer: ₹18–45 LPA", careers: ["Android Developer", "iOS App Developer", "Cross-Platform App Engineer"], certifications: ["Google Associate Android Developer"] },
            { id: "cs_it", title: "CS – Cyber Security", icon: "🛡️", description: "Focuses on cybersecurity operations, defensive architectures, penetration testing, and digital forensics.", entranceExams: ["Institute Entrances", "State CETs"], topColleges: ["National Forensic Sciences University", "NIIT"], skills: ["Threat Monitoring", "Firewall Configuration", "Malware Analysis"], salary: "Fresher: ₹4–9 LPA | Senior Consultant: ₹15–35 LPA", careers: ["Security Analyst", "Network Defender", "Incident Responder"], certifications: ["Certified Ethical Hacker (CEH)", "CompTIA Security+"] },
            { id: "gd", title: "GD – Game Development", icon: "🎮", description: "Covers game physics, 3D modeling environments, scripting gameplay logic, and virtual reality implementations.", entranceExams: ["Direct Admissions", "Design Aptitude Tests"], topColleges: ["Backstage Pass Institute Hyderabad", "MAAC"], skills: ["C# / C++", "Unity 3D Engine", "Unreal Engine Blueprinting", "Game Mechanics Design"], salary: "Fresher: ₹3–7 LPA | Senior Game Dev: ₹12–30 LPA", careers: ["Game Programmer", "Unity Developer", "Unreal Gameplay Coder"], certifications: ["Unity Certified User Programmer"] },
            { id: "am", title: "AM – Animation & Multimedia", icon: "🎨", description: "Covers 3D character keyframing, motion graphics, video composites, and digital lighting.", entranceExams: ["Aptitude/Drawing tests", "Merit admissions"], topColleges: ["Arena Animation", "MAAC", "Srishti Manipal Institute"], skills: ["3D Character Rigging", "Storyboard Layouts", "Autodesk Maya / Blender"], salary: "Fresher: ₹2.5–5 LPA | VFX Director: ₹15–35 LPA", careers: ["3D Animator", "VFX Compositor", "Motion Graphic Artist"], certifications: ["Autodesk Maya Certified Professional"] },
            { id: "ds_it", title: "DS – Data Science", icon: "📊", description: "Covers statistical modeling, python data pipelines, database warehousing, and predictive modeling.", entranceExams: ["Direct Merit", "University CETs"], topColleges: ["Christ University", "Scaler Academy"], skills: ["Python & R", "SQL Database Filing", "Data Visual Analytics"], salary: "Fresher: ₹4.5–11 LPA | Experienced: ₹18–40 LPA", careers: ["Data Analyst", "Data Engineer", "Machine Learning Specialist"], certifications: ["Microsoft Certified: Power BI Associate"] },
            { id: "cc", title: "CC – Cloud Computing", icon: "☁️", description: "Studies virtualization, cloud storage architectures, server migrations, and scalable web servers.", entranceExams: ["IT Entrance Exams", "Direct Merit"], topColleges: ["Simplilearn", "Cognizant Academies", "Private IT Institutes"], skills: ["AWS Operations", "Docker & Kubernetes", "Linux Shell Scripting"], salary: "Fresher: ₹4–10 LPA | Cloud Architect: ₹20–50 LPA", careers: ["Cloud Administrator", "DevOps Engineer", "AWS Operations Specialist"], certifications: ["AWS Cloud Practitioner", "Google Cloud Associate Cloud Engineer"] },
            { id: "ai_it", title: "AI – Artificial Intelligence", icon: "🤖", description: "Studies machine learning algorithms, deep learning neural networks, NLP chatbots, and computer vision.", entranceExams: ["University CETs", "Direct Entry"], topColleges: ["Scaler Academy", "Christ University"], skills: ["Python", "PyTorch / TensorFlow", "Data Preprocessing", "Neural Networks"], salary: "Fresher: ₹5–12 LPA | AI Consultant: ₹20–48 LPA", careers: ["ML Engineer", "AI Developer", "Chatbot Consultant"], certifications: ["TensorFlow Developer Certificate"] },
            { id: "net", title: "NET – Networking", icon: "📡", description: "Covers routing protocols, switches, network security setups, IP structures, and client-server setups.", entranceExams: ["Direct Admissions", "Institute Entrance"], topColleges: ["Cisco Academies", "Jetking Infotrain"], skills: ["Router Configuration", "IP Subnetting", "Network Troubleshooting"], salary: "Fresher: ₹2.5–5 LPA | Network Administrator: ₹8–18 LPA", careers: ["Network Support Technician", "Cisco Systems Engineer", "Helpdesk Manager"], certifications: ["Cisco CCNA Certification", "CompTIA Network+"] }
          ]
        },
        {
          id: "defense_govt",
          title: "Defense & Government",
          icon: "🛡️",
          departments: [
            { id: "nda", title: "NDA – National Defence Academy", icon: "🪖", description: "Trains future commissioned officers for the Indian Army, Indian Navy, and Indian Air Force.", entranceExams: ["NDA Written Exam (UPSC)", "SSB Interview", "Medical Board Test"], topColleges: ["NDA Khadakwasla Pune", "IMA Dehradun", "AFA Hyderabad", "INA Ezhimala"], skills: ["Leadership", "Physical Tactics", "Military Science", "Survival Skills"], salary: "Officer Trainee: ₹56,100/month | Commissioned Rank: ₹80K–₹2.5L/month", careers: ["Lieutenant (Army)", "Sub-Lieutenant (Navy)", "Flying Officer (Air Force)"], certifications: ["NDA Graduation Certificate"] },
            { id: "police", title: "POLICE – Police Services", icon: "🚔", description: "Maintains district law and order, processes public complaints, traffic management, and crime investigations.", entranceExams: ["State Police Sub-Inspector Exams", "Police Constable Recruitment"], topColleges: ["State Police Training Academies"], skills: ["Physical Fitness", "Criminal Law basics", "Public Communication", "Discipline"], salary: "Constable: ₹25K–₹40K/month | Sub-Inspector: ₹35K–₹65K/month", careers: ["Police Constable", "Sub-Inspector", "Traffic Police Officer"], certifications: ["Police Academy Training Pass Certificate"] },
            { id: "rrb", title: "RRB – Railway Jobs", icon: "🚆", description: "Indian Railways jobs covering ticket checkers, technical locomotive helpers, station staff, and junior clerks.", entranceExams: ["RRB NTPC", "RRB Group D Exam", "RRB ALP (Assistant Loco Pilot)"], topColleges: ["Railways Recruitment Board Centres"], skills: ["Aptitude & Reasoning", "Technical Trade Skills", "General Awareness"], salary: "Group D: ₹22K–₹35K/month | NTPC Officer: ₹35K–₹60K/month", careers: ["Station Master", "Ticket Collector", "Loco Pilot Assistant"], certifications: ["Railway Medical & Technical Clearances"] },
            { id: "ssc", title: "SSC – Staff Selection Commission", icon: "🏛️", description: "Government services exam recruiting for assistant officers, tax inspectors, and data entry staff in ministries.", entranceExams: ["SSC CHSL (12th pass)", "SSC CGL (after graduation)", "SSC MTS"], topColleges: ["Staff Selection Commission Commissioned Offices"], skills: ["General English Grammar", "Quantitative Aptitude", "Office Administration Skills"], salary: "CHSL Post: ₹28K–₹45K/month | MTS Post: ₹22K–₹35K/month", careers: ["Lower Division Clerk", "Data Entry Operator", "Postal Assistant"], certifications: ["SSC Written & Skill Test Clearances"] },
            { id: "postal", title: "POSTAL – Postal Services", icon: "📮", description: "Deals with postal letter sorting, dispatch operations, mail delivery, and post office savings schemes.", entranceExams: ["India Post GDS (Gramin Dak Sevak) Merit list", "Postal Dept exams"], topColleges: ["India Post Training Centers"], skills: ["Sorting Speed", "Local Geography Knowledge", "Basic Computer Operations"], salary: "GDS: ₹12K–₹18K/month | Postal Clerk: ₹25K–₹45K/month", careers: ["Postmaster", "Mail Deliverer", "Postal Clerk"], certifications: ["Postal Operations Pass Cert"] },
            { id: "fire", title: "FIRE – Fire & Safety", icon: "🚒", description: "Trains firefighters in building evacuations, hazardous chemical handling, fire hose operations, and safety audits.", entranceExams: ["Fire Department Physical Rally", "State Fire Service Exams"], topColleges: ["National Fire Service College Nagpur"], skills: ["Firefighting Equipment operations", "Rescue Tactics", "First Aid & Trauma Care"], salary: "Fireman: ₹22K–₹42K/month | Safety Inspector: ₹30K–₹55K/month", careers: ["Firefighter", "Industrial Safety Officer", "Station Fire Officer"], certifications: ["Fire & Safety Diploma (NFSC)"] }
          ]
        }
      ]
    },
    BiPC: {
      label: "BiPC – Biology, Physics, Chemistry",
      sectors: [
        {
          id: "medical",
          title: "Medical & Healthcare",
          icon: "🩺",
          departments: [
            { id: "mbbs", title: "MBBS – Bachelor of Medicine", icon: "🩺", description: "Primary medical qualification allowing clinical general practice and surgery preparation.", entranceExams: ["NEET UG (Mandatory)"], topColleges: ["AIIMS New Delhi", "CMC Vellore", "JIPMER Puducherry"], skills: ["Diagnosis", "Patient Care", "Anatomy & Physiology", "Medical Ethics"], salary: "Fresher: ₹8–15 LPA | MD Specialist: ₹25–80+ LPA", careers: ["General Physician", "Surgeon", "Medical Officer"], certifications: ["Medical Council of India Registration"] },
            { id: "bds", title: "BDS – Dental Surgery", icon: "🦷", description: "Five-year professional degree covering oral health, root canals, and dental surgeries.", entranceExams: ["NEET UG"], topColleges: ["Maulana Azad Dental College", "Manipal Dental College"], skills: ["Orthodontics", "Dental Radiography", "Oral Anatomy", "Surgical Precision"], salary: "Fresher: ₹3.5–8 LPA | MDS Specialist: ₹12–35 LPA", careers: ["Dentist", "Oral Surgeon", "Dental Consultant"], certifications: ["Dental Council of India Registration"] },
            { id: "bpharm", title: "B.Pharm – Pharmacy", icon: "💊", description: "Covers organic chemistry, drug formulations, pharmacology, and drug inspector regulatory standards.", entranceExams: ["AP/TS EAMCET", "GPAT", "MHT CET"], topColleges: ["NIPER Mohali", "Jamia Hamdard New Delhi", "BITS Pilani"], skills: ["Pharmacology", "Drug Synthesis", "Quality Control", "Clinical Trials"], salary: "Fresher: ₹3–6 LPA | Experienced: ₹8–20 LPA", careers: ["Pharmacist", "Drug Inspector", "Research Assistant"], certifications: ["Registered Pharmacist License"] },
            { id: "nursing", title: "BSc Nursing – Nursing", icon: "🏥", description: "Four-year professional nursing degree focusing on patient care, hospital management, and emergency aid.", entranceExams: ["AIIMS Nursing Entrance", "State-level Nursing Exams"], topColleges: ["AIIMS New Delhi", "PGIMER Chandigarh", "CMC Vellore"], skills: ["Patient Care", "Vital Monitoring", "First Aid & CPR", "Ward Management"], salary: "Fresher: ₹2.5–5 LPA | Experienced: ₹6–15 LPA", careers: ["Staff Nurse", "Nursing Supervisor", "Home Care Coordinator"], certifications: ["Nursing Council Registration"] },
            { id: "bams", title: "BAMS – Ayurveda", icon: "🌿", description: "Integrated system of traditional Ayurvedic medicine alongside modern anatomy.", entranceExams: ["NEET UG"], topColleges: ["National Institute of Ayurveda Jaipur", "BHU Varanasi"], skills: ["Panchakarma Techniques", "Herbal Formulations", "Pulse Diagnosis (Nadi Pariksha)"], salary: "Fresher: ₹4–9 LPA | Experienced: ₹10–25 LPA", careers: ["Ayurvedic Doctor", "Panchakarma Specialist", "Agri-Herbal Manager"], certifications: ["Ayush Practitioner Board Cert"] },
            { id: "bhms", title: "BHMS – Homeopathy", icon: "🌱", description: "Professional degree covering the philosophy and practice of Homeopathic treatments.", entranceExams: ["NEET UG"], topColleges: ["National Institute of Homeopathy Kolkata", "Dr. D.Y. Patil Vidyapeeth"], skills: ["Homeopathic Materia Medica", "Repertory Studies", "Case Taking", "Patient Advisory"], salary: "Fresher: ₹3.5–8 LPA | Experienced: ₹10–22 LPA", careers: ["Homeopathic Consultant", "Clinic Administrator", "Pharma Representative"], certifications: ["Homeopathic Council Registration"] },
            { id: "bpt", title: "BPT – Physiotherapy", icon: "🦴", description: "Focuses on manual therapies, physical exercises, electrotherapy, and physical rehabilitation.", entranceExams: ["IPU CET", "NEET UG", "State CETs"], topColleges: ["KEM Hospital Mumbai", "NIRTAR Cuttack"], skills: ["Therapeutic Exercise", "Anatomy & Kinesiology", "Electrotherapy Tools"], salary: "Fresher: ₹3–7 LPA | Experienced: ₹8–20 LPA", careers: ["Physiotherapist", "Sports Rehabilitation Specialist", "Rehab Center Manager"], certifications: ["IAP Membership Registration"] },
            { id: "bt", title: "BT – Biotechnology", icon: "🧬", description: "Combines biology and engineering to modify living organisms for medicine, agriculture, and industrial products.", entranceExams: ["CUET", "AP/TS EAMCET", "JEE Main"], topColleges: ["IIT Delhi", "BITS Pilani", "Anna University"], skills: ["Recombinant DNA Tech", "Cell Culture", "Bioinformatics", "Microbiology"], salary: "Fresher: ₹3.5–8 LPA | Experienced: ₹12–30 LPA", careers: ["Research Scientist", "Biotech Analyst", "Lab technician"], certifications: ["GLP (Good Laboratory Practices) Cert"] },
            { id: "mlt", title: "MLT – Medical Lab Technology", icon: "🥼", description: "Trains professionals in diagnostic procedures, blood banking, hematology, and laboratory protocols.", entranceExams: ["CUET", "State Vocat Exams"], topColleges: ["PGIMER Chandigarh", "Jamia Hamdard"], skills: ["Blood Testing", "Microscopic Analysis", "Pathology Instrumentation"], salary: "Fresher: ₹2.2–5 LPA | Experienced: ₹6–12 LPA", careers: ["Lab Technologist", "Pathologist Assistant", "Blood Bank In-charge"], certifications: ["Medical Laboratory Technologist Lic"] },
            { id: "optom", title: "OPTOM – Optometry", icon: "👁️", description: "Covers vision diagnostics, lens prescriptions, binocular vision, and primary eye care checkups.", entranceExams: ["AIIMS Optometry", "State CETs"], topColleges: ["AIIMS New Delhi", "Elite School of Optometry Chennai"], skills: ["Refraction Testing", "Ophthalmic Instruments", "Contact Lens Fitting"], salary: "Fresher: ₹2.5–6 LPA | Experienced: ₹7–15 LPA", careers: ["Optometrist", "Eye Care Specialist", "Lens Product Representative"], certifications: ["Optometry Association Membership"] }
          ]
        },
        {
          id: "agri_vocational",
          title: "Agriculture & Vocational",
          icon: "🌾",
          departments: [
            { id: "agri", title: "AGRI – Agriculture", icon: "🌾", description: "Primary crop diagnostics, soil chemistry, modern greenhouse setups, drip irrigation, and agribusiness.", entranceExams: ["ICAR AIEEA", "State Agriculture CETs"], topColleges: ["IARI New Delhi", "PAU Ludhiana", "TNAU Coimbatore"], skills: ["Agronomy", "Soil Testing Analysis", "Pest Management", "Agribusiness Analytics"], salary: "Fresher: ₹3.5–7 LPA | Govt Agri Officer: ₹8–18 LPA", careers: ["Agronomist", "Agriculture Development Officer", "Farm Manager"], certifications: ["Organic Soil Analyst Certificate"] },
            { id: "dt", title: "DT – Dairy Technology", icon: "🐄", description: "Covers milk production operations, pasteurization, butter/cheese manufacturing, and dairy plants safety.", entranceExams: ["ICAR AIEEA", "State CETs"], topColleges: ["NDRI Karnal", "Sanjay Gandhi Dairy Institute Patna"], skills: ["Milk Processing", "Food Microbiology", "Quality Control Instrumentation"], salary: "Fresher: ₹3–6.5 LPA | Dairy Plant Manager: ₹10–22 LPA", careers: ["Dairy Technologist", "Quality Controller", "Dairy Plant Supervisor"], certifications: ["Dairy Plant Quality Control Cert"] },
            { id: "fish", title: "FISH – Fisheries", icon: "🐟", description: "Aquaculture pond design, fish health diagnostics, commercial hatchery setups, and marine resource preservation.", entranceExams: ["ICAR AIEEA", "State level CETs"], topColleges: ["CIFE Mumbai", "College of Fisheries Mangalore"], skills: ["Pond Water Analysis", "Aquacultural Nutrition", "Fish Diseases Diagnostics"], salary: "Fresher: ₹3–6 LPA | Fishery Inspector: ₹8–18 LPA", careers: ["Fishery Officer", "Hatchery In-charge", "Aquaculture Specialist"], certifications: ["Aquaculture Management Cert"] },
            { id: "ft", title: "FT – Food Technology", icon: "🍎", description: "Covers food storage chemistry, canning procedures, packaging engineering, and national FSSAI standards.", entranceExams: ["JEE Main", "ICAR AIEEA", "CFTRI Exam"], topColleges: ["NIFTEM Kundli", "CFTRI Mysore"], skills: ["Food Preservation", "FSSAI Safety Auditing", "Packaging Engineering"], salary: "Fresher: ₹3.5–7 LPA | Quality Assurance Manager: ₹12–25 LPA", careers: ["Food Technologist", "Quality Assurance Officer", "Product Developer"], certifications: ["HACCP Auditing Certification", "FSSAI Auditor Certificate"] },
            { id: "horti", title: "HORTI – Horticulture", icon: "🌱", description: "Ornamental flower cultivation, nursery management, seed grafting, vegetable production, and landscape designs.", entranceExams: ["ICAR AIEEA", "State Agriculture CETs"], topColleges: ["UHF Solan", "TNAU Coimbatore"], skills: ["Plant Grafting", "Nursery Propagation", "Landscape Design (CAD)"], salary: "Fresher: ₹3–6 LPA | Landscape Manager: ₹8–18 LPA", careers: ["Horticulturist", "Floriculturist", "Nursery Manager"], certifications: ["Horticultural Design Specialist Cert"] },
            { id: "ae_agri", title: "AE – Agricultural Engineering", icon: "🚜", description: "Focuses on farm tractors, harvesting machinery, soil water conservation systems, and solar irrigation pumps.", entranceExams: ["JEE Main", "ICAR AIEEA", "State CETs"], topColleges: ["IIT Kharagpur", "PAU Ludhiana"], skills: ["Tractor Systems Design", "Hydraulic Pumps Repair", "Drip System Automation"], salary: "Fresher: ₹3.5–8 LPA | Design Engineer: ₹10–22 LPA", careers: ["Agricultural Engineer", "Farm Machine Tester", "Soil Conservation Officer"], certifications: ["Farm Machinery Testing Cert"] },
            { id: "forest", title: "FOREST – Forestry", icon: "🌳", description: "Covers forest surveying, wildlife habitat preservation, timber logging management, and state forest acts.", entranceExams: ["ICAR AIEEA", "UPSC IFS (later)"], topColleges: ["FRI Dehradun", "Dr. Y.S. Parmar University"], skills: ["Forest Surveying GIS", "Wildlife Monitoring", "Timber Volume Calculation"], salary: "Fresher: ₹3–6 LPA | Range Forest Officer: State exam scales", careers: ["Forest Range Officer", "Silviculturist", "Wildlife Conservator Assistant"], certifications: ["Forestry Management Cert"] },
            { id: "poultry", title: "POULTRY – Poultry Farming", icon: "🐓", description: "Covers broiler production schedules, egg hatchery machinery, poultry disease diagnostics, and feed formulations.", entranceExams: ["Direct Admissions", "State Vocat Exams"], topColleges: ["IVRI Bareilly", "State Agriculture Universities"], skills: ["Feed Ratio Formulations", "Vaccination Protocols", "Hatchery Automation Operations"], salary: "Fresher: ₹2.5–5 LPA | Poultry Farm Manager: ₹6–15 LPA", careers: ["Poultry Farm Manager", "Hatchery Supervisor", "Poultry Feed Representative"], certifications: ["Poultry Production Certificate"] },
            { id: "org_farm", title: "ORG FARM – Organic Farming", icon: "🌿", description: "Covers bio-fertilizer formulations, vermicomposting, organic certification paperwork, and soil biology.", entranceExams: ["Direct Entry", "BSc Agri specialization"], topColleges: ["National Centre of Organic Farming", "NCOF Centres"], skills: ["Vermicomposting", "Bio-pesticide Production", "Organic Auditing Paperwork"], salary: "Fresher: ₹3–6 LPA | Organic Farm Consultant: ₹8–18 LPA", careers: ["Organic Farm Manager", "Certification Inspector", "Agri-Bio Consultant"], certifications: ["Organic Farming Practice Certificate"] }
          ]
        },
        {
          id: "defense_govt",
          title: "Defense & Government",
          icon: "🛡️",
          departments: [
            { id: "nda", title: "NDA – National Defence Academy", icon: "🪖", description: "Trains future commissioned officers for the Indian Army, Indian Navy, and Indian Air Force.", entranceExams: ["NDA Written Exam (UPSC)", "SSB Interview", "Medical Board Test"], topColleges: ["NDA Khadakwasla Pune", "IMA Dehradun", "AFA Hyderabad", "INA Ezhimala"], skills: ["Leadership", "Physical Tactics", "Military Science", "Survival Skills"], salary: "Officer Trainee: ₹56,100/month | Commissioned Rank: ₹80K–₹2.5L/month", careers: ["Lieutenant (Army)", "Sub-Lieutenant (Navy)", "Flying Officer (Air Force)"], certifications: ["NDA Graduation Certificate"] },
            { id: "police", title: "POLICE – Police Services", icon: "🚔", description: "Maintains district law and order, processes public complaints, traffic management, and crime investigations.", entranceExams: ["State Police Sub-Inspector Exams", "Police Constable Recruitment"], topColleges: ["State Police Training Academies"], skills: ["Physical Fitness", "Criminal Law basics", "Public Communication", "Discipline"], salary: "Constable: ₹25K–₹40K/month | Sub-Inspector: ₹35K–₹65K/month", careers: ["Police Constable", "Sub-Inspector", "Traffic Police Officer"], certifications: ["Police Academy Training Pass Certificate"] },
            { id: "rrb", title: "RRB – Railway Jobs", icon: "🚆", description: "Indian Railways jobs covering ticket checkers, technical locomotive helpers, station staff, and junior clerks.", entranceExams: ["RRB NTPC", "RRB Group D Exam", "RRB ALP (Assistant Loco Pilot)"], topColleges: ["Railways Recruitment Board Centres"], skills: ["Aptitude & Reasoning", "Technical Trade Skills", "General Awareness"], salary: "Group D: ₹22K–₹35K/month | NTPC Officer: ₹35K–₹60K/month", careers: ["Station Master", "Ticket Collector", "Loco Pilot Assistant"], certifications: ["Railway Medical & Technical Clearances"] },
            { id: "ssc", title: "SSC – Staff Selection Commission", icon: "🏛️", description: "Government services exam recruiting for assistant officers, tax inspectors, and data entry staff in ministries.", entranceExams: ["SSC CHSL (12th pass)", "SSC CGL (after graduation)", "SSC MTS"], topColleges: ["Staff Selection Commission Commissioned Offices"], skills: ["General English Grammar", "Quantitative Aptitude", "Office Administration Skills"], salary: "CHSL Post: ₹28K–₹45K/month | MTS Post: ₹22K–₹35K/month", careers: ["Lower Division Clerk", "Data Entry Operator", "Postal Assistant"], certifications: ["SSC Written & Skill Test Clearances"] },
            { id: "postal", title: "POSTAL – Postal Services", icon: "📮", description: "Deals with postal letter sorting, dispatch operations, mail delivery, and post office savings schemes.", entranceExams: ["India Post GDS (Gramin Dak Sevak) Merit list", "Postal Dept exams"], topColleges: ["India Post Training Centers"], skills: ["Sorting Speed", "Local Geography Knowledge", "Basic Computer Operations"], salary: "GDS: ₹12K–₹18K/month | Postal Clerk: ₹25K–₹45K/month", careers: ["Postmaster", "Mail Deliverer", "Postal Clerk"], certifications: ["Postal Operations Pass Cert"] },
            { id: "fire", title: "FIRE – Fire & Safety", icon: "🚒", description: "Trains firefighters in building evacuations, hazardous chemical handling, fire hose operations, and safety audits.", entranceExams: ["Fire Department Physical Rally", "State Fire Service Exams"], topColleges: ["National Fire Service College Nagpur"], skills: ["Firefighting Equipment operations", "Rescue Tactics", "First Aid & Trauma Care"], salary: "Fireman: ₹22K–₹42K/month | Safety Inspector: ₹30K–₹55K/month", careers: ["Firefighter", "Industrial Safety Officer", "Station Fire Officer"], certifications: ["Fire & Safety Diploma (NFSC)"] }
          ]
        }
      ]
    },
    MEC: {
      label: "MEC – Maths, Economics, Commerce",
      sectors: [
        {
          id: "commerce",
          title: "Commerce & Business",
          icon: "💼",
          departments: [
            { id: "bcom", title: "B.Com – Bachelor of Commerce", icon: "📊", description: "Core undergraduate program in accounting, taxation, auditing, and corporate finance laws.", entranceExams: ["CUET", "DU Merit Admissions", "State Board Merits"], topColleges: ["SRCC Delhi", "LSR Delhi", "Loyola College Chennai"], skills: ["Financial Accounting", "Corporate Taxation", "Auditing Basics", "Excel modeling"], salary: "Fresher: ₹3–6 LPA | Senior Auditor: ₹12–25 LPA", careers: ["Accountant", "Tax Consultant", "Audit Trainee"], certifications: ["GST Practitioner Certificate", "Tally ERP 9 / Prime Certification"] },
            { id: "bba", title: "BBA – Business Administration", icon: "💼", description: "Management-focused curriculum teaching marketing, HR, logistics, and organizational behavior.", entranceExams: ["IPMAT", "CUET", "NPAT Symbiosis"], topColleges: ["IIM Indore", "Shaheed Sukhdev College Delhi", "NMIMS Mumbai"], skills: ["Strategic Planning", "Project Management", "Business Communication", "Market Research"], salary: "Fresher: ₹3.5–7 LPA | MBA Graduate: ₹15–32 LPA", careers: ["Business Developer", "HR Coordinator", "Marketing Executive"], certifications: ["Google Project Management Cert", "Lean Six Sigma Yellow Belt"] },
            { id: "bfi", title: "BFI – Banking & Finance", icon: "🏦", description: "Deals with capital budgeting, financial instruments, commercial banking practices, and risk management.", entranceExams: ["CUET", "State Entrances"], topColleges: ["NMIMS Mumbai", "Christ University Bangalore"], skills: ["Financial Analysis", "Banking Regulations", "Investment Strategies", "Accounting"], salary: "Fresher: ₹4–8 LPA | Experienced: ₹12–30 LPA", careers: ["Bank Officer", "Financial Advisor", "Credit Manager"], certifications: ["NISM Certifications", "JAIIB / CAIIB (for bank staff)"] },
            { id: "eco", title: "ECO – Economics", icon: "📈", description: "Rigorous analytical course covering microeconomics, macroeconomics, and statistical econometric tools.", entranceExams: ["CUET", "DU Entrance"], topColleges: ["St. Stephen's College Delhi", "Presidency College Kolkata"], skills: ["Econometric Modeling", "Statistical Tools (R/Stata)", "Policy Analysis"], salary: "Fresher: ₹4.5–9 LPA | Senior Analyst: ₹18–35 LPA", careers: ["Economist", "Policy Analyst", "Financial Risk Analyst"], certifications: ["Financial Risk Manager (FRM) Level 1"] },
            { id: "ca", title: "CA – Chartered Accountant", icon: "📉", description: "Prestigious accounting qualification issued by ICAI, covering audits, taxes, and corporate law.", entranceExams: ["CA Foundation Exam (ICAI)"], topColleges: ["ICAI (Institute of Chartered Accountants of India)"], skills: ["Statutory Auditing", "Advanced Direct/Indirect Taxes", "Corporate Finance Advisory"], salary: "Fresher CA: ₹8–14 LPA | Experienced CA: ₹20–60+ LPA", careers: ["Chartered Accountant", "Internal Auditor", "CFO", "Tax Partner"], certifications: ["ICAI Membership License"] },
            { id: "cma", title: "CMA – Cost Management Accounting", icon: "📊", description: "Trains experts in corporate budgeting, cost containment, pricing models, and valuation strategies.", entranceExams: ["CMA Foundation (ICAI-CMA)"], topColleges: ["ICAI-Cost (Institute of Cost Accountants of India)"], skills: ["Cost Auditing", "Corporate Budgeting", "Performance Valuation"], salary: "Fresher: ₹4–8 LPA | Experienced: ₹10–25 LPA", careers: ["Cost Controller", "Budget Analyst", "Financial Manager"], certifications: ["ICMAI Member Certificate"] },
            { id: "cs", title: "CS – Company Secretary", icon: "🏢", description: "Focuses on corporate compliance, secretarial audits, board procedures, and company legislation.", entranceExams: ["CSEET (ICSI)"], topColleges: ["ICSI (Institute of Company Secretaries of India)"], skills: ["Company Law Compliance", "Secretarial Drafting", "Board Meeting Management"], salary: "Fresher: ₹4–7 LPA | Senior Secretary: ₹12–30 LPA", careers: ["Company Secretary", "Compliance Officer", "Legal Compliance Consultant"], certifications: ["ICSI Membership License"] }
          ]
        },
        {
          id: "professional",
          title: "Professional Courses",
          icon: "🏨",
          departments: [
            { id: "hm", title: "HM – Hotel Management", icon: "🏨", description: "Covers luxury front desk operations, F&B operations, restaurant catering, and guest hosting rules.", entranceExams: ["NCHMCT JEE", "AIHMCT Written Exam"], topColleges: ["IHM Pusa New Delhi", "IHM Mumbai", "WGSHA Manipal"], skills: ["PMS Software", "Professional Grooming", "Hospitality Management", "Guest Relations"], salary: "Fresher: ₹3–6 LPA | General Hotel Manager: ₹15–35 LPA", careers: ["Front Office Trainee", "F&B Supervisor", "Restaurant Manager"], certifications: ["Hotel Management Professional Certificate"] },
            { id: "av", title: "AV – Aviation", icon: "✈️", description: "Airport passenger ticketing terminal operations, cabin safety, terminal gate security, and aviation etiquette.", entranceExams: ["Aviation Academy tests", "Physical/Grooming Interviews"], topColleges: ["Frankfinn Academy", "NIMS University Jaipur"], skills: ["Passenger Relations", "SABRE/Amadeus Ticketing", "Emergency Evacuation", "Soft Skills"], salary: "Fresher: ₹3–7 LPA | Cabin Crew Lead: ₹10–22 LPA", careers: ["Airport Ground Staff", "Cabin Crew / Flight Attendant", "Air Ticket Agent"], certifications: ["IATA Airport Operations Certification"] },
            { id: "fd", title: "FD – Fashion Designing", icon: "👗", description: "Studies sketching visual styles, source materials, textile weaving, cardboard pattern cutting, and tailors supervision.", entranceExams: ["NIFT Entrance", "NID DAT", "UCEED"], topColleges: ["NIFT New Delhi", "Pearl Academy Mumbai", "NID Ahmedabad"], skills: ["Garment Construction", "Fashion Sketching", "Pattern Drafting", "Fabric Sourcing"], salary: "Fresher: ₹3–7 LPA | Lead Designer: ₹12–30 LPA", careers: ["Fashion Designer", "Costume Stylist", "Visual Merchandiser"], certifications: ["Fashion Design Advanced Diploma"] },
            { id: "fm", title: "FM – Film Making", icon: "🎬", description: "Covers screenplay writing, cinematography lighting setups, digital film edits, sound design, and directing.", entranceExams: ["FTII Entrance", "SRFTI Written Test"], topColleges: ["FTII Pune", "SRFTI Kolkata", "Whistling Woods International Mumbai"], skills: ["Film Editing (Premiere/FCP)", "Cinematography Camera setups", "Direction & Scriptwriting"], salary: "Fresher: ₹3–8 LPA | Project Director: Performance/Contract based", careers: ["Video Editor", "Assistant Director", "Cinematographer"], certifications: ["DaVinci Resolve / Avid Suite Cert"] },
            { id: "em", title: "EM – Event Management", icon: "🎉", description: "Deals with corporate launch planning, venue stage booking, contractor vendor coordination, and budget management.", entranceExams: ["Direct Admissions", "Institute Entrance Tests"], topColleges: ["National Academy of Event Management", "EMDI Mumbai"], skills: ["Vendor Negotiations", "Venue Layout Planning", "PR Coordination", "Budget Planning"], salary: "Fresher: ₹2.8–6 LPA | Event Director: ₹10–25 LPA", careers: ["Event Planner", "Public Relations Officer", "Venue Operations Head"], certifications: ["Event Operations Cert"] },
            { id: "tm", title: "TM – Tourism Management", icon: "🌍", description: "Itinerary flight booking, tour guide coordinates, ticketing reservations, and resort reservation systems.", entranceExams: ["NCHMCT JEE", "IITTM Admissions"], topColleges: ["IITTM Gwalior", "Christ University"], skills: ["Itinerary Planning", "Foreign Exchange Basics", "Customer Travel Advisory"], salary: "Fresher: ₹2.5–5 LPA | Tour Operations Head: ₹8–18 LPA", careers: ["Travel consultant", "Tour Manager", "Ticketing Coordinator"], certifications: ["IATA Travel & Tourism Cert"] },
            { id: "ca_prof", title: "CA – Culinary Arts", icon: "🍳", description: "Deals with commercial kitchen procedures, food preparation, bakery sciences, and culinary management.", entranceExams: ["NCHMCT JEE", "Culinary Institute tests"], topColleges: ["Culinary Academy of India Hyderabad", "IHM Pusa"], skills: ["Commercial Cooking", "Kitchen Safety", "Food Preparation & Presentation", "Menu Costing"], salary: "Fresher: ₹3–7 LPA | Head Executive Chef: ₹15–45 LPA", careers: ["Commis Chef", "Pastry Chef", "Sous Chef", "Executive Chef"], certifications: ["Professional Chef Certification"] },
            { id: "mm", title: "MM – Media Management", icon: "🎤", description: "Covers advertising schedules, social media brand strategies, broadcasting media planning, and copy updates.", entranceExams: ["CUET", "University Merit Exams"], topColleges: ["Symbiosis Pune", "Xavier Institute Mumbai"], skills: ["Ad Campaign Planning", "Audience Analytics", "Media Buying & Planning"], salary: "Fresher: ₹3.5–7 LPA | Media Planner: ₹12–28 LPA", careers: ["Media Planner", "Ad Operations Executive", "Social Media Strategist"], certifications: ["Google Digital Marketing Certificate"] },
            { id: "beauty", title: "BEAUTY – Beauty & Cosmetology", icon: "💄", description: "Covers cosmetic chemistry, skincare regimens, hair design styling, bridal makeovers, and boutique management.", entranceExams: ["Direct Admissions", "Academy tests"], topColleges: ["VLCC Institute", "Lakme Academy"], skills: ["Bridal Makeovers", "Skincare Diagnostics", "Hair Color & Styling"], salary: "Fresher: ₹2–4.5 LPA | Professional Stylist: ₹6–15 LPA (Independent based)", careers: ["Beautician", "Make-up Artist", "Cosmetologist", "Spa Manager"], certifications: ["CIDESCO Cosmetology Diploma"] }
          ]
        },
        {
          id: "defense_govt",
          title: "Defense & Government",
          icon: "🛡️",
          departments: [
            { id: "nda", title: "NDA – National Defence Academy", icon: "🪖", description: "Trains future commissioned officers for the Indian Army, Indian Navy, and Indian Air Force.", entranceExams: ["NDA Written Exam (UPSC)", "SSB Interview", "Medical Board Test"], topColleges: ["NDA Khadakwasla Pune", "IMA Dehradun", "AFA Hyderabad", "INA Ezhimala"], skills: ["Leadership", "Physical Tactics", "Military Science", "Survival Skills"], salary: "Officer Trainee: ₹56,100/month | Commissioned Rank: ₹80K–₹2.5L/month", careers: ["Lieutenant (Army)", "Sub-Lieutenant (Navy)", "Flying Officer (Air Force)"], certifications: ["NDA Graduation Certificate"] },
            { id: "police", title: "POLICE – Police Services", icon: "🚔", description: "Maintains district law and order, processes public complaints, traffic management, and crime investigations.", entranceExams: ["State Police Sub-Inspector Exams", "Police Constable Recruitment"], topColleges: ["State Police Training Academies"], skills: ["Physical Fitness", "Criminal Law basics", "Public Communication", "Discipline"], salary: "Constable: ₹25K–₹40K/month | Sub-Inspector: ₹35K–₹65K/month", careers: ["Police Constable", "Sub-Inspector", "Traffic Police Officer"], certifications: ["Police Academy Training Pass Certificate"] },
            { id: "rrb", title: "RRB – Railway Jobs", icon: "🚆", description: "Indian Railways jobs covering ticket checkers, technical locomotive helpers, station staff, and junior clerks.", entranceExams: ["RRB NTPC", "RRB Group D Exam", "RRB ALP (Assistant Loco Pilot)"], topColleges: ["Railways Recruitment Board Centres"], skills: ["Aptitude & Reasoning", "Technical Trade Skills", "General Awareness"], salary: "Group D: ₹22K–₹35K/month | NTPC Officer: ₹35K–₹60K/month", careers: ["Station Master", "Ticket Collector", "Loco Pilot Assistant"], certifications: ["Railway Medical & Technical Clearances"] },
            { id: "ssc", title: "SSC – Staff Selection Commission", icon: "🏛️", description: "Government services exam recruiting for assistant officers, tax inspectors, and data entry staff in ministries.", entranceExams: ["SSC CHSL (12th pass)", "SSC CGL (after graduation)", "SSC MTS"], topColleges: ["Staff Selection Commission Commissioned Offices"], skills: ["General English Grammar", "Quantitative Aptitude", "Office Administration Skills"], salary: "CHSL Post: ₹28K–₹45K/month | MTS Post: ₹22K–₹35K/month", careers: ["Lower Division Clerk", "Data Entry Operator", "Postal Assistant"], certifications: ["SSC Written & Skill Test Clearances"] },
            { id: "postal", title: "POSTAL – Postal Services", icon: "📮", description: "Deals with postal letter sorting, dispatch operations, mail delivery, and post office savings schemes.", entranceExams: ["India Post GDS (Gramin Dak Sevak) Merit list", "Postal Dept exams"], topColleges: ["India Post Training Centers"], skills: ["Sorting Speed", "Local Geography Knowledge", "Basic Computer Operations"], salary: "GDS: ₹12K–₹18K/month | Postal Clerk: ₹25K–₹45K/month", careers: ["Postmaster", "Mail Deliverer", "Postal Clerk"], certifications: ["Postal Operations Pass Cert"] },
            { id: "fire", title: "FIRE – Fire & Safety", icon: "🚒", description: "Trains firefighters in building evacuations, hazardous chemical handling, fire hose operations, and safety audits.", entranceExams: ["Fire Department Physical Rally", "State Fire Service Exams"], topColleges: ["National Fire Service College Nagpur"], skills: ["Firefighting Equipment operations", "Rescue Tactics", "First Aid & Trauma Care"], salary: "Fireman: ₹22K–₹42K/month | Safety Inspector: ₹30K–₹55K/month", careers: ["Firefighter", "Industrial Safety Officer", "Station Fire Officer"], certifications: ["Fire & Safety Diploma (NFSC)"] }
          ]
        }
      ]
    },
    CEC: {
      label: "CEC – Commerce, Economics, Civics",
      sectors: [
        {
          id: "law",
          title: "Law & Legal Services",
          icon: "⚖️",
          departments: [
            { id: "llb", title: "LLB – Bachelor of Law", icon: "⚖️", description: "Integrated 5-year law degree (BA LLB / B.Com LLB) covering civil, commercial, and criminal codes.", entranceExams: ["CLAT", "AILET", "LSAT India", "MH CET Law"], topColleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NUJS Kolkata"], skills: ["Legal Advocacy", "Drafting & Pleading", "Case Research", "Analytical Reasoning"], salary: "Fresher: ₹4–12 LPA | Corporate/Senior Law: ₹18–50+ LPA", careers: ["Advocate", "Legal Executive", "Judicial Clerk"], certifications: ["State Bar Council License (Bar Exam)"] },
            { id: "cl", title: "CL – Corporate Law", icon: "🏛️", description: "Specialization in commercial transactions, mergers/acquisitions, securities, and anti-trust laws.", entranceExams: ["CLAT PG", "NLU Entrances"], topColleges: ["NLSIU Bangalore", "WBNUJS Kolkata", "GNLU Gandhinagar"], skills: ["Contract Drafting", "Merger Compliance", "Securities Law Analysis"], salary: "Fresher: ₹6–15 LPA | Corporate Law Partner: ₹25–80+ LPA", careers: ["Corporate Lawyer", "Legal Analyst", "M&A Compliance Officer"], certifications: ["Corporate Practice Diploma"] },
            { id: "il", title: "IL – International Law", icon: "🌐", description: "Studies treaties, human rights conventions, maritime boundaries, and international dispute arbitrations.", entranceExams: ["CLAT", "University Entrances"], topColleges: ["NLU Delhi", "South Asian University New Delhi"], skills: ["International Treaty Research", "Arbitration Procedures", "Diplomatic Writing"], salary: "Fresher: ₹4.5–10 LPA | Experienced: ₹15–30 LPA", careers: ["International Arbitrator", "Legal Officer (UN/NGO)", "Diplomatic Consultant"], certifications: ["International Law Certification"] },
            { id: "civil_law", title: "CIVIL – Civil Law", icon: "👨‍⚖️", description: "Covers disputes between individuals/organizations regarding contracts, property ownership, and family affairs.", entranceExams: ["State Law CETs", "CLAT"], topColleges: ["ILS Law College Pune", "Government Law College Mumbai"], skills: ["Drafting Sale Deeds", "Civil Code analysis", "Mediation & Negotiation"], salary: "Fresher: ₹3–8 LPA | Senior Advocate: ₹15–40 LPA", careers: ["Civil Litigator", "Real Estate Legal Advisor", "Arbitrator"], certifications: ["Bar Council Membership"] },
            { id: "const_law", title: "CONST – Constitutional Law", icon: "📜", description: "Focuses on the interpretation of fundamental rights, judicial reviews, state-union relations, and constitutional amendments.", entranceExams: ["CLAT PG", "NLU Entrances"], topColleges: ["NALSAR Hyderabad", "BHU Law Faculty Varanasi"], skills: ["Constitutional Interpretation", "Public Interest Litigation Drafting", "Jurisprudence"], salary: "Fresher: ₹4–9 LPA | Senior Advocate: Private Practice dependent", careers: ["Constitutional Lawyer", "Legal Consultant", "Public Policy Researcher"], certifications: ["Constitutional Law Diploma"] },
            { id: "cyber_law", title: "CYBER LAW – Cyber Law", icon: "🧑‍💼", description: "Deals with cybersecurity frameworks, data privacy regulations, cybercrimes, and the IT Act.", entranceExams: ["CLAT", "NLU PG Diplomas"], topColleges: ["NALSAR Hyderabad", "National Law University Jodhpur"], skills: ["Digital Forensic Evidence Laws", "Data Compliance Audits", "Privacy Policy Design"], salary: "Fresher: ₹5–12 LPA | Corporate Compliance Officer: ₹18–45 LPA", careers: ["Cyber Law Consultant", "Privacy Officer", "Digital Forensic Advisor"], certifications: ["Certified Information Privacy Professional (CIPP)"] },
            { id: "env_law", title: "ENV LAW – Environmental Law", icon: "🌱", description: "Deals with wildlife protection acts, industrial pollution limits, forest conservation, and environmental clearances.", entranceExams: ["CLAT", "University Entrances"], topColleges: ["NLU Delhi", "Symbiosis Law School Pune"], skills: ["Clearance Audits", "Pollution Control Legislation Analysis", "Litigation"], salary: "Fresher: ₹3.5–8 LPA | Consultant: ₹10–22 LPA", careers: ["Environmental Lawyer", "Sustainability Auditor", "NGO Policy Manager"], certifications: ["Environmental Law Diploma"] },
            { id: "family_law", title: "FAMILY LAW – Family Law", icon: "👨‍👩‍👧", description: "Covers domestic relationships, marriage acts, divorce proceedings, adoptions, wills, and estate distributions.", entranceExams: ["State Law CETs", "Merit admissions"], topColleges: ["Faculty of Law Delhi University", "Aligarh Muslim University"], skills: ["Mediation & Reconciliation", "Drafting Family Settles", "Client Counseling"], salary: "Fresher: ₹3–7 LPA | Partner: Private practice based", careers: ["Family Court Advocate", "Divorce Mediator", "Estate Advisor"], certifications: ["Bar Council Registration"] },
            { id: "criminal_law", title: "CRIMINAL LAW – Criminal Law", icon: "🚔", description: "Studies the penal codes, police investigation procedures, evidence acts, and trial litigations.", entranceExams: ["CLAT", "State Law CETs"], topColleges: ["NLU Jodhpur", "GLC Mumbai", "Symbiosis Pune"], skills: ["Cross-examination", "Bail Application Drafting", "Defense/Prosecution Strategy"], salary: "Fresher: ₹3.5–8 LPA | Senior Criminal Lawyer: Highly lucrative", careers: ["Criminal Litigator", "Public Prosecutor", "Legal Advisory Partner"], certifications: ["State Bar Council License"] }
          ]
        },
        {
          id: "commerce",
          title: "Commerce & Business",
          icon: "💼",
          departments: [
            { id: "bcom", title: "B.Com – Bachelor of Commerce", icon: "📊", description: "Core undergraduate program in accounting, taxation, auditing, and corporate finance laws.", entranceExams: ["CUET", "DU Merit Admissions", "State Board Merits"], topColleges: ["SRCC Delhi", "LSR Delhi", "Loyola College Chennai"], skills: ["Financial Accounting", "Corporate Taxation", "Auditing Basics", "Excel modeling"], salary: "Fresher: ₹3–6 LPA | Senior Auditor: ₹12–25 LPA", careers: ["Accountant", "Tax Consultant", "Audit Trainee"], certifications: ["GST Practitioner Certificate", "Tally ERP 9 / Prime Certification"] },
            { id: "bba", title: "BBA – Business Administration", icon: "💼", description: "Management-focused curriculum teaching marketing, HR, logistics, and organizational behavior.", entranceExams: ["IPMAT", "CUET", "NPAT Symbiosis"], topColleges: ["IIM Indore", "Shaheed Sukhdev College Delhi", "NMIMS Mumbai"], skills: ["Strategic Planning", "Project Management", "Business Communication", "Market Research"], salary: "Fresher: ₹3.5–7 LPA | MBA Graduate: ₹15–32 LPA", careers: ["Business Developer", "HR Coordinator", "Marketing Executive"], certifications: ["Google Project Management Cert", "Lean Six Sigma Yellow Belt"] },
            { id: "bfi", title: "BFI – Banking & Finance", icon: "🏦", description: "Deals with capital budgeting, financial instruments, commercial banking practices, and risk management.", entranceExams: ["CUET", "State Entrances"], topColleges: ["NMIMS Mumbai", "Christ University Bangalore"], skills: ["Financial Analysis", "Banking Regulations", "Investment Strategies", "Accounting"], salary: "Fresher: ₹4–8 LPA | Experienced: ₹12–30 LPA", careers: ["Bank Officer", "Financial Advisor", "Credit Manager"], certifications: ["NISM Certifications", "JAIIB / CAIIB (for bank staff)"] },
            { id: "eco", title: "ECO – Economics", icon: "📈", description: "Rigorous analytical course covering microeconomics, macroeconomics, and statistical econometric tools.", entranceExams: ["CUET", "DU Entrance"], topColleges: ["St. Stephen's College Delhi", "Presidency College Kolkata"], skills: ["Econometric Modeling", "Statistical Tools (R/Stata)", "Policy Analysis"], salary: "Fresher: ₹4.5–9 LPA | Senior Analyst: ₹18–35 LPA", careers: ["Economist", "Policy Analyst", "Financial Risk Analyst"], certifications: ["Financial Risk Manager (FRM) Level 1"] },
            { id: "ca", title: "CA – Chartered Accountant", icon: "📉", description: "Prestigious accounting qualification issued by ICAI, covering audits, taxes, and corporate law.", entranceExams: ["CA Foundation Exam (ICAI)"], topColleges: ["ICAI (Institute of Chartered Accountants of India)"], skills: ["Statutory Auditing", "Advanced Direct/Indirect Taxes", "Corporate Finance Advisory"], salary: "Fresher CA: ₹8–14 LPA | Experienced CA: ₹20–60+ LPA", careers: ["Chartered Accountant", "Internal Auditor", "CFO", "Tax Partner"], certifications: ["ICAI Membership License"] },
            { id: "cma", title: "CMA – Cost Management Accounting", icon: "📊", description: "Trains experts in corporate budgeting, cost containment, pricing models, and valuation strategies.", entranceExams: ["CMA Foundation (ICAI-CMA)"], topColleges: ["ICAI-Cost (Institute of Cost Accountants of India)"], skills: ["Cost Auditing", "Corporate Budgeting", "Performance Valuation"], salary: "Fresher: ₹4–8 LPA | Experienced: ₹10–25 LPA", careers: ["Cost Controller", "Budget Analyst", "Financial Manager"], certifications: ["ICMAI Member Certificate"] },
            { id: "cs", title: "CS – Company Secretary", icon: "🏢", description: "Focuses on corporate compliance, secretarial audits, board procedures, and company legislation.", entranceExams: ["CSEET (ICSI)"], topColleges: ["ICSI (Institute of Company Secretaries of India)"], skills: ["Company Law Compliance", "Secretarial Drafting", "Board Meeting Management"], salary: "Fresher: ₹4–7 LPA | Senior Secretary: ₹12–30 LPA", careers: ["Company Secretary", "Compliance Officer", "Legal Compliance Consultant"], certifications: ["ICSI Membership License"] }
          ]
        },
        {
          id: "defense_govt",
          title: "Defense & Government",
          icon: "🛡️",
          departments: [
            { id: "nda", title: "NDA – National Defence Academy", icon: "🪖", description: "Trains future commissioned officers for the Indian Army, Indian Navy, and Indian Air Force.", entranceExams: ["NDA Written Exam (UPSC)", "SSB Interview", "Medical Board Test"], topColleges: ["NDA Khadakwasla Pune", "IMA Dehradun", "AFA Hyderabad", "INA Ezhimala"], skills: ["Leadership", "Physical Tactics", "Military Science", "Survival Skills"], salary: "Officer Trainee: ₹56,100/month | Commissioned Rank: ₹80K–₹2.5L/month", careers: ["Lieutenant (Army)", "Sub-Lieutenant (Navy)", "Flying Officer (Air Force)"], certifications: ["NDA Graduation Certificate"] },
            { id: "police", title: "POLICE – Police Services", icon: "🚔", description: "Maintains district law and order, processes public complaints, traffic management, and crime investigations.", entranceExams: ["State Police Sub-Inspector Exams", "Police Constable Recruitment"], topColleges: ["State Police Training Academies"], skills: ["Physical Fitness", "Criminal Law basics", "Public Communication", "Discipline"], salary: "Constable: ₹25K–₹40K/month | Sub-Inspector: ₹35K–₹65K/month", careers: ["Police Constable", "Sub-Inspector", "Traffic Police Officer"], certifications: ["Police Academy Training Pass Certificate"] },
            { id: "rrb", title: "RRB – Railway Jobs", icon: "🚆", description: "Indian Railways jobs covering ticket checkers, technical locomotive helpers, station staff, and junior clerks.", entranceExams: ["RRB NTPC", "RRB Group D Exam", "RRB ALP (Assistant Loco Pilot)"], topColleges: ["Railways Recruitment Board Centres"], skills: ["Aptitude & Reasoning", "Technical Trade Skills", "General Awareness"], salary: "Group D: ₹22K–₹35K/month | NTPC Officer: ₹35K–₹60K/month", careers: ["Station Master", "Ticket Collector", "Loco Pilot Assistant"], certifications: ["Railway Medical & Technical Clearances"] },
            { id: "ssc", title: "SSC – Staff Selection Commission", icon: "🏛️", description: "Government services exam recruiting for assistant officers, tax inspectors, and data entry staff in ministries.", entranceExams: ["SSC CHSL (12th pass)", "SSC CGL (after graduation)", "SSC MTS"], topColleges: ["Staff Selection Commission Commissioned Offices"], skills: ["General English Grammar", "Quantitative Aptitude", "Office Administration Skills"], salary: "CHSL Post: ₹28K–₹45K/month | MTS Post: ₹22K–₹35K/month", careers: ["Lower Division Clerk", "Data Entry Operator", "Postal Assistant"], certifications: ["SSC Written & Skill Test Clearances"] },
            { id: "postal", title: "POSTAL – Postal Services", icon: "📮", description: "Deals with postal letter sorting, dispatch operations, mail delivery, and post office savings schemes.", entranceExams: ["India Post GDS (Gramin Dak Sevak) Merit list", "Postal Dept exams"], topColleges: ["India Post Training Centers"], skills: ["Sorting Speed", "Local Geography Knowledge", "Basic Computer Operations"], salary: "GDS: ₹12K–₹18K/month | Postal Clerk: ₹25K–₹45K/month", careers: ["Postmaster", "Mail Deliverer", "Postal Clerk"], certifications: ["Postal Operations Pass Cert"] },
            { id: "fire", title: "FIRE – Fire & Safety", icon: "🚒", description: "Trains firefighters in building evacuations, hazardous chemical handling, fire hose operations, and safety audits.", entranceExams: ["Fire Department Physical Rally", "State Fire Service Exams"], topColleges: ["National Fire Service College Nagpur"], skills: ["Firefighting Equipment operations", "Rescue Tactics", "First Aid & Trauma Care"], salary: "Fireman: ₹22K–₹42K/month | Safety Inspector: ₹30K–₹55K/month", careers: ["Firefighter", "Industrial Safety Officer", "Station Fire Officer"], certifications: ["Fire & Safety Diploma (NFSC)"] }
          ]
        }
      ]
    },
    Arts: {
      label: "Arts / Humanities",
      sectors: [
        {
          id: "arts",
          title: "Arts & Humanities",
          icon: "🎨",
          departments: [
            { id: "jmc", title: "JMC – Journalism & Mass Communication", icon: "📰", description: "Covers print news, TV broadcasting, digital reporting, scriptwriting, and media analytics.", entranceExams: ["IIMC Entrance", "CUET", "MASCOM Exam"], topColleges: ["IIMC New Delhi", "Symbiosis Institute of Media Pune", "XIC Mumbai"], skills: ["Feature Writing", "Video Reporting", "Camera confidence", "News Editing"], salary: "Fresher: ₹3–6 LPA | Senior Editor: ₹10–25 LPA", careers: ["News Reporter", "Sub-Editor", "Public Relations Executive"], certifications: ["Media Editing Suite Cert"] },
            { id: "psy", title: "PSY – Psychology", icon: "🧠", description: "Studies human behavior, clinical psychological theories, diagnosis protocols, and cognitive therapy.", entranceExams: ["CUET", "University Merit Exams"], topColleges: ["Lady Shri Ram College Delhi", "Christ University Bangalore"], skills: ["Clinical Diagnosis", "Counseling & Therapy", "Active Listening", "Research Methods"], salary: "Fresher: ₹3–5.5 LPA | Clinical Psychologist: ₹8–20 LPA", careers: ["Counselor", "Clinical Psychologist", "HR Specialist"], certifications: ["Rehabilitation Council of India (RCI) Cert"] },
            { id: "geo", title: "GEO – Geography", icon: "🌍", description: "Studies physical geography, climatology, GIS mapping, remote sensing, and land topography.", entranceExams: ["CUET"], topColleges: ["Delhi School of Economics", "Banaras Hindu University"], skills: ["GIS Mapping", "Spatial Data Analysis", "Remote Sensing Tools", "Cartography"], salary: "Fresher: ₹3.5–7 LPA | GIS Consultant: ₹10–22 LPA", careers: ["GIS Analyst", "Cartographer", "Urban Planner"], certifications: ["ArcGIS Software Certification"] },
            { id: "pol", title: "POL – Political Science", icon: "🏛️", description: "Covers political ideologies, international geopolitics, government institutions, and policy studies.", entranceExams: ["CUET"], topColleges: ["JNU New Delhi", "Presidency University Kolkata"], skills: ["Policy Analysis", "Qualitative Research", "Political Analysis Writing"], salary: "Fresher: ₹3–6 LPA | Policy Advisor: ₹12–28 LPA", careers: ["Political Analyst", "Policy Analyst", "Political Campaign Planner"], certifications: ["Public Policy Diploma"] },
            { id: "his", title: "HIS – History", icon: "📖", description: "Curates archaeological evidence, historical texts, conservation techniques, and archival preservation.", entranceExams: ["CUET"], topColleges: ["St. Stephen's College", "Presidency University"], skills: ["Archival Research", "Historical Writing", "Monument Conservation Basics"], salary: "Fresher: ₹2.5–5 LPA | Archival Manager: ₹8–18 LPA", careers: ["Historian", "Archivist", "Museum Curator", "Archaeologist assistant"], certifications: ["Heritage Conservation Diploma"] },
            { id: "soc", title: "SOC – Sociology", icon: "👥", description: "Studies family structures, social inequality, rural communities, and socio-economic policies.", entranceExams: ["CUET"], topColleges: ["Delhi School of Economics", "TISS Mumbai"], skills: ["Social Fieldwork", "Survey Analysis", "Community Relations Design"], salary: "Fresher: ₹3–6 LPA | Social Manager: ₹10–22 LPA", careers: ["Sociologist", "Social Research Consultant", "CSR Specialist"], certifications: ["Social Work Practice Cert"] },
            { id: "pa", title: "PA – Performing Arts", icon: "🎭", description: "Professional training in classical/modern dance, music composition, theatrical acting, and production.", entranceExams: ["University Auditions", "CUET"], topColleges: ["NSD New Delhi", "FTII Pune", "Kalakshetra Foundation Chennai"], skills: ["Vocal/Instrumental Training", "Theatrical Projection", "Choreography Design"], salary: "Fresher: ₹2.5–6 LPA | Lead performer: Performance dependent", careers: ["Actor", "Dancer", "Music Director", "Theatre Director"], certifications: ["Sangeet Natak Akademi Cert"] }
          ]
        },
        {
          id: "professional",
          title: "Professional Courses",
          icon: "🏨",
          departments: [
            { id: "hm", title: "HM – Hotel Management", icon: "🏨", description: "Covers luxury front desk operations, F&B operations, restaurant catering, and guest hosting rules.", entranceExams: ["NCHMCT JEE", "AIHMCT Written Exam"], topColleges: ["IHM Pusa New Delhi", "IHM Mumbai", "WGSHA Manipal"], skills: ["PMS Software", "Professional Grooming", "Hospitality Management", "Guest Relations"], salary: "Fresher: ₹3–6 LPA | General Hotel Manager: ₹15–35 LPA", careers: ["Front Office Trainee", "F&B Supervisor", "Restaurant Manager"], certifications: ["Hotel Management Professional Certificate"] },
            { id: "av", title: "AV – Aviation", icon: "✈️", description: "Airport passenger ticketing terminal operations, cabin safety, terminal gate security, and aviation etiquette.", entranceExams: ["Aviation Academy tests", "Physical/Grooming Interviews"], topColleges: ["Frankfinn Academy", "NIMS University Jaipur"], skills: ["Passenger Relations", "SABRE/Amadeus Ticketing", "Emergency Evacuation", "Soft Skills"], salary: "Fresher: ₹3–7 LPA | Cabin Crew Lead: ₹10–22 LPA", careers: ["Airport Ground Staff", "Cabin Crew / Flight Attendant", "Air Ticket Agent"], certifications: ["IATA Airport Operations Certification"] },
            { id: "fd", title: "FD – Fashion Designing", icon: "👗", description: "Studies sketching visual styles, source materials, textile weaving, cardboard pattern cutting, and tailors supervision.", entranceExams: ["NIFT Entrance", "NID DAT", "UCEED"], topColleges: ["NIFT New Delhi", "Pearl Academy Mumbai", "NID Ahmedabad"], skills: ["Garment Construction", "Fashion Sketching", "Pattern Drafting", "Fabric Sourcing"], salary: "Fresher: ₹3–7 LPA | Lead Designer: ₹12–30 LPA", careers: ["Fashion Designer", "Costume Stylist", "Visual Merchandiser"], certifications: ["Fashion Design Advanced Diploma"] },
            { id: "fm", title: "FM – Film Making", icon: "🎬", description: "Covers screenplay writing, cinematography lighting setups, digital film edits, sound design, and directing.", entranceExams: ["FTII Entrance", "SRFTI Written Test"], topColleges: ["FTII Pune", "SRFTI Kolkata", "Whistling Woods International Mumbai"], skills: ["Film Editing (Premiere/FCP)", "Cinematography Camera setups", "Direction & Scriptwriting"], salary: "Fresher: ₹3–8 LPA | Project Director: Performance/Contract based", careers: ["Video Editor", "Assistant Director", "Cinematographer"], certifications: ["DaVinci Resolve / Avid Suite Cert"] },
            { id: "em", title: "EM – Event Management", icon: "🎉", description: "Deals with corporate launch planning, venue stage booking, contractor vendor coordination, and budget management.", entranceExams: ["Direct Admissions", "Institute Entrance Tests"], topColleges: ["National Academy of Event Management", "EMDI Mumbai"], skills: ["Vendor Negotiations", "Venue Layout Planning", "PR Coordination", "Budget Planning"], salary: "Fresher: ₹2.8–6 LPA | Event Director: ₹10–25 LPA", careers: ["Event Planner", "Public Relations Officer", "Venue Operations Head"], certifications: ["Event Operations Cert"] },
            { id: "tm", title: "TM – Tourism Management", icon: "🌍", description: "Itinerary flight booking, tour guide coordinates, ticketing reservations, and resort reservation systems.", entranceExams: ["NCHMCT JEE", "IITTM Admissions"], topColleges: ["IITTM Gwalior", "Christ University"], skills: ["Itinerary Planning", "Foreign Exchange Basics", "Customer Travel Advisory"], salary: "Fresher: ₹2.5–5 LPA | Tour Operations Head: ₹8–18 LPA", careers: ["Travel consultant", "Tour Manager", "Ticketing Coordinator"], certifications: ["IATA Travel & Tourism Cert"] },
            { id: "ca_prof", title: "CA – Culinary Arts", icon: "🍳", description: "Deals with commercial kitchen procedures, food preparation, bakery sciences, and culinary management.", entranceExams: ["NCHMCT JEE", "Culinary Institute tests"], topColleges: ["Culinary Academy of India Hyderabad", "IHM Pusa"], skills: ["Commercial Cooking", "Kitchen Safety", "Food Preparation & Presentation", "Menu Costing"], salary: "Fresher: ₹3–7 LPA | Head Executive Chef: ₹15–45 LPA", careers: ["Commis Chef", "Pastry Chef", "Sous Chef", "Executive Chef"], certifications: ["Professional Chef Certification"] },
            { id: "mm", title: "MM – Media Management", icon: "🎤", description: "Covers advertising schedules, social media brand strategies, broadcasting media planning, and copy updates.", entranceExams: ["CUET", "University Merit Exams"], topColleges: ["Symbiosis Pune", "Xavier Institute Mumbai"], skills: ["Ad Campaign Planning", "Audience Analytics", "Media Buying & Planning"], salary: "Fresher: ₹3.5–7 LPA | Media Planner: ₹12–28 LPA", careers: ["Media Planner", "Ad Operations Executive", "Social Media Strategist"], certifications: ["Google Digital Marketing Certificate"] },
            { id: "beauty", title: "BEAUTY – Beauty & Cosmetology", icon: "💄", description: "Covers cosmetic chemistry, skincare regimens, hair design styling, bridal makeovers, and boutique management.", entranceExams: ["Direct Admissions", "Academy tests"], topColleges: ["VLCC Institute", "Lakme Academy"], skills: ["Bridal Makeovers", "Skincare Diagnostics", "Hair Color & Styling"], salary: "Fresher: ₹2–4.5 LPA | Professional Stylist: ₹6–15 LPA (Independent based)", careers: ["Beautician", "Make-up Artist", "Cosmetologist", "Spa Manager"], certifications: ["CIDESCO Cosmetology Diploma"] }
          ]
        },
        {
          id: "defense_govt",
          title: "Defense & Government",
          icon: "🛡️",
          departments: [
            { id: "nda", title: "NDA – National Defence Academy", icon: "🪖", description: "Trains future commissioned officers for the Indian Army, Indian Navy, and Indian Air Force.", entranceExams: ["NDA Written Exam (UPSC)", "SSB Interview", "Medical Board Test"], topColleges: ["NDA Khadakwasla Pune", "IMA Dehradun", "AFA Hyderabad", "INA Ezhimala"], skills: ["Leadership", "Physical Tactics", "Military Science", "Survival Skills"], salary: "Officer Trainee: ₹56,100/month | Commissioned Rank: ₹80K–₹2.5L/month", careers: ["Lieutenant (Army)", "Sub-Lieutenant (Navy)", "Flying Officer (Air Force)"], certifications: ["NDA Graduation Certificate"] },
            { id: "police", title: "POLICE – Police Services", icon: "🚔", description: "Maintains district law and order, processes public complaints, traffic management, and crime investigations.", entranceExams: ["State Police Sub-Inspector Exams", "Police Constable Recruitment"], topColleges: ["State Police Training Academies"], skills: ["Physical Fitness", "Criminal Law basics", "Public Communication", "Discipline"], salary: "Constable: ₹25K–₹40K/month | Sub-Inspector: ₹35K–₹65K/month", careers: ["Police Constable", "Sub-Inspector", "Traffic Police Officer"], certifications: ["Police Academy Training Pass Certificate"] },
            { id: "rrb", title: "RRB – Railway Jobs", icon: "🚆", description: "Indian Railways jobs covering ticket checkers, technical locomotive helpers, station staff, and junior clerks.", entranceExams: ["RRB NTPC", "RRB Group D Exam", "RRB ALP (Assistant Loco Pilot)"], topColleges: ["Railways Recruitment Board Centres"], skills: ["Aptitude & Reasoning", "Technical Trade Skills", "General Awareness"], salary: "Group D: ₹22K–₹35K/month | NTPC Officer: ₹35K–₹60K/month", careers: ["Station Master", "Ticket Collector", "Loco Pilot Assistant"], certifications: ["Railway Medical & Technical Clearances"] },
            { id: "ssc", title: "SSC – Staff Selection Commission", icon: "🏛️", description: "Government services exam recruiting for assistant officers, tax inspectors, and data entry staff in ministries.", entranceExams: ["SSC CHSL (12th pass)", "SSC CGL (after graduation)", "SSC MTS"], topColleges: ["Staff Selection Commission Commissioned Offices"], skills: ["General English Grammar", "Quantitative Aptitude", "Office Administration Skills"], salary: "CHSL Post: ₹28K–₹45K/month | MTS Post: ₹22K–₹35K/month", careers: ["Lower Division Clerk", "Data Entry Operator", "Postal Assistant"], certifications: ["SSC Written & Skill Test Clearances"] },
            { id: "postal", title: "POSTAL – Postal Services", icon: "📮", description: "Deals with postal letter sorting, dispatch operations, mail delivery, and post office savings schemes.", entranceExams: ["India Post GDS (Gramin Dak Sevak) Merit list", "Postal Dept exams"], topColleges: ["India Post Training Centers"], skills: ["Sorting Speed", "Local Geography Knowledge", "Basic Computer Operations"], salary: "GDS: ₹12K–₹18K/month | Postal Clerk: ₹25K–₹45K/month", careers: ["Postmaster", "Mail Deliverer", "Postal Clerk"], certifications: ["Postal Operations Pass Cert"] },
            { id: "fire", title: "FIRE – Fire & Safety", icon: "🚒", description: "Trains firefighters in building evacuations, hazardous chemical handling, fire hose operations, and safety audits.", entranceExams: ["Fire Department Physical Rally", "State Fire Service Exams"], topColleges: ["National Fire Service College Nagpur"], skills: ["Firefighting Equipment operations", "Rescue Tactics", "First Aid & Trauma Care"], salary: "Fireman: ₹22K–₹42K/month | Safety Inspector: ₹30K–₹55K/month", careers: ["Firefighter", "Industrial Safety Officer", "Station Fire Officer"], certifications: ["Fire & Safety Diploma (NFSC)"] }
          ]
        }
      ]
    }
  },

  afterGraduation: require('./graduationData')
};

careerData.after12th_jobs = [
  { id: "data-entry-12", title: "Data Entry Operator", icon: "🖥️", category: "IT", salary: "₹12K–₹20K/month", description: "Handle data entry, typing and computer operations in offices, BPOs and data centers.", skills: ["Fast Typing", "MS Excel", "Communication", "Accuracy"], howToBecome: "Learn basic computer skills, MS Office and typing practice.", workplaces: ["Offices", "BPOs", "Data Centers"] },
  { id: "graphic-designer-12", title: "Graphic Designer", icon: "🎨", category: "IT", salary: "₹15K–₹30K/month", description: "Create visual content for brands, social media, ads and digital platforms.", skills: ["Canva", "Photoshop", "Illustrator", "Creativity", "Design Sense"], howToBecome: "Learn Canva, Photoshop and Illustrator.", workplaces: ["Marketing Agencies", "IT Companies", "Freelancing"] },
  { id: "video-editor-12", title: "Video Editor", icon: "🎬", category: "IT", salary: "₹15K–₹35K/month", description: "Edit and produce video content for YouTube channels, media companies and brands.", skills: ["Premiere Pro", "CapCut", "After Effects", "Creativity", "Storytelling"], howToBecome: "Learn Premiere Pro, CapCut or After Effects.", workplaces: ["YouTube Channels", "Media Companies", "Freelancing"] },
  { id: "social-media-12", title: "Social Media Manager", icon: "📱", category: "IT", salary: "₹18K–₹35K/month", description: "Manage brand presence, content and marketing across social media platforms.", skills: ["Communication", "Marketing", "Content Creation", "Analytics"], howToBecome: "Learn Instagram, Facebook and social media marketing.", workplaces: ["Brands", "Agencies", "Startups"] },
  { id: "web-design-12", title: "Web Design Assistant", icon: "🌐", category: "IT", salary: "₹15K–₹30K/month", description: "Assist in designing and building website interfaces for clients.", skills: ["HTML", "CSS", "UI Basics", "Creativity"], howToBecome: "Learn HTML and CSS basics.", workplaces: ["IT Companies", "Freelancing"] },
  { id: "retail-12", title: "Retail Staff", icon: "🛍️", category: "Non-IT", salary: "₹12K–₹20K/month", description: "Handle customer service, billing and store operations in retail outlets.", skills: ["Sales", "Customer Handling", "Communication"], howToBecome: "Communication and customer service skills.", workplaces: ["Malls", "Supermarkets", "Stores"] },
  { id: "bpo-12", title: "BPO Executive", icon: "📞", category: "Non-IT", salary: "₹15K–₹28K/month", description: "Handle inbound/outbound calls and customer support in call centres.", skills: ["Speaking Skills", "Problem Solving", "Patience", "English Communication"], howToBecome: "Basic English and communication training.", workplaces: ["Call Centers", "ITES Companies"] },
  { id: "airport-12", title: "Airport Ground Staff", icon: "✈️", category: "Non-IT", salary: "₹20K–₹35K/month", description: "Handle passenger check-in, boarding, baggage and airport operations.", skills: ["Communication", "Grooming", "Customer Handling"], howToBecome: "Aviation or customer service training course.", workplaces: ["Airports", "Airlines"] },
  { id: "hotel-12", title: "Hotel Staff", icon: "🏨", category: "Non-IT", salary: "₹15K–₹25K/month", description: "Provide hospitality services to hotel guests in front desk, housekeeping or food service.", skills: ["Customer Service", "Teamwork", "Grooming"], howToBecome: "Hospitality training or short hotel management course.", workplaces: ["Hotels", "Resorts"] },
  { id: "delivery-12", title: "Delivery & Logistics", icon: "🚚", category: "Non-IT", salary: "₹15K–₹30K/month", description: "Handle last-mile delivery and logistics operations for e-commerce and courier companies.", skills: ["Navigation", "Time Management", "Driving License"], howToBecome: "Driving license and basic logistics knowledge.", workplaces: ["E-Commerce Companies", "Logistics Companies"] },
  { id: "police-12", title: "Police Constable", icon: "👮", category: "Government", salary: "₹25K–₹45K/month", description: "Maintain law and order, assist investigations and serve the community.", skills: ["Fitness", "Discipline", "Communication"], howToBecome: "State police recruitment exams.", workplaces: ["Police Department"] },
  { id: "army-12", title: "Army / NDA", icon: "🪖", category: "Government", salary: "₹35K–₹60K/month", description: "Serve in the Indian Army, Navy or Air Force as a soldier or officer.", skills: ["Physical Fitness", "Leadership", "Discipline"], howToBecome: "NDA exam or Army recruitment rally.", workplaces: ["Indian Army", "Navy", "Air Force"] },
  { id: "railway-12", title: "Railway Jobs (RRB)", icon: "🚆", category: "Government", salary: "₹25K–₹50K/month", description: "Work in Indian Railways as technician, ticket inspector or operations staff.", skills: ["Aptitude", "Technical Basics", "Discipline"], howToBecome: "RRB NTPC / Group D exams.", workplaces: ["Indian Railways"] }
];

module.exports = careerData;
