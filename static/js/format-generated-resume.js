function formatGeneratedResumeAsText(resume) {
  const sections = [];

  sections.push(`PROFESSIONAL SUMMARY\n${resume.summary}`);

  const experience = resume.experience
    .map((exp) => {
      const dateRange = exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate;
      const bullets = exp.achievements.map((line) => `- ${line}`).join("\n");
      return `${exp.position}, ${exp.company} (${dateRange})\n${bullets}`;
    })
    .join("\n\n");
  sections.push(`EXPERIENCE\n${experience}`);

  sections.push(`SKILLS\n${resume.skills.join(", ")}`);

  const projects = resume.projects.map((p) => `${p.title}: ${p.description}`).join("\n");
  sections.push(`PROJECTS\n${projects}`);

  const achievements = resume.achievements.map((line) => `- ${line}`).join("\n");
  sections.push(`ACHIEVEMENTS\n${achievements}`);

  return sections.join("\n\n");
}
