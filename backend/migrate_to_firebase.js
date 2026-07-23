require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const technologies = [
  { id: "html", name: "HTML", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", category: "Web Development", icon: "🌐", description: "Learn structure and elements of web pages." },
  { id: "css", name: "CSS", url: "https://web.dev/learn/css", category: "Web Development", icon: "🎨", description: "Master styling, layout systems, and responsive design." },
  { id: "javascript", name: "JavaScript", url: "https://javascript.info", category: "Languages", icon: "💛", description: "Modern JavaScript programming language from basic to advanced." },
  { id: "react", name: "React", url: "https://react.dev/learn", category: "Web Development", icon: "⚛️", description: "Build component-based dynamic user interfaces." },
  { id: "vuejs", name: "Vue.js", url: "https://vuejs.org/tutorial", category: "Web Development", icon: "💚", description: "Progressive JavaScript framework for UI development." },
  { id: "angular", name: "Angular", url: "https://angular.dev/tutorials", category: "Web Development", icon: "❤️", description: "Enterprise-grade web application platform." },
  { id: "nextjs", name: "Next.js", url: "https://nextjs.org/learn", category: "Web Development", icon: "🖤", description: "React framework for production-grade static & server-side rendering." },
  { id: "java", name: "Java", url: "https://dev.java/learn", category: "Languages", icon: "☕", description: "Robust object-oriented programming language." },
  { id: "python", name: "Python", url: "https://www.learnpython.org", category: "Languages", icon: "🐍", description: "High-level language for scripting, AI, and backend services." },
  { id: "c", name: "C", url: "https://www.learn-c.org", category: "Languages", icon: "🛠️", description: "Procedural language for system-level programming." },
  { id: "cpp", name: "C++", url: "https://www.learncpp.com", category: "Languages", icon: "🚀", description: "Fast object-oriented and system programming language." },
  { id: "csharp", name: "C#", url: "https://learn.microsoft.com/dotnet/csharp", category: "Languages", icon: "🔷", description: "Microsoft's object-oriented programming language for .NET." },
  { id: "go", name: "Go", url: "https://go.dev/learn", category: "Languages", icon: "🐹", description: "Google's concurrent, compiled backend language." },
  { id: "rust", name: "Rust", url: "https://www.rust-lang.org/learn", category: "Languages", icon: "🦀", description: "Memory-safe and high-performance systems programming language." },
  { id: "php", name: "PHP", url: "https://phptherightway.com", category: "Languages", icon: "🐘", description: "Server-side scripting language for web development." },
  { id: "typescript", name: "TypeScript", url: "https://www.typescriptlang.org/docs", category: "Languages", icon: "🔵", description: "Typed superset of JavaScript that scales." },
  { id: "swift", name: "Swift", url: "https://www.swift.org/documentation", category: "Languages", icon: "🍎", description: "Apple's modern language for iOS and macOS apps." },
  { id: "git", name: "Git", url: "https://git-scm.com/book/en/v2", category: "Software Eng & Practice", icon: "🐙", description: "Version control book and tutorial." },
  { id: "sql", name: "SQL", url: "https://sqlbolt.com", category: "Databases", icon: "📊", description: "Structured Query Language basics and exercises." },
  { id: "postgresql", name: "PostgreSQL", url: "https://www.postgresqltutorial.com", category: "Databases", icon: "🐘", description: "Relational database systems and features." },
  { id: "mongodb", name: "MongoDB", url: "https://learn.mongodb.com", category: "Databases", icon: "🍃", description: "NoSQL document database concepts and operations." },
  { id: "nodejs", name: "Node.js", url: "https://nodejs.org/en/learn", category: "Web Development", icon: "🟢", description: "Run JavaScript on the server side." },
  { id: "expressjs", name: "Express.js", url: "https://expressjs.com", category: "Web Development", icon: "⚡", description: "Minimalist web framework for Node.js backend development." },
  { id: "django", name: "Django", url: "https://docs.djangoproject.com/en/stable/intro/tutorial01", category: "Web Development", icon: "🐴", description: "Python web framework for rapid development." },
  { id: "flask", name: "Flask", url: "https://flask.palletsprojects.com/tutorial", category: "Web Development", icon: "🧪", description: "Micro web framework in Python." },
  { id: "restapis", name: "REST APIs", url: "https://rapidapi.com/learn", category: "Web Development", icon: "🔗", description: "Understand request-response architecture and REST principles." },
  { id: "flutter", name: "Flutter", url: "https://docs.flutter.dev/get-started", category: "Mobile", icon: "🦋", description: "Google's UI toolkit for cross-platform apps." },
  { id: "android", name: "Android", url: "https://developer.android.com/courses", category: "Mobile", icon: "🤖", description: "Official courses for Android development." },
  { id: "reactnative", name: "React Native", url: "https://reactnative.dev/docs/getting-started", category: "Mobile", icon: "📱", description: "Build native mobile apps using React." },
  { id: "aibasics", name: "AI Basics", url: "https://www.elementsofai.com", category: "AI & Cloud", icon: "🧠", description: "Introduction to Artificial Intelligence concepts." },
  { id: "tensorflow", name: "TensorFlow", url: "https://www.tensorflow.org/learn", category: "AI & Cloud", icon: "🍊", description: "Machine learning library for numerical computation." },
  { id: "pytorch", name: "PyTorch", url: "https://pytorch.org/tutorials", category: "AI & Cloud", icon: "🔥", description: "Open source machine learning framework by Meta." },
  { id: "gemini", name: "Google Gemini", url: "https://ai.google.dev", category: "AI & Cloud", icon: "✨", description: "Learn Google's Gemini models and developer API." },
  { id: "aws", name: "AWS", url: "https://skillbuilder.aws", category: "AI & Cloud", icon: "☁️", description: "Amazon Web Services training and learning pathways." },
  { id: "azure", name: "Microsoft Azure", url: "https://learn.microsoft.com/training/azure", category: "AI & Cloud", icon: "💻", description: "Azure cloud computing modules and certifications." },
  { id: "gcp", name: "Google Cloud", url: "https://www.cloudskillsboost.google", category: "AI & Cloud", icon: "☁️", description: "Google Cloud Platform skill badges and training." },
  { id: "docker", name: "Docker", url: "https://docs.docker.com/get-started", category: "DevOps & OS", icon: "🐳", description: "Containerize applications for consistent deployment." },
  { id: "kubernetes", name: "Kubernetes", url: "https://kubernetes.io/docs/tutorials", category: "DevOps & OS", icon: "☸️", description: "Orchestrate and scale containerized deployments." },
  { id: "terraform", name: "Terraform", url: "https://developer.hashicorp.com/terraform/tutorials", category: "DevOps & OS", icon: "🏗️", description: "Infrastructure as Code to manage cloud resources." },
  { id: "jenkins", name: "Jenkins", url: "https://www.jenkins.io/doc/tutorials", category: "DevOps & OS", icon: "🎩", description: "CI/CD server for build automation." },
  { id: "linux", name: "Linux", url: "https://linuxjourney.com", category: "DevOps & OS", icon: "🐧", description: "Command line, permissions, and server setup." },
  { id: "tryhackme", name: "TryHackMe", url: "https://tryhackme.com", category: "Security & Web3", icon: "🛡️", description: "Hands-on cyber security training through labs." },
  { id: "owasp", name: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten", category: "Security & Web3", icon: "🕸️", description: "Top web application security risks and mitigations." },
  { id: "blockchain", name: "Blockchain", url: "https://cryptozombies.io", category: "Security & Web3", icon: "⛓️", description: "Learn Solidity and smart contracts by building a game." },
  { id: "web3", name: "Web3", url: "https://learnweb3.io", category: "Security & Web3", icon: "🌐", description: "Full-stack Web3 developer curriculum." },
  { id: "designpatterns", name: "Design Patterns", url: "https://refactoring.guru", category: "Software Eng & Practice", icon: "📐", description: "Reusable solutions to common software design problems." },
  { id: "dsa", name: "Data Structures & Algorithms", url: "https://www.geeksforgeeks.org/dsa", category: "Software Eng & Practice", icon: "📈", description: "Essential algorithms, sorting, and data representation." },
  { id: "cs50", name: "CS50", url: "https://cs50.harvard.edu", category: "Software Eng & Practice", icon: "🏛️", description: "Harvard's famous introduction to computer science." },
  { id: "leetcode", name: "LeetCode", url: "https://leetcode.com", category: "Software Eng & Practice", icon: "💻", description: "Coding challenges for technical interview preparation." },
  { id: "hackerrank", name: "HackerRank", url: "https://www.hackerrank.com", category: "Software Eng & Practice", icon: "🎯", description: "Practice coding questions and earn certificates." },
  { id: "codewars", name: "Codewars", url: "https://www.codewars.com", category: "Software Eng & Practice", icon: "🥋", description: "Train on coding kata to improve logic." },
  { id: "odinproject", name: "The Odin Project", url: "https://www.theodinproject.com", category: "Software Eng & Practice", icon: "⛵", description: "Full-stack web development course based on open source." },
  { id: "freecodecamp", name: "freeCodeCamp", url: "https://www.freecodecamp.org", category: "Software Eng & Practice", icon: "🔥", description: "Free certification courses in responsive web design, JS, and backend." }
];

try {
  initializeApp(firebaseConfig);
  const db = getFirestore();

  const USERS_FILE = path.join(__dirname, 'db', 'users.json');
  const SAVED_FILE = path.join(__dirname, 'db', 'saved_careers.json');

  async function migrate() {
    console.log('🚀 Starting data migration to Firebase Firestore...');

    // 1. Migrate Users
    if (fs.existsSync(USERS_FILE)) {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      console.log(`👤 Found ${users.length} users to migrate.`);
      for (const user of users) {
        await setDoc(doc(db, 'users', user.id), user);
        console.log(`   Processed user: ${user.email}`);
      }
    } else {
      console.log('⚠️ No users.json file found.');
    }

    // 2. Migrate Saved Careers
    if (fs.existsSync(SAVED_FILE)) {
      const saved = JSON.parse(fs.readFileSync(SAVED_FILE, 'utf8'));
      console.log(`💼 Found ${saved.length} saved careers to migrate.`);
      for (const item of saved) {
        await setDoc(doc(db, 'saved_careers', item.id), item);
        console.log(`   Processed saved career: ${item.title} (User: ${item.userId})`);
      }
    } else {
      console.log('⚠️ No saved_careers.json file found.');
    }

    // 3. Migrate Technologies (seeding)
    console.log(`🧠 Found ${technologies.length} learning resources to seed.`);
    for (const tech of technologies) {
      await setDoc(doc(db, 'technologies', tech.id), tech);
      console.log(`   Seeded technology: ${tech.name}`);
    }

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  }

  migrate().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });

} catch (error) {
  console.error('❌ Firebase connection error:', error);
  process.exit(1);
}
