// ============================================================
// Mentor Profiles — Dummy Data for All 7 Branches
// Each mentor has a branchId (from domainMatrix) and
// expertise[] used for skill-based matching.
// ============================================================

export interface MentorProfile {
  id: string;
  username: string;
  name: string;
  title: string;
  /** Legacy domain label (kept for backward compatibility) */
  domain: string;
  /** Maps to BranchData.id from domainMatrix.ts */
  branchId: string;
  avatar: string;
  expertise: string[];
  responseTime: string;
  bio: string;
  rating: number;
  availability: "available" | "busy" | "limited";
  stats: { mentees: number; totalMentored: number };
}

export interface DomainInfo {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  careers: string[];
  techStack: string[];
  roadmap: { level: string; items: string[] }[];
  projectIdeas: string[];
}

// ─── Mentor Pool (40 mentors across 7 branches) ─────────────

export const mentors: MentorProfile[] = [

  // ── 1. Computer Science & IT (branchId: "cs-it") ─────────────
  {
    id: "nikhil", username: "nikhil.web", name: "Nikhil Deshpande",
    title: "TY CSE · Full-Stack Intern", domain: "Web Development", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nikhil",
    expertise: ["React", "Next.js", "Node.js", "Tailwind", "MongoDB", "Frontend Developer", "Full Stack Developer"],
    responseTime: "2 hours",
    bio: "Full-stack developer interning at a Pune startup. Built 5+ production apps. Passionate about teaching React and modern web architecture.",
    rating: 4.9, availability: "available", stats: { mentees: 4, totalMentored: 14 },
  },
  {
    id: "ananya", username: "ananya.web", name: "Ananya Joshi",
    title: "TY CSE · Intern @ Persistent Systems", domain: "Web Development", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    expertise: ["React", "Node.js", "MERN", "System Design", "Backend Developer", "Full Stack Developer"],
    responseTime: "2 hours",
    bio: "MERN specialist with 2 years of project experience. Mentored 12+ juniors through SIH and college hackathons.",
    rating: 4.8, availability: "available", stats: { mentees: 3, totalMentored: 12 },
  },
  {
    id: "arjun", username: "arjun.ai", name: "Arjun Mehta",
    title: "MTech AI · Research Intern @ IIT-B", domain: "AI / ML", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunM",
    expertise: ["PyTorch", "LLMs", "NLP", "Transformers", "Computer Vision", "AI/ML Engineer", "NLP Engineer", "Computer Vision Engineer"],
    responseTime: "3 hours",
    bio: "AI researcher focused on NLP and transformers. Published 2 papers in IEEE. Guides students from zero-to-ML through structured weekly sessions.",
    rating: 4.9, availability: "available", stats: { mentees: 3, totalMentored: 10 },
  },
  {
    id: "vikram", username: "vikram.ai", name: "Vikram Rao",
    title: "TY AIML · ML Engineer Intern", domain: "AI / ML", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    expertise: ["TensorFlow", "Scikit-learn", "Pandas", "OpenCV", "Data Scientist", "AI/ML Engineer"],
    responseTime: "4 hours",
    bio: "ML practitioner with strong Kaggle portfolio. Specializes in practical model building and deployment.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 8 },
  },
  {
    id: "karan", username: "karan.data", name: "Karan Bhosale",
    title: "TY IT · Data Analyst Intern", domain: "Data Science", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KaranB",
    expertise: ["Python", "SQL", "PowerBI", "Tableau", "Statistics", "Data Analyst", "Data Scientist"],
    responseTime: "3 hours",
    bio: "Data analyst intern with strong stats background. Helped 6 students build Kaggle portfolios for placements.",
    rating: 4.8, availability: "available", stats: { mentees: 3, totalMentored: 6 },
  },
  {
    id: "harsh", username: "harsh.cyber", name: "Harsh Gaikwad",
    title: "Final Year CSE · CTF Champion", domain: "Cybersecurity", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HarshG",
    expertise: ["Pen Testing", "OWASP", "Network Security", "Cryptography", "Cybersecurity Analyst", "Ethical Hacker"],
    responseTime: "3 hours",
    bio: "3x CTF winner at national level. Active on TryHackMe and HackTheBox. Teaches security through hands-on lab sessions.",
    rating: 4.9, availability: "available", stats: { mentees: 3, totalMentored: 7 },
  },
  {
    id: "siddharth", username: "siddharth.app", name: "Siddharth Jagtap",
    title: "TY CSE · Flutter Developer", domain: "App Development", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siddharth",
    expertise: ["Flutter", "Dart", "Firebase", "Riverpod", "REST APIs", "Cross-Platform Mobile Developer (Flutter/React Native)", "Android Developer"],
    responseTime: "2 hours",
    bio: "Published 3 apps on Play Store. Specializes in cross-platform mobile development. Helps students go from idea to published app.",
    rating: 4.9, availability: "available", stats: { mentees: 3, totalMentored: 8 },
  },
  {
    id: "riya", username: "riya.dsa", name: "Riya Sharma",
    title: "Placed @ Infosys · DSA Expert", domain: "Placements & DSA", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya",
    expertise: ["DSA", "System Design", "LeetCode", "Mock Interviews", "Competitive Programmer", "SDE at Product Company"],
    responseTime: "2 hours",
    bio: "Placed at Infosys Digital. Solved 600+ LeetCode problems. Conducts weekly mock interviews for placement aspirants.",
    rating: 4.9, availability: "available", stats: { mentees: 4, totalMentored: 15 },
  },
  {
    id: "omkar", username: "omkar.devops", name: "Omkar Bhosale",
    title: "Final Year CSE · DevOps Intern", domain: "Systems & DevOps", branchId: "cs-it",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omkar",
    expertise: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "DevOps Engineer", "Cloud Engineer"],
    responseTime: "4 hours",
    bio: "DevOps intern at a Pune startup. AWS Certified Cloud Practitioner. Teaches infrastructure with real deployment labs.",
    rating: 4.8, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },

  // ── 2. ENTC / ECE (branchId: "entc-ece") ──────────────────────
  {
    id: "atharva", username: "atharva.entc", name: "Atharva More",
    title: "TY ENTC · SOC Analyst Intern", domain: "Cybersecurity", branchId: "entc-ece",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Atharva",
    expertise: ["SIEM", "Splunk", "Networking", "Embedded Systems", "VLSI Designer", "Signal Processing Engineer"],
    responseTime: "5 hours",
    bio: "SOC analyst intern with a background in electronics. Bridges networking and embedded systems for ENTC students.",
    rating: 4.5, availability: "limited", stats: { mentees: 1, totalMentored: 3 },
  },
  {
    id: "priyank", username: "priyank.entc", name: "Priyank Kulkarni",
    title: "Final Year ENTC · VLSI Intern", domain: "VLSI Design", branchId: "entc-ece",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priyank",
    expertise: ["VLSI", "Verilog", "FPGA", "Xilinx", "Digital Electronics", "VLSI Designer"],
    responseTime: "4 hours",
    bio: "VLSI design intern. Guides students through digital circuit design and FPGA programming.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },
  {
    id: "shreyas_e", username: "shreyas.entc", name: "Shreyas Nair",
    title: "TY ENTC · IoT Researcher", domain: "IoT", branchId: "entc-ece",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShreyasE",
    expertise: ["Arduino", "Raspberry Pi", "MQTT", "IoT", "Embedded C", "IoT Engineer", "Embedded Systems Engineer"],
    responseTime: "3 hours",
    bio: "IoT enthusiast with 4 published projects. Specializes in sensor integration and real-time data collection.",
    rating: 4.8, availability: "available", stats: { mentees: 2, totalMentored: 6 },
  },
  {
    id: "mihir", username: "mihir.entc", name: "Mihir Patel",
    title: "TY ECE · RF & Signal Processing", domain: "Signal Processing", branchId: "entc-ece",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mihir",
    expertise: ["MATLAB", "Signal Processing", "RF Design", "Communication Systems", "Signal Processing Engineer", "RF & Communication Engineer"],
    responseTime: "5 hours",
    bio: "Specializes in communication systems and DSP. Helps ENTC students crack core electronics placements.",
    rating: 4.6, availability: "available", stats: { mentees: 1, totalMentored: 4 },
  },

  // ── 3. Mechanical & Automobile (branchId: "mechanical") ────────
  {
    id: "rohan_m", username: "rohan.mech", name: "Rohan Deshpande",
    title: "Final Year Mech · CAD Specialist", domain: "Mechanical Design", branchId: "mechanical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RohanM",
    expertise: ["SolidWorks", "AutoCAD", "CATIA", "GD&T", "Mechanical Design Engineer", "Product Design Engineer"],
    responseTime: "4 hours",
    bio: "CAD specialist who has completed 3 internships in automotive design. Teaches 3D modelling and design thinking.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },
  {
    id: "aakash_m", username: "aakash.mech", name: "Aakash Joshi",
    title: "TY Mech · Manufacturing Intern", domain: "Manufacturing", branchId: "mechanical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AakashM",
    expertise: ["CNC", "Lean Manufacturing", "Quality Control", "GD&T", "Manufacturing Engineer", "Production Engineer"],
    responseTime: "5 hours",
    bio: "Manufacturing intern at Tata AutoComp. Teaches students core manufacturing processes and quality systems.",
    rating: 4.5, availability: "available", stats: { mentees: 1, totalMentored: 3 },
  },
  {
    id: "saurabh_m", username: "saurabh.mech", name: "Saurabh Patil",
    title: "Final Year Auto · EV Researcher", domain: "Automobile", branchId: "mechanical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SaurabhM",
    expertise: ["EV Powertrain", "MATLAB Simulink", "Vehicle Dynamics", "Automobile Engineer", "EV / Hybrid Vehicle Engineer"],
    responseTime: "3 hours",
    bio: "EV researcher working on powertrain simulation. Guides students interested in the booming EV industry.",
    rating: 4.8, availability: "available", stats: { mentees: 2, totalMentored: 6 },
  },
  {
    id: "neha_m", username: "neha.mech", name: "Neha Sawant",
    title: "TY Mech · GATE Aspirant", domain: "Core Engineering", branchId: "mechanical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NehaM",
    expertise: ["Thermodynamics", "Fluid Mechanics", "Strength of Materials", "GATE Prep", "GATE / Higher Education Aspirant"],
    responseTime: "4 hours",
    bio: "GATE rank 245. Mentors aspirants on theory, problem-solving strategy, and time management.",
    rating: 4.6, availability: "limited", stats: { mentees: 2, totalMentored: 4 },
  },

  // ── 4. Civil & Infrastructure (branchId: "civil") ──────────────
  {
    id: "yash_c", username: "yash.civil", name: "Yash Thorat",
    title: "Final Year Civil · Structural Intern", domain: "Structural Engineering", branchId: "civil",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=YashC",
    expertise: ["STAAD Pro", "AutoCAD Civil 3D", "RCC Design", "Structural Analysis", "Structural Engineer", "Construction Site Engineer"],
    responseTime: "4 hours",
    bio: "Structural design intern at L&T. Teaches RCC design fundamentals and software tools for civil students.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },
  {
    id: "priya_c", username: "priya.civil", name: "Priya Gaikwad",
    title: "TY Civil · GIS Researcher", domain: "GIS & Urban Planning", branchId: "civil",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaC",
    expertise: ["GIS", "ArcGIS", "Urban Planning", "Remote Sensing", "Urban Planner & GIS Analyst", "Environmental Engineer"],
    responseTime: "5 hours",
    bio: "GIS researcher at SPPU. Helps students explore geospatial technology in urban planning and smart city projects.",
    rating: 4.6, availability: "available", stats: { mentees: 1, totalMentored: 3 },
  },
  {
    id: "rahul_c", username: "rahul.civil", name: "Rahul Kawade",
    title: "TY Civil · Construction Manager Trainee", domain: "Construction", branchId: "civil",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RahulC",
    expertise: ["Project Management", "MS Project", "Estimation", "AutoCAD", "Construction Project Manager", "Construction Site Engineer"],
    responseTime: "3 hours",
    bio: "Construction management trainee with hands-on site experience. Guides students through project execution and estimation.",
    rating: 4.5, availability: "available", stats: { mentees: 1, totalMentored: 4 },
  },

  // ── 5. Electrical Engineering (branchId: "electrical") ─────────
  {
    id: "tanvi_e", username: "tanvi.ee", name: "Tanvi Joshi",
    title: "Final Year EE · Power Systems Intern", domain: "Power Systems", branchId: "electrical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TanviE",
    expertise: ["ETAP", "Power Systems", "Protection Relays", "MATLAB", "Power Systems Engineer", "Electrical Design Engineer"],
    responseTime: "4 hours",
    bio: "Power systems intern at MSEDCL. Teaches protection systems, load flow analysis, and industry tools.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },
  {
    id: "siddhesh_e", username: "siddhesh.ee", name: "Siddhesh Pawar",
    title: "TY EE · PLC & Automation Intern", domain: "Automation", branchId: "electrical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SiddheshE",
    expertise: ["PLC", "SCADA", "Automation", "Siemens TIA Portal", "Automation / Control Engineer", "PLC & SCADA Engineer"],
    responseTime: "3 hours",
    bio: "PLC intern at Siemens. Teaches industrial automation, HMI design, and PLC programming from scratch.",
    rating: 4.8, availability: "available", stats: { mentees: 2, totalMentored: 4 },
  },
  {
    id: "gauri_e", username: "gauri.ee", name: "Gauri Kulkarni",
    title: "TY EE · Renewable Energy Researcher", domain: "Renewable Energy", branchId: "electrical",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GauriE",
    expertise: ["Solar PV", "Wind Energy", "ETAP", "Renewable Systems", "Renewable Energy Engineer", "Energy Auditor"],
    responseTime: "5 hours",
    bio: "Renewable energy researcher focused on solar grid integration. Guides students toward green energy careers.",
    rating: 4.6, availability: "limited", stats: { mentees: 1, totalMentored: 3 },
  },

  // ── 6. Chemical & Biotech (branchId: "chem-biotech") ───────────
  {
    id: "aditi_cb", username: "aditi.chem", name: "Aditi Bhatia",
    title: "Final Year Chem · Process Intern", domain: "Chemical Engineering", branchId: "chem-biotech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AditiCB",
    expertise: ["ASPEN Plus", "Process Design", "Heat Transfer", "Chemical Plant Safety", "Process / Chemical Engineer", "Plant Design Engineer"],
    responseTime: "4 hours",
    bio: "Process engineering intern at Aarti Industries. Teaches ASPEN simulation and real-world process safety.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },
  {
    id: "sagar_cb", username: "sagar.biotech", name: "Sagar Naik",
    title: "TY Biotech · Research Intern", domain: "Biotechnology", branchId: "chem-biotech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SagarCB",
    expertise: ["PCR", "Gel Electrophoresis", "Cell Culture", "Bioinformatics", "Biotechnologist / Research Associate", "Bioinformatics Analyst"],
    responseTime: "5 hours",
    bio: "Biotech research intern with lab experience in molecular biology. Guides students through research paper reading and lab techniques.",
    rating: 4.6, availability: "available", stats: { mentees: 1, totalMentored: 3 },
  },
  {
    id: "pallavi_cb", username: "pallavi.pharma", name: "Pallavi Desai",
    title: "Final Year Chem · Pharma Intern", domain: "Pharma", branchId: "chem-biotech",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PallaviCB",
    expertise: ["GMP", "HPLC", "Quality Control", "Pharma Regulations", "Quality Control / QA Engineer", "Pharmaceutical Process Engineer"],
    responseTime: "3 hours",
    bio: "Pharma intern at Sun Pharmaceutical. Teaches GMP practices, analytical chemistry, and pharma QC workflows.",
    rating: 4.8, availability: "available", stats: { mentees: 2, totalMentored: 6 },
  },

  // ── 7. Business, Management & Interdisciplinary (branchId: "business") ──
  {
    id: "aishwarya_b", username: "aishwarya.biz", name: "Aishwarya Joshi",
    title: "Final Year MBA-Tech · Strategy Intern", domain: "Business Strategy", branchId: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AishwaryaB",
    expertise: ["Business Strategy", "Market Research", "Consulting", "Excel", "Product Manager", "Business Analyst"],
    responseTime: "3 hours",
    bio: "Strategy intern at McKinsey Pune office. Mentors students on case studies, consulting interviews, and product thinking.",
    rating: 4.9, availability: "available", stats: { mentees: 3, totalMentored: 9 },
  },
  {
    id: "tanuj_b", username: "tanuj.startup", name: "Tanuj Mehta",
    title: "Final Year IT · Startup Founder", domain: "Entrepreneurship", branchId: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TanujB",
    expertise: ["Startup Building", "Fundraising", "Pitching", "MVP", "Entrepreneur / Startup Founder", "Product Manager"],
    responseTime: "4 hours",
    bio: "Founded a SaaS startup with 200+ users. Teaches students how to go from idea to funded startup.",
    rating: 4.8, availability: "limited", stats: { mentees: 2, totalMentored: 5 },
  },
  {
    id: "divya_b", username: "divya.finance", name: "Divya Sharma",
    title: "TY MBA · Finance Intern", domain: "Finance", branchId: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DivyaB",
    expertise: ["Financial Modeling", "Excel", "Valuation", "Stock Market", "Finance & Investment Analyst", "Business Analyst"],
    responseTime: "5 hours",
    bio: "Finance intern at Axis Capital. Teaches financial modeling, equity research, and interview preparation for finance roles.",
    rating: 4.6, availability: "available", stats: { mentees: 1, totalMentored: 3 },
  },
  {
    id: "kabir_b", username: "kabir.marketing", name: "Kabir Rao",
    title: "TY MBA · Digital Marketing Intern", domain: "Marketing", branchId: "business",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=KabirB",
    expertise: ["SEO", "Google Ads", "Social Media", "Content Marketing", "Digital Marketing Specialist", "Marketing & Brand Manager"],
    responseTime: "3 hours",
    bio: "Digital marketing intern managing campaigns with 1M+ reach. Teaches growth marketing and analytics.",
    rating: 4.7, availability: "available", stats: { mentees: 2, totalMentored: 5 },
  },
];

// ─── 7 Domain Info ─────────────────────────────────────────────
export const domains: DomainInfo[] = [
  { slug: "web-development", title: "Web Development", tagline: "Build the modern web — from landing pages to full-stack apps", description: "Web development is one of the most in-demand skill sets in the Indian tech industry.", careers: ["Frontend Developer", "Full-Stack Engineer", "UI/UX Developer", "Freelance Web Developer", "SDE at Product Companies"], techStack: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "Tailwind CSS"], roadmap: [{ level: "Beginner", items: ["HTML & CSS Fundamentals", "JavaScript Basics & DOM", "Responsive Design", "Git & GitHub"] }, { level: "Intermediate", items: ["React Components & Hooks", "REST APIs with Node/Express", "Database Design (MongoDB/SQL)", "Authentication & Authorization"] }, { level: "Advanced", items: ["Next.js & SSR/ISR", "System Design for Web Apps", "CI/CD & Deployment", "Performance Optimization"] }], projectIdeas: ["Personal Portfolio Website", "Blog Platform with CMS", "E-commerce Store (MERN)", "Real-time Chat Application", "College Event Management System"] },
  { slug: "ai-ml", title: "AI / ML", tagline: "Explore the frontier of artificial intelligence and machine learning", description: "AI/ML is transforming every industry, and Indian engineering students are at the forefront.", careers: ["ML Engineer", "AI Research Intern", "Data Scientist", "NLP Engineer", "Computer Vision Developer"], techStack: ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "Hugging Face", "OpenCV", "Jupyter", "Weights & Biases"], roadmap: [{ level: "Beginner", items: ["Python & NumPy Fundamentals", "Data Manipulation with Pandas", "Basic Statistics & Probability", "Intro to Machine Learning"] }, { level: "Intermediate", items: ["Supervised & Unsupervised Learning", "Neural Networks & Deep Learning", "NLP Fundamentals", "Model Evaluation & Tuning"] }, { level: "Advanced", items: ["Transformers & LLMs", "Computer Vision with CNNs", "MLOps & Model Deployment", "Research Paper Implementation"] }], projectIdeas: ["Sentiment Analysis of Movie Reviews", "Image Classification (CIFAR-10)", "Chatbot with LLM Integration", "Recommendation System", "Disease Prediction from Medical Data"] },
  { slug: "data-science", title: "Data Science", tagline: "Turn raw data into insights that drive real-world decisions", description: "Data Science combines programming, statistics, and domain expertise to extract meaningful insights.", careers: ["Data Analyst", "Business Analyst", "Data Scientist", "Analytics Consultant", "BI Developer"], techStack: ["Python", "SQL", "R", "Tableau", "PowerBI", "Excel", "Pandas", "Matplotlib", "Seaborn", "Scikit-learn"], roadmap: [{ level: "Beginner", items: ["Python & SQL Basics", "Statistics & Probability", "Data Cleaning & Preprocessing", "Basic Visualization"] }, { level: "Intermediate", items: ["Advanced SQL & Joins", "Dashboard Building (PowerBI/Tableau)", "Hypothesis Testing", "Feature Engineering"] }, { level: "Advanced", items: ["Machine Learning for Analytics", "A/B Testing", "Big Data Tools (Spark)", "Kaggle Competition Strategies"] }], projectIdeas: ["Sales Dashboard with PowerBI", "Customer Segmentation Analysis", "Kaggle Competition Submission", "COVID-19 Data Visualization", "Stock Market Trend Analysis"] },
  { slug: "cybersecurity", title: "Cybersecurity", tagline: "Defend systems, break barriers, and secure the digital world", description: "Cybersecurity is critical in today's connected world.", careers: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Ethical Hacker", "Security Consultant"], techStack: ["Kali Linux", "Wireshark", "Burp Suite", "Nmap", "Metasploit", "Python", "Bash", "OWASP ZAP", "Snort", "Splunk"], roadmap: [{ level: "Beginner", items: ["Linux & Networking Basics", "Cryptography Fundamentals", "Web Security Concepts", "Basic Scripting (Bash/Python)"] }, { level: "Intermediate", items: ["OWASP Top 10", "Penetration Testing Methodology", "CTF Challenges (TryHackMe)", "Network Security & Firewalls"] }, { level: "Advanced", items: ["Advanced Exploitation", "Reverse Engineering", "Incident Response", "Security Audit & Compliance"] }], projectIdeas: ["Vulnerability Scanner Tool", "Encrypted Messaging App", "Network Traffic Analyzer", "CTF Challenge Platform", "Web Application Firewall"] },
  { slug: "app-development", title: "App Development", tagline: "Build beautiful, performant mobile apps for Android & iOS", description: "Mobile app development is one of the most exciting domains.", careers: ["Android Developer", "iOS Developer", "Flutter Developer", "React Native Developer", "Mobile App Architect"], techStack: ["Flutter", "Dart", "React Native", "Kotlin", "Swift", "Firebase", "REST APIs", "SQLite", "Hive", "Riverpod"], roadmap: [{ level: "Beginner", items: ["Dart / Kotlin Basics", "UI Components & Layouts", "Navigation & Routing", "Simple CRUD App"] }, { level: "Intermediate", items: ["State Management (Provider/Riverpod)", "API Integration", "Firebase Auth & Firestore", "Local Storage & Caching"] }, { level: "Advanced", items: ["Custom Animations", "Platform Channels", "App Store Deployment", "Performance & Testing"] }], projectIdeas: ["Expense Tracker App", "Weather App with API", "College Notice Board App", "Food Delivery UI Clone", "Fitness Tracker with Firebase"] },
  { slug: "systems-devops", title: "Systems & DevOps", tagline: "Master infrastructure, automation, and cloud-native deployments", description: "Systems & DevOps is about building reliable, scalable infrastructure.", careers: ["DevOps Engineer", "SRE", "Cloud Engineer", "Platform Engineer", "Infrastructure Architect"], techStack: ["Linux", "Docker", "Kubernetes", "AWS/GCP", "Terraform", "Jenkins", "GitHub Actions", "Prometheus", "Grafana", "Ansible"], roadmap: [{ level: "Beginner", items: ["Linux Administration", "Shell Scripting", "Git & Version Control", "Basic Networking"] }, { level: "Intermediate", items: ["Docker & Containerization", "CI/CD Pipelines", "Cloud Platforms (AWS/GCP)", "Monitoring & Logging"] }, { level: "Advanced", items: ["Kubernetes Orchestration", "Infrastructure as Code (Terraform)", "Service Mesh", "Chaos Engineering"] }], projectIdeas: ["Dockerized MERN Deployment", "CI/CD Pipeline for a Web App", "Cloud Infrastructure with Terraform", "Monitoring Dashboard with Grafana", "Automated Backup System"] },
  { slug: "placements-dsa", title: "Placements & DSA", tagline: "Crack coding interviews and land your dream placement", description: "The placement season is the most critical period for Indian engineering students.", careers: ["SDE at Product Companies", "Associate Software Engineer", "Backend Developer", "Competitive Programmer", "Technical Consultant"], techStack: ["C++/Java", "LeetCode", "Codeforces", "GeeksforGeeks", "System Design Primer", "InterviewBit", "Pramp", "Blind 75"], roadmap: [{ level: "Beginner", items: ["Arrays & Strings", "Time & Space Complexity", "Sorting & Searching", "Basic Recursion"] }, { level: "Intermediate", items: ["Linked Lists & Stacks/Queues", "Trees & Binary Search Trees", "Graphs (BFS/DFS)", "Dynamic Programming Basics"] }, { level: "Advanced", items: ["Advanced DP Patterns", "System Design", "Mock Interviews", "Resume & HR Preparation"] }], projectIdeas: ["LeetCode Tracker Dashboard", "Algorithm Visualizer", "Mock Interview Platform", "Resume Builder App", "DSA Notes Wiki"] },
];

// ─── Helpers ───────────────────────────────────────────────────

export function getMentorById(id: string, pool: MentorProfile[] = mentors): MentorProfile | undefined {
  return pool.find((m) => m.id === id);
}

export function getMentorByUsername(username: string, pool: MentorProfile[] = mentors): MentorProfile | undefined {
  return pool.find((m) => m.username === username);
}

export function getMentorsForDomain(domain: string, pool: MentorProfile[] = mentors): MentorProfile[] {
  return pool.filter((m) => m.domain === domain);
}

export function getDomainBySlug(slug: string): DomainInfo | undefined {
  return domains.find((d) => d.slug === slug);
}

export function getDomainByTitle(title: string): DomainInfo | undefined {
  return domains.find((d) => d.title === title);
}

/**
 * Returns mentors for a given branch, ranked by how well they match
 * the selected role and student skills. Available mentors sort first.
 */
export function getRankedMentorsForBranch(
  branchId: string,
  selectedRole: string,
  studentSkills: string[],
  pool: MentorProfile[] = mentors
): MentorProfile[] {
  const branchPool = pool.filter((m) => m.branchId === branchId);

  // Score each mentor
  const scored = branchPool.map((m) => {
    let score = 0;
    const expertise = m.expertise || [];
    const roleStr = selectedRole || "";
    
    // Role match (exact string in expertise)
    if (roleStr && expertise.some((e) => e.toLowerCase() === roleStr.toLowerCase())) {
      score += 10;
    }
    // Partial role word match
    if (roleStr) {
      const roleWords = roleStr.toLowerCase().split(/[\s/&]+/);
      roleWords.forEach((word) => {
        if (word.length > 3 && expertise.some((e) => e.toLowerCase().includes(word))) {
          score += 3;
        }
      });
    }
    // Skill overlap
    studentSkills.forEach((skill) => {
      if (expertise.some((e) => e.toLowerCase().includes(skill.toLowerCase()))) {
        score += 1;
      }
    });
    // Availability bonus
    if (m.availability === "available") score += 5;
    else if (m.availability === "limited") score += 1;

    return { mentor: m, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .map((s) => s.mentor);
}
