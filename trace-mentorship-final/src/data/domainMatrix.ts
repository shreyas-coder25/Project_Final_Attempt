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
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "AI/ML Engineer",
      "Data Scientist",
      "Cybersecurity Analyst",
      "Mobile App Developer",
    ],
    skills: [
      "HTML/CSS",
      "JavaScript/TypeScript",
      "Python",
      "React",
      "Node.js",
      "SQL",
      "Java",
      "C++",
      "Go",
    ],
  },
  "Core Engineering": {
    title: "Core Engineering",
    description: "Design and build the physical world around us.",
    roles: [
      "Mechanical Design Engineer",
      "Structural/Civil Engineer",
      "Electrical/Power Engineer",
      "Automotive Engineer",
      "Manufacturing Engineer",
      "Robotics Engineer",
    ],
    skills: [
      "AutoCAD",
      "SolidWorks",
      "MATLAB",
      "ANSYS",
      "Revit",
      "PLC Programming",
      "C",
    ],
  },
  "Design & Product": {
    title: "Design & Product",
    description: "Craft beautiful user experiences and guide product vision.",
    roles: [
      "UI/UX Designer",
      "Product Manager",
      "Graphic Designer",
      "UX Researcher",
      "3D Modeler",
    ],
    skills: [
      "Figma",
      "Adobe XD",
      "Photoshop",
      "Illustrator",
      "Blender",
      "Wireframing",
      "User Research",
    ],
  },
  "Business & Management": {
    title: "Business & Management",
    description: "Lead strategies, analyze markets, and grow organizations.",
    roles: [
      "Business Analyst",
      "Digital Marketing Specialist",
      "Financial Analyst",
      "Operations Manager",
      "Sales Engineer",
    ],
    skills: [
      "Excel",
      "Data Analysis",
      "Digital Marketing",
      "SEO",
      "Financial Modeling",
      "CRM",
    ],
  },
};
