const ACHIEVEMENTS_SECTION_TITLE = "Achievements";
const DEFAULT_SECTION_ORDER = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "awards",
  "volunteer",
  "publications",
  "interests",
  "references",
];

function createId() {
  return "id-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function createBlankResume() {
  return {
    id: createId(),
    personalInfo: { fullName: "", jobTitle: "", email: "" },
    summary: "",
    experience: [{ id: createId(), company: "", position: "", startDate: "", isCurrent: false, achievements: [] }],
    education: [{ id: createId(), school: "", degree: "", field: "", startDate: "" }],
    skills: [],
    projects: [],
    certifications: [],
    awards: [],
    volunteer: [],
    publications: [],
    interests: [],
    references: [],
    customSections: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
  };
}

const builderStore = (function () {
  let resume = createBlankResume();
  let templateId = TEMPLATE_REGISTRY[0].id;
  let theme = { primaryColor: TEMPLATE_REGISTRY[0].defaultColor, fontFamily: "sans" };

  const structureListeners = [];
  const contentListeners = [];

  function notifyContent() {
    contentListeners.forEach((fn) => fn());
  }
  function notifyStructure() {
    structureListeners.forEach((fn) => fn());
    notifyContent();
  }

  function makeListActions(key, createBlankItem) {
    return {
      add() {
        resume[key].push(createBlankItem());
        notifyStructure();
      },
      update(id, patch) {
        const item = resume[key].find((i) => i.id === id);
        if (item) Object.assign(item, patch);
        notifyContent();
      },
      remove(id) {
        resume[key] = resume[key].filter((i) => i.id !== id);
        notifyStructure();
      },
    };
  }

  const experienceActions = makeListActions("experience", () => ({
    id: createId(),
    company: "",
    position: "",
    startDate: "",
    isCurrent: false,
    achievements: [],
  }));
  const educationActions = makeListActions("education", () => ({
    id: createId(),
    school: "",
    degree: "",
    field: "",
    startDate: "",
  }));
  const skillActions = makeListActions("skills", () => ({ id: createId(), name: "", category: "technical" }));
  const projectActions = makeListActions("projects", () => ({
    id: createId(),
    title: "",
    description: "",
    technologies: [],
  }));
  const certificationActions = makeListActions("certifications", () => ({
    id: createId(),
    name: "",
    issuer: "",
    issueDate: "",
  }));
  const awardActions = makeListActions("awards", () => ({ id: createId(), title: "", issuer: "", date: "" }));
  const volunteerActions = makeListActions("volunteer", () => ({
    id: createId(),
    organization: "",
    role: "",
    startDate: "",
  }));
  const publicationActions = makeListActions("publications", () => ({
    id: createId(),
    title: "",
    publisher: "",
    date: "",
  }));
  const referenceActions = makeListActions("references", () => ({
    id: createId(),
    name: "",
    relationship: "",
    contactInfo: "",
  }));

  return {
    getResume: () => resume,
    getTemplateId: () => templateId,
    getTheme: () => theme,
    onStructureChange: (fn) => structureListeners.push(fn),
    onContentChange: (fn) => contentListeners.push(fn),

    setPersonalInfo(patch) {
      Object.assign(resume.personalInfo, patch);
      notifyContent();
    },
    setSummary(summary) {
      resume.summary = summary;
      notifyContent();
    },
    setInterests(interests) {
      resume.interests = interests;
      notifyContent();
    },

    addExperience: experienceActions.add,
    updateExperience: experienceActions.update,
    removeExperience: experienceActions.remove,

    addEducation: educationActions.add,
    updateEducation: educationActions.update,
    removeEducation: educationActions.remove,

    addSkill: skillActions.add,
    updateSkill: skillActions.update,
    removeSkill: skillActions.remove,

    addProject: projectActions.add,
    updateProject: projectActions.update,
    removeProject: projectActions.remove,

    addCertification: certificationActions.add,
    updateCertification: certificationActions.update,
    removeCertification: certificationActions.remove,

    addAward: awardActions.add,
    updateAward: awardActions.update,
    removeAward: awardActions.remove,

    addVolunteer: volunteerActions.add,
    updateVolunteer: volunteerActions.update,
    removeVolunteer: volunteerActions.remove,

    addPublication: publicationActions.add,
    updatePublication: publicationActions.update,
    removePublication: publicationActions.remove,

    addReference: referenceActions.add,
    updateReference: referenceActions.update,
    removeReference: referenceActions.remove,

    addCustomSection() {
      const section = { id: createId(), title: "Custom Section", content: "" };
      resume.customSections.push(section);
      resume.sectionOrder.push(`custom:${section.id}`);
      notifyStructure();
    },
    updateCustomSection(id, patch) {
      const section = resume.customSections.find((s) => s.id === id);
      if (section) Object.assign(section, patch);
      notifyContent();
    },
    removeCustomSection(id) {
      resume.customSections = resume.customSections.filter((s) => s.id !== id);
      resume.sectionOrder = resume.sectionOrder.filter((k) => k !== `custom:${id}`);
      notifyStructure();
    },

    moveSectionUp(key) {
      const order = resume.sectionOrder;
      const index = order.indexOf(key);
      if (index <= 0) return;
      [order[index - 1], order[index]] = [order[index], order[index - 1]];
      notifyStructure();
    },
    moveSectionDown(key) {
      const order = resume.sectionOrder;
      const index = order.indexOf(key);
      if (index === -1 || index >= order.length - 1) return;
      [order[index], order[index + 1]] = [order[index + 1], order[index]];
      notifyStructure();
    },
    toggleSectionVisibility(key) {
      const order = resume.sectionOrder;
      const isVisible = order.includes(key);
      resume.sectionOrder = isVisible ? order.filter((k) => k !== key) : [...order, key];
      notifyStructure();
    },
    isSectionVisible(key) {
      return resume.sectionOrder.includes(key);
    },
    allSectionKeys() {
      return [...DEFAULT_SECTION_ORDER, ...resume.customSections.map((s) => `custom:${s.id}`)];
    },

    setTemplateId(id) {
      templateId = id;
      notifyContent();
    },
    setTheme(nextTheme) {
      theme = nextTheme;
      notifyContent();
    },

    hasContent() {
      return Boolean(
        (resume.summary && resume.summary.trim()) ||
          resume.experience.some((exp) => exp.company || exp.position) ||
          resume.skills.length > 0 ||
          resume.projects.length > 0,
      );
    },

    importGeneratedContent(generated) {
      const experience = generated.experience.map((exp) => ({
        id: createId(),
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: !exp.endDate,
        achievements: exp.achievements,
      }));
      const skills = generated.skills.map((name) => ({ id: createId(), name, category: "technical" }));
      const projects = generated.projects.map((project) => ({
        id: createId(),
        title: project.title,
        description: project.description,
        technologies: [],
      }));

      const existingAchievementsSection = resume.customSections.find((s) => s.title === ACHIEVEMENTS_SECTION_TITLE);
      const achievementsContent = generated.achievements.join("\n");
      let achievementsSectionId;
      if (existingAchievementsSection) {
        existingAchievementsSection.content = achievementsContent;
        achievementsSectionId = existingAchievementsSection.id;
      } else {
        const section = { id: createId(), title: ACHIEVEMENTS_SECTION_TITLE, content: achievementsContent };
        resume.customSections.push(section);
        achievementsSectionId = section.id;
      }

      resume.summary = generated.summary;
      resume.experience = experience;
      resume.skills = skills;
      resume.projects = projects;

      const achievementsKey = `custom:${achievementsSectionId}`;
      if (!resume.sectionOrder.includes(achievementsKey)) {
        resume.sectionOrder.push(achievementsKey);
      }

      notifyStructure();
    },
  };
})();
