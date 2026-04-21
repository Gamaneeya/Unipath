// ─── Types ──────────────────────────────────────────────────────────────────

export type AccountType = "student" | "university";

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  semester: number;
  skills: string[];
}

export interface Experience {
  id: string;
  title: string;
  role: string;
  description: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  accountType: "personal" | "partner";
  courses: Course[];
  experiences: Experience[];
  skills: string[];
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  avgSalary: string;
  demand: "High" | "Medium" | "Low";
}

export interface SavedRole {
  roleId: string;
  savedAt: string;
  matchHistory: { date: string; percentage: number }[];
  isCustomJD?: boolean;
  customTitle?: string;
  customPercentage?: number;
  customAcquired?: string[];
  customMissing?: string[];
  customRequiredSkills?: string[];
}

export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  roleId: string;
}

export interface SavedProject {
  projectId: string;
  savedAt: string;
  roleId: string;
}

// ─── Job Roles ────────────────────────────────────────────────────────────────

export const JOB_ROLES: JobRole[] = [
  {
    id: "frontend-dev",
    title: "Frontend Developer",
    category: "Engineering",
    description:
      "Build user-facing web interfaces with modern JavaScript frameworks and responsive design principles.",
    requiredSkills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "Git",
      "REST APIs",
      "Responsive Design",
      "Testing",
      "Performance Optimization",
    ],
    avgSalary: "$75,000 – $120,000",
    demand: "High",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    category: "Data",
    description:
      "Analyze complex datasets to generate business insights using SQL, Python, and visualization tools.",
    requiredSkills: [
      "SQL",
      "Python",
      "Excel",
      "Data Visualization",
      "Statistics",
      "Tableau",
      "Power BI",
      "Data Cleaning",
      "Communication",
      "Problem Solving",
    ],
    avgSalary: "$60,000 – $95,000",
    demand: "High",
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    category: "Design",
    description:
      "Design intuitive and delightful user experiences through research, prototyping, and iterative testing.",
    requiredSkills: [
      "Figma",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "Information Architecture",
      "Design Systems",
      "Communication",
      "Adobe XD",
      "Accessibility",
    ],
    avgSalary: "$65,000 – $110,000",
    demand: "High",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Product",
    description:
      "Define product vision, manage roadmaps, and collaborate with cross-functional teams to ship great products.",
    requiredSkills: [
      "Product Strategy",
      "Roadmapping",
      "Agile",
      "Communication",
      "Data Analysis",
      "SQL",
      "Stakeholder Management",
      "User Research",
      "Problem Solving",
      "Prioritization",
    ],
    avgSalary: "$90,000 – $150,000",
    demand: "High",
  },
  {
    id: "backend-dev",
    title: "Backend Developer",
    category: "Engineering",
    description:
      "Design and implement server-side logic, APIs, databases, and infrastructure that power applications.",
    requiredSkills: [
      "Python",
      "Node.js",
      "SQL",
      "REST APIs",
      "Git",
      "Docker",
      "Databases",
      "System Design",
      "Testing",
      "Linux",
    ],
    avgSalary: "$80,000 – $130,000",
    demand: "High",
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Engineering",
    description:
      "Bridge development and operations by automating deployments, managing cloud infrastructure, and improving reliability.",
    requiredSkills: [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Linux",
      "AWS",
      "Terraform",
      "Git",
      "Monitoring",
      "Python",
      "Networking",
    ],
    avgSalary: "$95,000 – $145,000",
    demand: "High",
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data",
    description:
      "Apply machine learning and statistical modeling to solve complex business problems and extract insights from data.",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Statistics",
      "SQL",
      "Data Visualization",
      "Deep Learning",
      "Feature Engineering",
      "Communication",
      "Mathematics",
      "R",
    ],
    avgSalary: "$85,000 – $140,000",
    demand: "High",
  },
  {
    id: "digital-marketer",
    title: "Digital Marketer",
    category: "Marketing",
    description:
      "Drive growth through SEO, paid campaigns, content strategy, and data-driven marketing experiments.",
    requiredSkills: [
      "SEO",
      "Google Analytics",
      "Content Marketing",
      "Social Media",
      "Email Marketing",
      "Communication",
      "Data Analysis",
      "Copywriting",
      "A/B Testing",
      "CRM",
    ],
    avgSalary: "$50,000 – $85,000",
    demand: "Medium",
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    category: "Business",
    description:
      "Translate business requirements into technical solutions by analyzing processes and bridging stakeholders.",
    requiredSkills: [
      "Requirements Gathering",
      "SQL",
      "Excel",
      "Communication",
      "Problem Solving",
      "Process Mapping",
      "Agile",
      "Stakeholder Management",
      "Data Analysis",
      "Documentation",
    ],
    avgSalary: "$65,000 – $100,000",
    demand: "Medium",
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    category: "Security",
    description:
      "Protect organizational systems and data from cyber threats through monitoring, analysis, and incident response.",
    requiredSkills: [
      "Networking",
      "Linux",
      "Security Protocols",
      "Risk Assessment",
      "Incident Response",
      "Python",
      "SIEM",
      "Vulnerability Assessment",
      "Cryptography",
      "Communication",
    ],
    avgSalary: "$75,000 – $120,000",
    demand: "High",
  },
  {
    id: "mobile-developer",
    title: "Mobile Developer",
    category: "Engineering",
    description:
      "Build performant and elegant mobile applications for iOS and Android platforms.",
    requiredSkills: [
      "React Native",
      "JavaScript",
      "TypeScript",
      "REST APIs",
      "Git",
      "Mobile UI Design",
      "Testing",
      "Performance Optimization",
      "App Store Deployment",
      "State Management",
    ],
    avgSalary: "$80,000 – $130,000",
    demand: "High",
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    category: "AI/ML",
    description:
      "Design and deploy production-grade machine learning systems at scale.",
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "MLOps",
      "Docker",
      "SQL",
      "Feature Engineering",
      "Mathematics",
      "Cloud Platforms",
      "REST APIs",
    ],
    avgSalary: "$100,000 – $160,000",
    demand: "High",
  },
];

// ─── Mock Student Profile ─────────────────────────────────────────────────────

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: "student-001",
  name: "Alex Johnson",
  email: "alex.johnson@student.edu",
  university: "Chulalongkorn University",
  accountType: "personal",
  courses: [
    {
      id: "c1",
      code: "CS101",
      name: "Introduction to Programming",
      description:
        "Fundamentals of programming using Python. Covers control flow, functions, data structures, and basic algorithms.",
      semester: 1,
      skills: ["Python", "Problem Solving", "Algorithms"],
    },
    {
      id: "c2",
      code: "CS201",
      name: "Data Structures & Algorithms",
      description:
        "Study of fundamental data structures and algorithm design techniques.",
      semester: 2,
      skills: ["Algorithms", "Problem Solving", "Mathematics"],
    },
    {
      id: "c3",
      code: "CS301",
      name: "Database Systems",
      description:
        "Relational database design, SQL, normalization, and transaction management.",
      semester: 3,
      skills: ["SQL", "Databases", "Data Modeling"],
    },
    {
      id: "c4",
      code: "CS401",
      name: "Web Development",
      description:
        "Full-stack web development covering HTML, CSS, JavaScript, and REST APIs.",
      semester: 4,
      skills: ["HTML", "CSS", "JavaScript", "REST APIs"],
    },
    {
      id: "c5",
      code: "STAT201",
      name: "Statistics for Engineers",
      description:
        "Probability, statistical inference, regression analysis, and hypothesis testing.",
      semester: 3,
      skills: ["Statistics", "Mathematics", "Data Analysis"],
    },
    {
      id: "c6",
      code: "CS501",
      name: "Software Engineering",
      description:
        "Software development lifecycle, version control, testing, and Agile methodologies.",
      semester: 5,
      skills: ["Git", "Testing", "Agile", "Documentation"],
    },
  ],
  experiences: [
    {
      id: "e1",
      title: "Personal Portfolio Website",
      role: "Developer",
      description:
        "Built a personal portfolio using React and Tailwind CSS, deployed on Vercel with CI/CD pipeline.",
    },
    {
      id: "e2",
      title: "Data Analysis Internship",
      role: "Data Analyst Intern",
      description:
        "Analyzed sales data using Python and Excel. Created dashboards in Tableau for weekly reporting.",
    },
  ],
  skills: ["Communication", "Excel", "Data Visualization", "React", "Figma"],
};

// ─── Partner Student Profile (Thammasat University — auto-synced) ─────────────

export const PARTNER_STUDENT_PROFILE: StudentProfile = {
  id: "student-002",
  name: "Priya Sharma",
  email: "priya.sharma@thammasat.ac.th",
  university: "Thammasat University",
  accountType: "partner",
  courses: [
    {
      id: "p-c1",
      code: "CS101",
      name: "Introduction to Programming",
      description: "Python fundamentals — control flow, data structures, and algorithms.",
      semester: 1,
      skills: ["Python", "Algorithms", "Problem Solving"],
    },
    {
      id: "p-c2",
      code: "CS201",
      name: "Data Structures & Algorithms",
      description: "Advanced data structures, sorting algorithms, and complexity analysis.",
      semester: 2,
      skills: ["Algorithms", "Mathematics", "Problem Solving"],
    },
    {
      id: "p-c3",
      code: "CS305",
      name: "Web Engineering",
      description: "Full-stack development with HTML, CSS, JavaScript, React, and REST APIs.",
      semester: 3,
      skills: ["HTML", "CSS", "JavaScript", "React", "REST APIs"],
    },
    {
      id: "p-c4",
      code: "CS310",
      name: "Database Design",
      description: "Relational databases, SQL, normalization, and NoSQL fundamentals.",
      semester: 3,
      skills: ["SQL", "Databases", "Data Modeling"],
    },
    {
      id: "p-c5",
      code: "CS401",
      name: "Human-Computer Interaction",
      description: "UX principles, usability testing, wireframing, and Figma prototyping.",
      semester: 4,
      skills: ["UX Design", "Usability Testing", "Figma", "Prototyping", "User Research"],
    },
    {
      id: "p-c6",
      code: "CS415",
      name: "Machine Learning Foundations",
      description: "Supervised and unsupervised learning, model evaluation, and scikit-learn.",
      semester: 4,
      skills: ["Machine Learning", "Python", "Statistics", "Data Analysis"],
    },
    {
      id: "p-c7",
      code: "BUS301",
      name: "Product Management",
      description: "Product lifecycle, roadmapping, stakeholder management, and Agile delivery.",
      semester: 5,
      skills: ["Product Strategy", "Agile", "Roadmapping", "Stakeholder Management"],
    },
    {
      id: "p-c8",
      code: "STAT301",
      name: "Applied Statistics",
      description: "Statistical inference, regression analysis, A/B testing, and data visualisation.",
      semester: 5,
      skills: ["Statistics", "Data Visualization", "Mathematics", "Excel"],
    },
    {
      id: "p-c9",
      code: "CS510",
      name: "Cloud & DevOps",
      description: "CI/CD pipelines, Docker containers, cloud deployment, and infrastructure as code.",
      semester: 6,
      skills: ["Docker", "CI/CD", "Cloud Platforms", "Git"],
    },
  ],
  experiences: [
    {
      id: "p-e1",
      title: "UX Research Internship — Agoda",
      role: "UX Research Intern",
      description:
        "Conducted 20+ user interviews and synthesised insights into Figma prototypes adopted by the product team.",
    },
    {
      id: "p-e2",
      title: "Thammasat AI Club — President",
      role: "Club President",
      description:
        "Led weekly workshops on ML fundamentals. Organised inter-university datathon with 150+ participants.",
    },
    {
      id: "p-e3",
      title: "Freelance Product Analyst",
      role: "Analyst",
      description:
        "Defined KPIs, built dashboards in Tableau, and delivered weekly reports for a Bangkok-based startup.",
    },
  ],
  skills: ["Figma", "Tableau", "Communication", "Leadership", "TypeScript", "Power BI"],
};

// ─── Project Ideas ────────────────────────────────────────────────────────────

export const PROJECT_IDEAS: ProjectIdea[] = [
  {
    id: "p1",
    title: "Personal Portfolio with React & TypeScript",
    description:
      "Build a fully responsive personal portfolio using React and TypeScript. Include project showcases, a blog section, and a contact form.",
    skills: ["TypeScript", "React"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 weeks",
    roleId: "frontend-dev",
  },
  {
    id: "p2",
    title: "REST API Performance Testing Dashboard",
    description:
      "Create a tool that tests REST API endpoints for performance and reliability. Display latency charts and error rates.",
    skills: ["REST APIs", "Performance Optimization", "Testing"],
    difficulty: "Intermediate",
    estimatedTime: "3-4 weeks",
    roleId: "frontend-dev",
  },
  {
    id: "p3",
    title: "E-commerce Sales Analytics Dashboard",
    description:
      "Ingest a public e-commerce dataset and build interactive Tableau / Power BI dashboards showing revenue trends, top products, and customer segments.",
    skills: ["Tableau", "Power BI", "Data Cleaning"],
    difficulty: "Beginner",
    estimatedTime: "1-2 weeks",
    roleId: "data-analyst",
  },
  {
    id: "p4",
    title: "User Research Report for a Real App",
    description:
      "Conduct 5 usability tests on an existing app, synthesize findings, and create a Figma prototype with improvements.",
    skills: ["User Research", "Usability Testing", "Prototyping"],
    difficulty: "Beginner",
    estimatedTime: "2-3 weeks",
    roleId: "ux-designer",
  },
  {
    id: "p5",
    title: "Machine Learning Price Predictor",
    description:
      "Train a regression model to predict housing prices using a public dataset. Apply feature engineering and compare multiple algorithms.",
    skills: ["Machine Learning", "Feature Engineering", "Deep Learning"],
    difficulty: "Advanced",
    estimatedTime: "4-6 weeks",
    roleId: "data-scientist",
  },
  {
    id: "p6",
    title: "Containerized Microservices App",
    description:
      "Build and deploy a simple microservices application using Docker and Kubernetes on a cloud provider.",
    skills: ["Docker", "Kubernetes", "CI/CD"],
    difficulty: "Advanced",
    estimatedTime: "4-5 weeks",
    roleId: "devops-engineer",
  },
  {
    id: "p7",
    title: "SEO Audit Tool",
    description:
      "Build a web scraper that crawls a site and generates an SEO report with actionable recommendations.",
    skills: ["SEO", "A/B Testing"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 weeks",
    roleId: "digital-marketer",
  },
  {
    id: "p8",
    title: "Network Packet Analyzer",
    description:
      "Build a simple network packet analyzer using Python to capture and analyze traffic patterns.",
    skills: ["Networking", "Security Protocols", "Cryptography"],
    difficulty: "Advanced",
    estimatedTime: "3-4 weeks",
    roleId: "cybersecurity-analyst",
  },
];

// ─── Universities ─────────────────────────────────────────────────────────────

export const PARTNER_UNIVERSITIES = [
  "Chulalongkorn University",
  "Mahidol University",
  "Thammasat University",
  "KMITL",
  "King Mongkut's University",
  "Asian Institute of Technology",
];

// ─── Scoring Utility ──────────────────────────────────────────────────────────

export function calculateStudentSkills(profile: StudentProfile): string[] {
  const courseSkills = profile.courses.flatMap((c) => c.skills);
  const experienceKeywords = profile.experiences.flatMap((e) => {
    const text = `${e.title} ${e.role} ${e.description}`.toLowerCase();
    const detected: string[] = [];
    const skillKeywords: Record<string, string> = {
      react: "React",
      python: "Python",
      sql: "SQL",
      figma: "Figma",
      tableau: "Tableau",
      typescript: "TypeScript",
      docker: "Docker",
      git: "Git",
      agile: "Agile",
      "machine learning": "Machine Learning",
      excel: "Excel",
      "data visualization": "Data Visualization",
      communication: "Communication",
    };
    Object.entries(skillKeywords).forEach(([kw, skill]) => {
      if (text.includes(kw)) detected.push(skill);
    });
    return detected;
  });
  const all = [...courseSkills, ...experienceKeywords, ...profile.skills];
  return [...new Set(all)];
}

export function calculateMatch(
  studentSkills: string[],
  role: JobRole
): { percentage: number; acquired: string[]; missing: string[] } {
  const normalized = studentSkills.map((s) => s.toLowerCase());
  const acquired = role.requiredSkills.filter((s) =>
    normalized.includes(s.toLowerCase())
  );
  const missing = role.requiredSkills.filter(
    (s) => !normalized.includes(s.toLowerCase())
  );
  const percentage = Math.round((acquired.length / role.requiredSkills.length) * 100);
  return { percentage, acquired, missing };
}

// ─── University Portal Mock Data ─────────────────────────────────────────────

export const UNI_MOCK_DATA = {
  enrolledStudents: 1247,
  activeUsers: 892,
  topRoles: [
    { role: "Frontend Developer", count: 312, trend: "+12%" },
    { role: "Data Analyst", count: 278, trend: "+8%" },
    { role: "Product Manager", count: 201, trend: "+22%" },
    { role: "UX Designer", count: 176, trend: "+5%" },
    { role: "Data Scientist", count: 154, trend: "+31%" },
    { role: "Backend Developer", count: 143, trend: "+9%" },
  ],
  highDemandMissingSkills: [
    { skill: "React", demand: 312, coveredByCurriculum: true },
    { skill: "Machine Learning", demand: 287, coveredByCurriculum: false },
    { skill: "TypeScript", demand: 245, coveredByCurriculum: false },
    { skill: "Product Strategy", demand: 201, coveredByCurriculum: false },
    { skill: "Docker", demand: 198, coveredByCurriculum: false },
    { skill: "Figma", demand: 176, coveredByCurriculum: false },
    { skill: "CI/CD", demand: 143, coveredByCurriculum: false },
    { skill: "Tableau", demand: 134, coveredByCurriculum: false },
    { skill: "Kubernetes", demand: 128, coveredByCurriculum: false },
    { skill: "AWS", demand: 122, coveredByCurriculum: false },
    { skill: "Deep Learning", demand: 118, coveredByCurriculum: false },
    { skill: "Python", demand: 315, coveredByCurriculum: true },
    { skill: "SQL", demand: 298, coveredByCurriculum: true },
    { skill: "Node.js", demand: 115, coveredByCurriculum: false },
    { skill: "Power BI", demand: 109, coveredByCurriculum: false },
    { skill: "REST APIs", demand: 188, coveredByCurriculum: true },
    { skill: "Git", demand: 205, coveredByCurriculum: true },
    { skill: "Agile", demand: 167, coveredByCurriculum: true },
    { skill: "System Design", demand: 98, coveredByCurriculum: false },
    { skill: "GraphQL", demand: 87, coveredByCurriculum: false },
  ],
  monthlyActiveUsers: [
    { month: "Sep", users: 420 },
    { month: "Oct", users: 580 },
    { month: "Nov", users: 670 },
    { month: "Dec", users: 520 },
    { month: "Jan", users: 710 },
    { month: "Feb", users: 830 },
    { month: "Mar", users: 892 },
  ],
};