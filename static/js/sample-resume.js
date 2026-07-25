const SAMPLE_RESUME = {
  id: "sample",
  personalInfo: {
    fullName: "Morgan Reyes",
    jobTitle: "Senior Software Engineer",
    email: "morgan.reyes@example.com",
    phone: "(555) 123-4567",
    address: "Seattle, WA",
    linkedin: "linkedin.com/in/morganreyes",
    github: "github.com/morganreyes",
    portfolio: "morganreyes.dev",
  },
  summary:
    "Senior software engineer with 8 years of experience building scalable web applications and leading cross-functional teams. Specializes in React, Node.js, and cloud infrastructure, with a track record of shipping products that improve conversion and reduce latency.",
  experience: [
    {
      id: "exp-1",
      company: "Northwind Analytics",
      position: "Senior Software Engineer",
      startDate: "Jan 2022",
      isCurrent: true,
      achievements: [
        "Led migration of core platform to a microservices architecture, reducing average response time by 45%",
        "Mentored a team of 4 engineers, establishing code review standards adopted company-wide",
        "Designed a real-time analytics pipeline processing 2M+ events per day",
      ],
    },
    {
      id: "exp-2",
      company: "Bluecrest Software",
      position: "Software Engineer",
      startDate: "Jun 2018",
      endDate: "Dec 2021",
      isCurrent: false,
      achievements: [
        "Built and shipped a customer-facing dashboard used by 50,000+ monthly active users",
        "Reduced CI/CD pipeline runtime by 60% through build caching and parallelization",
        "Implemented automated testing suite that cut regression bugs by 35%",
      ],
    },
  ],
  education: [
    { id: "edu-1", school: "University of Washington", degree: "B.S.", field: "Computer Science", startDate: "2014", endDate: "2018" },
  ],
  skills: [
    { id: "sk-1", name: "React", category: "framework" },
    { id: "sk-2", name: "TypeScript", category: "technical" },
    { id: "sk-3", name: "Node.js", category: "framework" },
    { id: "sk-4", name: "PostgreSQL", category: "technical" },
    { id: "sk-5", name: "AWS", category: "tool" },
    { id: "sk-6", name: "System Design", category: "technical" },
    { id: "sk-7", name: "Team Leadership", category: "soft" },
    { id: "sk-8", name: "Spanish", category: "language" },
  ],
  projects: [
    {
      id: "proj-1",
      title: "OpenMetrics Dashboard",
      description: "Open-source real-time metrics dashboard with customizable widgets, used by 500+ GitHub stargazers.",
      technologies: ["React", "TypeScript", "WebSockets"],
      githubUrl: "github.com/morganreyes/openmetrics",
    },
    {
      id: "proj-2",
      title: "Recipe Finder API",
      description: "Public REST API for recipe search and meal planning, serving 10K+ requests/day.",
      technologies: ["Node.js", "PostgreSQL", "Redis"],
      liveUrl: "recipefinder.example.com",
    },
  ],
  certifications: [
    { id: "cert-1", name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", issueDate: "2023" },
  ],
  awards: [
    { id: "award-1", title: "Engineering Excellence Award", issuer: "Northwind Analytics", date: "2023", description: "Awarded for leading the platform migration initiative." },
  ],
  volunteer: [],
  publications: [],
  interests: ["Rock climbing", "Photography", "Open source"],
  references: [],
  customSections: [],
  sectionOrder: ["summary", "experience", "education", "skills", "projects", "certifications", "awards", "interests"],
};

function cloneSampleResume() {
  return JSON.parse(JSON.stringify(SAMPLE_RESUME));
}
