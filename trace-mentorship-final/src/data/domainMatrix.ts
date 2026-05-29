// ============================================================
// Comprehensive Onboarding Data Matrix
// 7 Branches · 100+ Roles · Role-Specific Skills · Timelines · Goals
// ============================================================

// --------------- Type Definitions ---------------

export interface RoleCategory {
  category: string;
  roles: string[];
}

export interface BranchData {
  id: string;
  title: string;
  description: string;
  iconKey: string; // maps to a lucide icon in the UI
  roleCategories: RoleCategory[];
  roleSkillMap: Record<string, string[]>;
  generalSkills: string[]; // shown when "Not Decided / Exploring" is selected
}

// --------------- Branch Definitions ---------------

export const branches: BranchData[] = [
  // ──────────────────────────────────────────────
  // 1. Computer Science & IT
  // ──────────────────────────────────────────────
  {
    id: "cs-it",
    title: "Computer Science & IT",
    description: "Build the future with code, data, and intelligent systems.",
    iconKey: "Code",
    roleCategories: [
      {
        category: "Web & App Development",
        roles: [
          "Frontend Developer",
          "Backend Developer",
          "Full Stack Developer",
          "WordPress / CMS Developer",
        ],
      },
      {
        category: "Mobile Development",
        roles: [
          "Android Developer",
          "iOS Developer",
          "Cross-Platform Mobile Developer (Flutter/React Native)",
        ],
      },
      {
        category: "AI, ML & Data",
        roles: [
          "AI/ML Engineer",
          "Data Scientist",
          "Data Analyst",
          "Data Engineer",
          "NLP Engineer",
          "Computer Vision Engineer",
        ],
      },
      {
        category: "Cloud, DevOps & Infrastructure",
        roles: [
          "Cloud Engineer (AWS/Azure/GCP)",
          "DevOps Engineer",
          "Site Reliability Engineer (SRE)",
          "Database Administrator (DBA)",
        ],
      },
      {
        category: "Security",
        roles: [
          "Cybersecurity Analyst",
          "Penetration Tester / Ethical Hacker",
          "Security Operations (SOC) Analyst",
        ],
      },
      {
        category: "Specialized",
        roles: [
          "Game Developer",
          "Blockchain / Web3 Developer",
          "Embedded Software Engineer",
          "AR/VR Developer",
          "Technical Writer",
          "QA / Test Automation Engineer",
        ],
      },
    ],
    roleSkillMap: {
      "Frontend Developer": ["HTML/CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Tailwind CSS", "Figma Basics", "Git"],
      "Backend Developer": ["Node.js", "Python (Django/Flask)", "Java (Spring Boot)", "Express.js", "REST APIs", "GraphQL", "SQL", "MongoDB", "Redis"],
      "Full Stack Developer": ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL", "MongoDB", "Docker", "Git", "REST APIs"],
      "WordPress / CMS Developer": ["HTML/CSS", "PHP", "WordPress", "SEO Basics", "JavaScript"],
      "Android Developer": ["Java", "Kotlin", "Android SDK", "Firebase", "Jetpack Compose", "XML Layouts"],
      "iOS Developer": ["Swift", "SwiftUI", "UIKit", "Xcode", "Core Data", "Firebase"],
      "Cross-Platform Mobile Developer (Flutter/React Native)": ["Dart", "Flutter", "React Native", "Firebase", "REST APIs"],
      "AI/ML Engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "NumPy", "Pandas", "Math (Linear Algebra, Probability)"],
      "Data Scientist": ["Python", "R", "Pandas", "SQL", "Statistics", "Tableau/PowerBI", "Machine Learning", "Jupyter"],
      "Data Analyst": ["Excel", "SQL", "Python", "Tableau", "PowerBI", "Statistics", "Google Sheets"],
      "Data Engineer": ["Python", "SQL", "Apache Spark", "Airflow", "AWS/GCP", "Kafka", "ETL Pipelines"],
      "NLP Engineer": ["Python", "NLP Libraries (spaCy, NLTK, Hugging Face)", "Transformers", "Linguistics Basics"],
      "Computer Vision Engineer": ["Python", "OpenCV", "TensorFlow/PyTorch", "Image Processing", "Math"],
      "Cloud Engineer (AWS/Azure/GCP)": ["AWS/Azure/GCP", "Linux", "Terraform", "Networking", "Docker", "Kubernetes"],
      "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "CI/CD (Jenkins/GitHub Actions)", "AWS", "Bash/Shell", "Git"],
      "Site Reliability Engineer (SRE)": ["Linux", "Python/Go", "Kubernetes", "Monitoring (Prometheus/Grafana)", "Networking"],
      "Database Administrator (DBA)": ["SQL", "PostgreSQL", "MySQL", "MongoDB", "Database Design", "Performance Tuning"],
      "Cybersecurity Analyst": ["Networking", "Linux", "Wireshark", "Cryptography", "OWASP", "Bash"],
      "Penetration Tester / Ethical Hacker": ["Kali Linux", "Burp Suite", "Metasploit", "Networking", "Python", "Web Security"],
      "Security Operations (SOC) Analyst": ["SIEM Tools", "Networking", "Incident Response", "Linux", "Log Analysis"],
      "Game Developer": ["C#", "Unity", "Unreal Engine (C++)", "3D Math", "Physics Engines", "Blender"],
      "Blockchain / Web3 Developer": ["Solidity", "Ethereum", "Smart Contracts", "JavaScript", "Web3.js", "Cryptography"],
      "Embedded Software Engineer": ["C", "C++", "Microcontrollers", "RTOS", "Assembly", "Hardware Interfacing"],
      "AR/VR Developer": ["Unity", "C#", "3D Modeling", "ARKit/ARCore", "Spatial Computing"],
      "Technical Writer": ["Markdown", "Documentation Tools", "Git", "API Documentation", "English Communication"],
      "QA / Test Automation Engineer": ["Selenium", "Python/Java", "Postman", "JIRA", "CI/CD Basics", "SQL"],
    },
    generalSkills: ["C/C++", "Python", "Java", "Git", "DSA (Data Structures & Algorithms)", "SQL", "Basic Linux", "Problem Solving"],
  },

  // ──────────────────────────────────────────────
  // 2. Electronics & Communication (ENTC/ECE)
  // ──────────────────────────────────────────────
  {
    id: "entc-ece",
    title: "Electronics & Communication (ENTC/ECE)",
    description: "Design circuits, build embedded systems, and power the connected world.",
    iconKey: "Cpu",
    roleCategories: [
      {
        category: "Core Hardware",
        roles: [
          "VLSI / Chip Design Engineer",
          "Embedded Systems Engineer",
          "PCB Design Engineer",
          "FPGA Developer",
          "Hardware Test / Validation Engineer",
        ],
      },
      {
        category: "Communication & Networking",
        roles: [
          "RF / Microwave Engineer",
          "Telecommunications Engineer",
          "Network Engineer",
          "Signal Processing Engineer",
        ],
      },
      {
        category: "Emerging Tech",
        roles: [
          "IoT Solutions Engineer",
          "Robotics Engineer (Electronics Focus)",
          "Automotive Electronics Engineer",
        ],
      },
    ],
    roleSkillMap: {
      "VLSI / Chip Design Engineer": ["Verilog", "VHDL", "Cadence/Synopsys Tools", "Digital Electronics", "CMOS Design", "MATLAB"],
      "Embedded Systems Engineer": ["C", "C++", "Microcontrollers (Arduino, STM32, PIC)", "RTOS", "I2C/SPI/UART", "Debugging"],
      "PCB Design Engineer": ["Altium Designer", "Eagle", "KiCAD", "Circuit Analysis", "Soldering", "Prototyping"],
      "FPGA Developer": ["Verilog", "VHDL", "Xilinx/Intel FPGAs", "Digital Logic", "Timing Analysis"],
      "Hardware Test / Validation Engineer": ["Oscilloscopes", "Logic Analyzers", "Test Automation", "Lab Equipment", "Python Scripting"],
      "RF / Microwave Engineer": ["Antenna Design", "HFSS", "ADS", "Electromagnetic Theory", "Smith Charts"],
      "Telecommunications Engineer": ["4G/5G Protocols", "Networking", "Signal Processing", "MATLAB", "Wireless Standards"],
      "Network Engineer": ["TCP/IP", "Cisco (CCNA)", "Routing & Switching", "Firewalls", "Linux Networking"],
      "Signal Processing Engineer": ["MATLAB", "DSP Algorithms", "FFT", "Filter Design", "Python (SciPy)"],
      "IoT Solutions Engineer": ["Arduino", "Raspberry Pi", "MQTT", "Cloud (AWS IoT)", "Python", "Sensor Interfacing"],
      "Robotics Engineer (Electronics Focus)": ["ROS", "C++", "Python", "Sensor Fusion", "Control Systems", "MATLAB"],
      "Automotive Electronics Engineer": ["CAN Bus", "AUTOSAR", "MATLAB/Simulink", "Embedded C", "Vehicle Diagnostics"],
    },
    generalSkills: ["Basic Electronics", "C Programming", "Digital Logic", "MATLAB", "Circuit Analysis", "Arduino", "Math (Signals)"],
  },

  // ──────────────────────────────────────────────
  // 3. Mechanical & Automobile
  // ──────────────────────────────────────────────
  {
    id: "mechanical",
    title: "Mechanical & Automobile",
    description: "Design, analyze, and manufacture the machines that move the world.",
    iconKey: "Settings",
    roleCategories: [
      {
        category: "Design & Analysis",
        roles: [
          "Mechanical Design Engineer",
          "CAD/CAE Engineer",
          "Finite Element Analysis (FEA) Engineer",
          "Product Design Engineer",
        ],
      },
      {
        category: "Thermal & Fluids",
        roles: [
          "HVAC Engineer",
          "Thermal Engineer",
          "CFD (Computational Fluid Dynamics) Engineer",
        ],
      },
      {
        category: "Manufacturing & Operations",
        roles: [
          "Manufacturing / Production Engineer",
          "CNC Programmer / Machinist",
          "Industrial Engineer",
          "Quality Engineer (Six Sigma)",
        ],
      },
      {
        category: "Specialized",
        roles: [
          "Automotive Design Engineer",
          "Aerospace Engineer",
          "Robotics Engineer (Mechanical Focus)",
          "Mechatronics Engineer",
          "Piping / Plant Engineer",
        ],
      },
    ],
    roleSkillMap: {
      "Mechanical Design Engineer": ["SolidWorks", "AutoCAD", "CATIA", "GD&T", "Engineering Drawing", "Material Science"],
      "CAD/CAE Engineer": ["SolidWorks", "CATIA", "Creo", "NX", "AutoCAD", "3D Modeling"],
      "Finite Element Analysis (FEA) Engineer": ["ANSYS", "Abaqus", "HyperMesh", "SolidWorks Simulation", "Math (Mechanics)"],
      "Product Design Engineer": ["SolidWorks", "Fusion 360", "Prototyping", "DFM", "3D Printing", "Sketching"],
      "HVAC Engineer": ["Carrier HAP", "AutoCAD MEP", "Psychrometrics", "Thermodynamics", "Load Calculations"],
      "Thermal Engineer": ["ANSYS Thermal", "MATLAB", "Heat Transfer", "Thermodynamics", "CFD Basics"],
      "CFD (Computational Fluid Dynamics) Engineer": ["ANSYS Fluent", "OpenFOAM", "MATLAB", "Fluid Mechanics", "Meshing"],
      "Manufacturing / Production Engineer": ["Lean Manufacturing", "CNC", "SolidWorks", "GD&T", "Process Planning"],
      "CNC Programmer / Machinist": ["G-Code/M-Code", "Mastercam", "SolidWorks CAM", "Machine Setup"],
      "Industrial Engineer": ["Lean/Six Sigma", "Time Study", "Excel", "Operations Research", "ERP Systems"],
      "Quality Engineer (Six Sigma)": ["Six Sigma", "SPC", "FMEA", "ISO Standards", "Root Cause Analysis", "Minitab"],
      "Automotive Design Engineer": ["CATIA", "SolidWorks", "Vehicle Dynamics", "Powertrain Basics", "MATLAB"],
      "Aerospace Engineer": ["CATIA", "ANSYS", "MATLAB", "Aerodynamics", "Flight Mechanics", "Composites"],
      "Robotics Engineer (Mechanical Focus)": ["MATLAB/Simulink", "ROS", "Python", "Kinematics", "Control Systems", "SolidWorks"],
      "Mechatronics Engineer": ["Arduino", "MATLAB", "PLC Programming", "Sensors & Actuators", "C/C++"],
      "Piping / Plant Engineer": ["AutoCAD Plant 3D", "CAESAR II", "Piping Standards", "P&ID Reading"],
    },
    generalSkills: ["Engineering Drawing", "AutoCAD", "SolidWorks Basics", "MATLAB", "Thermodynamics", "Mechanics", "Workshop Skills"],
  },

  // ──────────────────────────────────────────────
  // 4. Civil & Structural
  // ──────────────────────────────────────────────
  {
    id: "civil",
    title: "Civil & Structural",
    description: "Plan, design, and build the infrastructure that shapes cities.",
    iconKey: "Building",
    roleCategories: [
      {
        category: "Structural & Design",
        roles: [
          "Structural Engineer",
          "BIM Manager",
        ],
      },
      {
        category: "Construction & Management",
        roles: [
          "Construction / Project Manager",
          "Quantity Surveyor / Estimator",
        ],
      },
      {
        category: "Specialized Fields",
        roles: [
          "Highway / Transportation Engineer",
          "Geotechnical Engineer",
          "Water Resources / Hydrology Engineer",
          "Environmental Engineer",
          "Urban Planner",
        ],
      },
    ],
    roleSkillMap: {
      "Structural Engineer": ["STAAD.Pro", "ETABS", "SAP2000", "AutoCAD", "RCC Design", "Steel Design"],
      "BIM Manager": ["Revit", "Navisworks", "BIM 360", "Clash Detection", "IFC Standards"],
      "Construction / Project Manager": ["Primavera P6", "MS Project", "Cost Estimation", "Contract Management", "Safety Standards"],
      "Quantity Surveyor / Estimator": ["Cost Estimation", "BOQ", "Tendering", "MS Excel", "Measurement Standards"],
      "Highway / Transportation Engineer": ["AutoCAD Civil 3D", "Road Design", "Traffic Engineering", "Surveying", "GIS"],
      "Geotechnical Engineer": ["Soil Mechanics", "Foundation Design", "PLAXIS", "Lab Testing", "Geology"],
      "Water Resources / Hydrology Engineer": ["HEC-RAS", "EPANET", "Hydrology", "Irrigation Design", "GIS"],
      "Environmental Engineer": ["Environmental Impact Assessment", "Waste Management", "Water Treatment", "GIS"],
      "Urban Planner": ["GIS (ArcGIS)", "AutoCAD", "Urban Design Principles", "Policy", "Demographics"],
    },
    generalSkills: ["AutoCAD", "Surveying", "Building Materials", "Concrete Technology", "Soil Mechanics", "Excel", "Engineering Drawing"],
  },

  // ──────────────────────────────────────────────
  // 5. Electrical Engineering
  // ──────────────────────────────────────────────
  {
    id: "electrical",
    title: "Electrical Engineering",
    description: "Power the world with circuits, energy systems, and automation.",
    iconKey: "Zap",
    roleCategories: [
      {
        category: "Power & Energy",
        roles: [
          "Power Systems Engineer",
          "Renewable Energy / Solar Engineer",
          "High Voltage Engineer",
          "Power Electronics Engineer",
        ],
      },
      {
        category: "Control & Automation",
        roles: [
          "Control Systems Engineer",
          "Automation / PLC Engineer",
          "Instrumentation Engineer",
        ],
      },
      {
        category: "Design & Emerging",
        roles: [
          "Electrical Design Engineer",
          "EV (Electric Vehicle) Engineer",
        ],
      },
    ],
    roleSkillMap: {
      "Power Systems Engineer": ["ETAP", "PSCAD", "Power System Analysis", "Protection", "MATLAB"],
      "Renewable Energy / Solar Engineer": ["PVSyst", "HOMER", "Solar Design", "Grid Integration", "Energy Storage"],
      "High Voltage Engineer": ["Insulation Testing", "Switchgear", "Transformers", "Safety Standards"],
      "Power Electronics Engineer": ["Converter Design", "MATLAB/Simulink", "IGBT/MOSFET", "PCB", "Circuit Simulation"],
      "Control Systems Engineer": ["MATLAB/Simulink", "PID Controllers", "State-Space", "Transfer Functions"],
      "Automation / PLC Engineer": ["PLC (Siemens/Allen-Bradley)", "Ladder Logic", "HMI", "SCADA", "Industrial Networking"],
      "Instrumentation Engineer": ["SCADA", "DCS", "Calibration", "P&ID", "Process Control"],
      "Electrical Design Engineer": ["AutoCAD Electrical", "EPLAN", "Panel Design", "Wiring", "Electrical Codes"],
      "EV (Electric Vehicle) Engineer": ["Battery Management Systems", "MATLAB/Simulink", "Power Electronics", "Motor Drives"],
    },
    generalSkills: ["Circuit Analysis", "Electrical Machines", "MATLAB", "Power Systems Basics", "Electronics", "Math"],
  },

  // ──────────────────────────────────────────────
  // 6. Chemical & Biotech
  // ──────────────────────────────────────────────
  {
    id: "chem-biotech",
    title: "Chemical & Biotech",
    description: "Innovate with chemistry, biology, and process engineering.",
    iconKey: "FlaskConical",
    roleCategories: [
      {
        category: "Process & Plant",
        roles: [
          "Process Engineer",
          "Chemical Plant Engineer",
          "Piping / Plant Engineer",
        ],
      },
      {
        category: "Bio & Pharma",
        roles: [
          "Biochemical Engineer",
          "Pharmaceutical Engineer",
          "Bioinformatician",
          "Food Processing Engineer",
        ],
      },
      {
        category: "Quality, Safety & Materials",
        roles: [
          "Quality Control / Assurance Manager",
          "Environmental / Safety Engineer",
          "Materials Scientist",
          "Polymer Engineer",
        ],
      },
    ],
    roleSkillMap: {
      "Process Engineer": ["Aspen Plus", "HYSYS", "P&ID", "Mass & Energy Balance", "Process Control"],
      "Chemical Plant Engineer": ["AutoCAD", "Piping Design", "HAZOP", "Process Safety", "Equipment Sizing"],
      "Piping / Plant Engineer": ["AutoCAD Plant 3D", "CAESAR II", "Piping Standards", "P&ID Reading"],
      "Biochemical Engineer": ["Biochemistry", "Fermentation", "Downstream Processing", "MATLAB", "Lab Techniques"],
      "Pharmaceutical Engineer": ["GMP", "Regulatory Affairs (FDA/WHO)", "Validation", "Quality Systems", "Pharma Chemistry"],
      "Bioinformatician": ["Python", "R", "BLAST", "Biopython", "Genomics", "Statistics", "Machine Learning"],
      "Food Processing Engineer": ["Food Safety (HACCP)", "Microbiology", "Process Engineering", "Quality Testing"],
      "Quality Control / Assurance Manager": ["ISO Standards", "SPC", "LIMS", "Analytical Instruments (HPLC/GC)", "Six Sigma"],
      "Environmental / Safety Engineer": ["EIA", "Waste Management", "HAZOP", "Environmental Regulations", "Safety Audits"],
      "Materials Scientist": ["Material Characterization (XRD, SEM)", "COMSOL", "Polymer Science", "Metallurgy"],
      "Polymer Engineer": ["Polymer Processing", "Material Testing", "Rheology", "Mold Design", "AutoCAD"],
    },
    generalSkills: ["Chemistry Fundamentals", "Lab Techniques", "Mass Transfer", "Thermodynamics", "MATLAB", "Excel", "Basic Safety"],
  },

  // ──────────────────────────────────────────────
  // 7. Business & Management
  // ──────────────────────────────────────────────
  {
    id: "business",
    title: "Business & Management",
    description: "Lead strategies, analyze markets, and grow organizations.",
    iconKey: "Briefcase",
    roleCategories: [
      {
        category: "Analytics & Data",
        roles: [
          "Business Analyst",
          "Data Analyst",
          "Operations Analyst",
        ],
      },
      {
        category: "Product & Tech",
        roles: [
          "Product Manager",
          "Technical Program Manager (TPM)",
          "Scrum Master / Agile Coach",
        ],
      },
      {
        category: "Marketing & Growth",
        roles: [
          "Digital Marketing Manager",
          "SEO / Content Strategist",
          "Social Media Manager",
          "Growth Hacker",
        ],
      },
      {
        category: "Finance & Strategy",
        roles: [
          "Financial Analyst",
          "Management Consultant",
          "Investment Banking Analyst",
        ],
      },
      {
        category: "Operations & People",
        roles: [
          "Supply Chain Manager",
          "Operations Manager",
          "HR Manager / People Ops",
        ],
      },
      {
        category: "Sales",
        roles: [
          "Sales / Solutions Engineer",
          "Account Manager",
        ],
      },
    ],
    roleSkillMap: {
      "Business Analyst": ["Excel", "SQL", "Requirements Gathering", "Data Visualization", "JIRA", "UML"],
      "Data Analyst": ["Excel", "SQL", "Python", "Tableau", "PowerBI", "Statistics", "Google Analytics"],
      "Operations Analyst": ["Excel", "SQL", "Process Mapping", "Lean/Six Sigma", "ERP Systems"],
      "Product Manager": ["Product Strategy", "Roadmapping", "JIRA", "User Research", "Wireframing (Figma)", "SQL"],
      "Technical Program Manager (TPM)": ["Agile/Scrum", "JIRA", "Stakeholder Management", "Risk Analysis", "Technical Documentation"],
      "Scrum Master / Agile Coach": ["Agile Frameworks", "JIRA", "Facilitation", "Conflict Resolution", "Kanban"],
      "Digital Marketing Manager": ["Google Ads", "Facebook Ads", "SEO", "Analytics", "Content Strategy", "Email Marketing"],
      "SEO / Content Strategist": ["SEO Tools (Ahrefs, SEMrush)", "Content Writing", "Google Analytics", "Keyword Research"],
      "Social Media Manager": ["Content Creation", "Social Platforms", "Analytics", "Scheduling Tools", "Canva"],
      "Growth Hacker": ["A/B Testing", "Analytics", "Funnel Optimization", "SQL", "Python", "Marketing Automation"],
      "Financial Analyst": ["Financial Modeling", "Excel (Advanced)", "Valuation", "Accounting", "Bloomberg Terminal"],
      "Management Consultant": ["PowerPoint", "Excel", "Market Research", "Case Frameworks", "Communication"],
      "Investment Banking Analyst": ["Financial Modeling", "Valuation", "Excel", "Accounting", "DCF", "Pitchbooks"],
      "Supply Chain Manager": ["SAP/ERP", "Inventory Management", "Logistics", "Excel", "Demand Forecasting"],
      "Operations Manager": ["Lean/Six Sigma", "Process Optimization", "ERP", "Excel", "KPI Dashboards"],
      "HR Manager / People Ops": ["Recruitment Tools (ATS)", "Excel", "Employee Engagement", "HRIS", "Labor Laws"],
      "Sales / Solutions Engineer": ["CRM (Salesforce)", "Product Knowledge", "Communication", "Demo Skills", "Technical Concepts"],
      "Account Manager": ["CRM", "Negotiation", "Client Communication", "Excel", "Presentation Skills"],
    },
    generalSkills: ["Excel", "Communication Skills", "Basic Finance", "Business Writing", "PowerPoint", "Critical Thinking"],
  },
];

// --------------- "Not Decided" Constant ---------------

export const NOT_DECIDED_ROLE = "Not Decided / Exploring";

// --------------- Timeline Options ---------------

export const timelineOptions = [
  { value: "1-month", label: "1 Month (Crash Course / Quick Prep)" },
  { value: "3-months", label: "3 Months (Quarterly Goal / Internship Prep)" },
  { value: "6-months", label: "6 Months (Semester Goal)" },
  { value: "1-year", label: "1 Year (Annual Growth)" },
  { value: "1.5-years", label: "1.5 Years (Pre-Placement Prep)" },
  { value: "2-years", label: "2 Years (Mid-Degree Specialization)" },
  { value: "3-years", label: "3 Years (Long-Term Mastery)" },
  { value: "4-years", label: "4 Years (Full Degree Roadmap)" },
];

// --------------- Short-Term Goals ---------------

export const shortTermGoals = [
  "Get a summer/winter internship",
  "Build 3+ portfolio-worthy projects",
  "Master a specific language or tool",
  "Crack campus placements / off-campus job",
  "Clear GATE / GRE / CAT exam",
  "Clear a professional certification (AWS, PMP, Six Sigma, etc.)",
  "Publish a research paper / attend a conference",
  "Win a hackathon / coding competition",
  "Get open-source contributions (GSoC, etc.)",
  "Start a freelancing career",
  "Build and launch my own startup / side project",
  "Prepare for higher studies (MS/MBA)",
  "Improve communication & soft skills",
  "General upskilling / stay industry-relevant",
];

// --------------- Weekly Commitment Options ---------------

export const weeklyCommitmentOptions = [
  { value: "1-3", label: "1–3 hours/week" },
  { value: "3-5", label: "3–5 hours/week" },
  { value: "5-10", label: "5–10 hours/week" },
  { value: "10+", label: "10+ hours/week" },
];

// --------------- Current Level Options ---------------

export const currentLevelOptions = [
  { value: "beginner", label: "Beginner (Just starting out)" },
  { value: "intermediate", label: "Intermediate (Know basics, building projects)" },
  { value: "advanced", label: "Advanced (Preparing for internships/placements)" },
];

// --------------- Helper Functions ---------------

/** Get a branch by its id */
export function getBranchById(id: string): BranchData | undefined {
  return branches.find((b) => b.id === id);
}

/** Get all flat roles for a branch (excludes "Not Decided") */
export function getAllRolesForBranch(branch: BranchData): string[] {
  return branch.roleCategories.flatMap((cat) => cat.roles);
}

/** Get skills for a specific role within a branch. Falls back to generalSkills. */
export function getSkillsForRole(branch: BranchData, role: string): string[] {
  if (role === NOT_DECIDED_ROLE || !branch.roleSkillMap[role]) {
    return branch.generalSkills;
  }
  return branch.roleSkillMap[role];
}

// ============================================================
// LEGACY EXPORT — kept for backward compatibility with Roadmap.tsx
// DO NOT REMOVE until Roadmap.tsx is migrated to use the new data.
// ============================================================

export interface DomainMatrixEntry {
  title: string;
  description: string;
  roles: string[];
  skills: string[];
}

export const domainMatrix: Record<string, DomainMatrixEntry> = {
  "Software & AI": {
    title: "Software & AI",
    description: "Build the future with code, data, and intelligent systems.",
    roles: [
      "Frontend Developer", "Backend Developer", "Full Stack Developer",
      "AI/ML Engineer", "Data Scientist", "Cybersecurity Analyst", "Mobile App Developer",
    ],
    skills: ["HTML/CSS", "JavaScript/TypeScript", "Python", "React", "Node.js", "SQL", "Java", "C++", "Go"],
  },
  "Core Engineering": {
    title: "Core Engineering",
    description: "Design and build the physical world around us.",
    roles: [
      "Mechanical Design Engineer", "Structural/Civil Engineer", "Electrical/Power Engineer",
      "Automotive Engineer", "Manufacturing Engineer", "Robotics Engineer",
    ],
    skills: ["AutoCAD", "SolidWorks", "MATLAB", "ANSYS", "Revit", "PLC Programming", "C"],
  },
  "Design & Product": {
    title: "Design & Product",
    description: "Craft beautiful user experiences and guide product vision.",
    roles: ["UI/UX Designer", "Product Manager", "Graphic Designer", "UX Researcher", "3D Modeler"],
    skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator", "Blender", "Wireframing", "User Research"],
  },
  "Business & Management": {
    title: "Business & Management",
    description: "Lead strategies, analyze markets, and grow organizations.",
    roles: [
      "Business Analyst", "Digital Marketing Specialist", "Financial Analyst",
      "Operations Manager", "Sales Engineer",
    ],
    skills: ["Excel", "Data Analysis", "Digital Marketing", "SEO", "Financial Modeling", "CRM"],
  },
};
