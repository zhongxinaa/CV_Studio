const FIXED_SECTION_LABELS = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
  volunteer: "Volunteer",
  publications: "Publications",
  interests: "Interests",
  references: "References",
};

function getSectionLabel(key, customSections) {
  if (key.startsWith("custom:")) {
    const id = key.slice("custom:".length);
    const section = customSections.find((s) => s.id === id);
    return section ? section.title : "Custom Section";
  }
  return FIXED_SECTION_LABELS[key] || key;
}

function sectionAnchorId(key) {
  return `section-${key.replace(":", "-")}`;
}

const UPDATE_FN = {
  experience: (id, patch) => builderStore.updateExperience(id, patch),
  education: (id, patch) => builderStore.updateEducation(id, patch),
  skills: (id, patch) => builderStore.updateSkill(id, patch),
  projects: (id, patch) => builderStore.updateProject(id, patch),
  certifications: (id, patch) => builderStore.updateCertification(id, patch),
  awards: (id, patch) => builderStore.updateAward(id, patch),
  volunteer: (id, patch) => builderStore.updateVolunteer(id, patch),
  publications: (id, patch) => builderStore.updatePublication(id, patch),
  references: (id, patch) => builderStore.updateReference(id, patch),
  custom: (id, patch) => builderStore.updateCustomSection(id, patch),
};
const ADD_FN = {
  experience: builderStore.addExperience,
  education: builderStore.addEducation,
  skills: builderStore.addSkill,
  projects: builderStore.addProject,
  certifications: builderStore.addCertification,
  awards: builderStore.addAward,
  volunteer: builderStore.addVolunteer,
  publications: builderStore.addPublication,
  references: builderStore.addReference,
};
const REMOVE_FN = {
  experience: (id) => builderStore.removeExperience(id),
  education: (id) => builderStore.removeEducation(id),
  skills: (id) => builderStore.removeSkill(id),
  projects: (id) => builderStore.removeProject(id),
  certifications: (id) => builderStore.removeCertification(id),
  awards: (id) => builderStore.removeAward(id),
  volunteer: (id) => builderStore.removeVolunteer(id),
  publications: (id) => builderStore.removePublication(id),
  references: (id) => builderStore.removeReference(id),
};

function field(label, section, id, fieldName, value, opts) {
  opts = opts || {};
  const idAttr = id ? `data-id="${esc(id)}"` : "";
  if (opts.textarea) {
    return `<div class="space-y-1.5">
      <label class="text-sm font-medium">${esc(label)}</label>
      <textarea class="${opts.className || "min-h-20"} w-full rounded-md border px-3 py-2 text-sm" data-section="${section}" ${idAttr} data-field="${fieldName}" placeholder="${esc(opts.placeholder || "")}">${esc(value)}</textarea>
    </div>`;
  }
  return `<div class="space-y-1.5">
    <label class="text-sm font-medium">${esc(label)}</label>
    <input class="w-full rounded-md border px-3 py-2 text-sm" data-section="${section}" ${idAttr} data-field="${fieldName}" value="${esc(value)}" placeholder="${esc(opts.placeholder || "")}" ${opts.disabled ? "disabled" : ""} />
  </div>`;
}

function repeatableSection(sectionKey, items, addLabel, emptyLabel, renderItem) {
  const rows =
    items.length === 0
      ? `<p class="text-muted-foreground text-sm">${esc(emptyLabel)}</p>`
      : items
          .map(
            (item) => `<div class="relative rounded-lg border p-4">
        <button type="button" data-action="remove" data-section="${sectionKey}" data-id="${esc(item.id)}" aria-label="Remove entry" class="absolute top-3 right-3 text-neutral-400 hover:text-red-500">✕</button>
        <div class="pr-8">${renderItem(item)}</div>
      </div>`,
          )
          .join("");
  return `<div class="space-y-4">${rows}
    <button type="button" data-action="add" data-section="${sectionKey}" class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted">+ ${esc(addLabel)}</button>
  </div>`;
}

function renderExperienceItem(exp) {
  return `<div class="space-y-3">
    <div class="grid gap-3 sm:grid-cols-2">
      ${field("Company", "experience", exp.id, "company", exp.company, { placeholder: "Acme Inc." })}
      ${field("Position", "experience", exp.id, "position", exp.position, { placeholder: "Senior Engineer" })}
      ${field("Start date", "experience", exp.id, "startDate", exp.startDate, { placeholder: "Jan 2022" })}
      ${field("End date", "experience", exp.id, "endDate", exp.endDate || "", { placeholder: "Dec 2023", disabled: exp.isCurrent })}
    </div>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" data-section="experience" data-id="${esc(exp.id)}" data-field="isCurrent" ${exp.isCurrent ? "checked" : ""} />
      I currently work here
    </label>
    ${field("Achievements (one per line)", "experience", exp.id, "achievements", exp.achievements.join("\n"), { textarea: true })}
  </div>`;
}

function renderEducationItem(edu) {
  return `<div class="grid gap-3 sm:grid-cols-2">
    ${field("School", "education", edu.id, "school", edu.school, { placeholder: "University of Washington" })}
    ${field("Degree", "education", edu.id, "degree", edu.degree, { placeholder: "B.S." })}
    ${field("Field of study", "education", edu.id, "field", edu.field, { placeholder: "Computer Science" })}
    ${field("Grade / GPA (optional)", "education", edu.id, "grade", edu.grade || "", { placeholder: "3.8" })}
    ${field("Start date", "education", edu.id, "startDate", edu.startDate, { placeholder: "2014" })}
    ${field("End date", "education", edu.id, "endDate", edu.endDate || "", { placeholder: "2018" })}
  </div>`;
}

function renderSkillItem(skill) {
  const categories = ["technical", "soft", "language", "tool", "framework"];
  const labels = { technical: "Technical", soft: "Soft skill", language: "Language", tool: "Tool", framework: "Framework" };
  return `<div class="grid gap-3 sm:grid-cols-2">
    ${field("Skill", "skills", skill.id, "name", skill.name, { placeholder: "React" })}
    <div class="space-y-1.5">
      <label class="text-sm font-medium">Category</label>
      <select class="w-full rounded-md border px-3 py-2 text-sm" data-section="skills" data-id="${esc(skill.id)}" data-field="category">
        ${categories.map((c) => `<option value="${c}" ${skill.category === c ? "selected" : ""}>${labels[c]}</option>`).join("")}
      </select>
    </div>
  </div>`;
}

function renderProjectItem(project) {
  return `<div class="space-y-3">
    ${field("Title", "projects", project.id, "title", project.title, { placeholder: "OpenMetrics Dashboard" })}
    ${field("Description", "projects", project.id, "description", project.description, { textarea: true, className: "min-h-16" })}
    ${field("GitHub URL (optional)", "projects", project.id, "githubUrl", project.githubUrl || "")}
    ${field("Live URL (optional)", "projects", project.id, "liveUrl", project.liveUrl || "")}
  </div>`;
}

function renderCertificationItem(cert) {
  return `<div class="grid gap-3 sm:grid-cols-2">
    ${field("Name", "certifications", cert.id, "name", cert.name, { placeholder: "AWS Certified Solutions Architect" })}
    ${field("Issuer", "certifications", cert.id, "issuer", cert.issuer, { placeholder: "Amazon Web Services" })}
    ${field("Issue date", "certifications", cert.id, "issueDate", cert.issueDate, { placeholder: "2023" })}
    ${field("Expiry date (optional)", "certifications", cert.id, "expiryDate", cert.expiryDate || "")}
  </div>`;
}

function renderAwardItem(award) {
  return `<div class="space-y-3">
    <div class="grid gap-3 sm:grid-cols-2">
      ${field("Title", "awards", award.id, "title", award.title, { placeholder: "Engineering Excellence Award" })}
      ${field("Issuer", "awards", award.id, "issuer", award.issuer, { placeholder: "Northwind Analytics" })}
      ${field("Date", "awards", award.id, "date", award.date, { placeholder: "2023" })}
    </div>
    ${field("Description (optional)", "awards", award.id, "description", award.description || "", { textarea: true, className: "min-h-16" })}
  </div>`;
}

function renderVolunteerItem(entry) {
  return `<div class="space-y-3">
    <div class="grid gap-3 sm:grid-cols-2">
      ${field("Organization", "volunteer", entry.id, "organization", entry.organization)}
      ${field("Role", "volunteer", entry.id, "role", entry.role)}
      ${field("Start date", "volunteer", entry.id, "startDate", entry.startDate)}
      ${field("End date", "volunteer", entry.id, "endDate", entry.endDate || "")}
    </div>
    ${field("Description (optional)", "volunteer", entry.id, "description", entry.description || "", { textarea: true, className: "min-h-16" })}
  </div>`;
}

function renderPublicationItem(pub) {
  return `<div class="space-y-3">
    <div class="grid gap-3 sm:grid-cols-2">
      ${field("Title", "publications", pub.id, "title", pub.title)}
      ${field("Publisher", "publications", pub.id, "publisher", pub.publisher)}
      ${field("Date", "publications", pub.id, "date", pub.date)}
      ${field("URL (optional)", "publications", pub.id, "url", pub.url || "")}
    </div>
    ${field("Description (optional)", "publications", pub.id, "description", pub.description || "", { textarea: true, className: "min-h-16" })}
  </div>`;
}

function renderReferenceItem(ref) {
  return `<div class="grid gap-3 sm:grid-cols-2">
    ${field("Name", "references", ref.id, "name", ref.name)}
    ${field("Relationship", "references", ref.id, "relationship", ref.relationship)}
    ${field("Contact info", "references", ref.id, "contactInfo", ref.contactInfo)}
  </div>`;
}

const SECTION_EDITORS = {
  experience: (resume) => repeatableSection("experience", resume.experience, "Add experience", "No experience added yet.", renderExperienceItem),
  education: (resume) => repeatableSection("education", resume.education, "Add education", "No education added yet.", renderEducationItem),
  skills: (resume) => repeatableSection("skills", resume.skills, "Add skill", "No skills added yet.", renderSkillItem),
  projects: (resume) => repeatableSection("projects", resume.projects, "Add project", "No projects added yet.", renderProjectItem),
  certifications: (resume) =>
    repeatableSection("certifications", resume.certifications, "Add certification", "No certifications added yet.", renderCertificationItem),
  awards: (resume) => repeatableSection("awards", resume.awards, "Add award", "No awards added yet.", renderAwardItem),
  volunteer: (resume) =>
    repeatableSection("volunteer", resume.volunteer, "Add volunteer experience", "No volunteer experience added yet.", renderVolunteerItem),
  publications: (resume) =>
    repeatableSection("publications", resume.publications, "Add publication", "No publications added yet.", renderPublicationItem),
  references: (resume) => repeatableSection("references", resume.references, "Add reference", "No references added yet.", renderReferenceItem),
  interests: (resume) =>
    field("Interests (comma separated)", "interests", null, "interests", resume.interests.join(", "), {
      textarea: true,
      className: "min-h-16",
      placeholder: "Rock climbing, Photography, Open source",
    }),
};

function renderCustomSectionEditor(section) {
  return `<div class="space-y-3">
    ${field("Section title", "custom", section.id, "title", section.title)}
    ${field("Content", "custom", section.id, "content", section.content, { textarea: true, className: "min-h-24" })}
  </div>`;
}

function sectionCard(id, title, innerHtml, removeButtonHtml) {
  return `<section id="${id}" class="scroll-mt-20 rounded-xl border p-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold">${esc(title)}</h2>
      ${removeButtonHtml || ""}
    </div>
    ${innerHtml}
  </section>`;
}

function renderPersonalInfoEditor(resume) {
  const p = resume.personalInfo;
  return `<div class="space-y-5">
    <div class="grid gap-4 sm:grid-cols-2">
      ${field("Full name", "personalInfo", null, "fullName", p.fullName, { placeholder: "Jordan Lee" })}
      ${field("Job title", "personalInfo", null, "jobTitle", p.jobTitle, { placeholder: "Product Designer" })}
      ${field("Email", "personalInfo", null, "email", p.email, { placeholder: "jordan@example.com" })}
      ${field("Phone", "personalInfo", null, "phone", p.phone || "", { placeholder: "(555) 123-4567" })}
      ${field("Location", "personalInfo", null, "address", p.address || "", { placeholder: "Seattle, WA" })}
      ${field("LinkedIn", "personalInfo", null, "linkedin", p.linkedin || "", { placeholder: "linkedin.com/in/jordanlee" })}
      ${field("GitHub", "personalInfo", null, "github", p.github || "", { placeholder: "github.com/jordanlee" })}
      ${field("Portfolio / Website", "personalInfo", null, "portfolio", p.portfolio || "", { placeholder: "jordanlee.dev" })}
    </div>
    ${field("Professional summary", "summary", null, "summary", resume.summary || "", { textarea: true, className: "min-h-24", placeholder: "2-3 sentences summarizing your experience and strengths." })}
  </div>`;
}

// ---------- Sidebar ----------

function renderSidebar() {
  const resume = builderStore.getResume();
  const visibleKeys = resume.sectionOrder;
  const hiddenKeys = builderStore.allSectionKeys().filter((k) => !visibleKeys.includes(k));

  const rows = visibleKeys
    .map(
      (key, index) => `<div class="group flex items-center gap-1 rounded-md px-1 hover:bg-muted">
      <button type="button" data-action="jump" data-key="${esc(key)}" class="flex-1 truncate py-1.5 text-left text-sm">${esc(getSectionLabel(key, resume.customSections))}</button>
      <button type="button" data-action="move-up" data-key="${esc(key)}" ${index === 0 ? "disabled" : ""} aria-label="Move section up" class="rounded p-1 text-xs hover:bg-background disabled:opacity-30">▲</button>
      <button type="button" data-action="move-down" data-key="${esc(key)}" ${index === visibleKeys.length - 1 ? "disabled" : ""} aria-label="Move section down" class="rounded p-1 text-xs hover:bg-background disabled:opacity-30">▼</button>
      <button type="button" data-action="hide" data-key="${esc(key)}" aria-label="Hide section" class="rounded p-1 text-xs hover:bg-background">👁</button>
    </div>`,
    )
    .join("");

  const hiddenBlock =
    hiddenKeys.length === 0
      ? ""
      : `<p class="text-muted-foreground mt-4 mb-1 px-2 text-xs font-semibold tracking-wide uppercase">Hidden</p>${hiddenKeys
          .map(
            (key) => `<div class="flex items-center gap-1 rounded-md px-1 opacity-60">
        <span class="flex-1 truncate py-1.5 text-sm">${esc(getSectionLabel(key, resume.customSections))}</span>
        <button type="button" data-action="show" data-key="${esc(key)}" aria-label="Show section" class="rounded p-1 text-xs hover:bg-background">🚫</button>
      </div>`,
          )
          .join("")}`;

  document.getElementById("sidebar-root").innerHTML = `<div class="space-y-1">
    <p class="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wide uppercase">Sections</p>
    <div><button type="button" data-action="jump" data-key="summary" class="hover:bg-muted w-full rounded-md px-2 py-1.5 text-left text-sm font-medium">Personal Info</button></div>
    ${rows}
    ${hiddenBlock}
    <button type="button" data-action="add-custom-section" class="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted">+ Add custom section</button>
  </div>`;
}

// ---------- Editor ----------

function renderEditor() {
  const resume = builderStore.getResume();
  const personalCard = sectionCard(sectionAnchorId("summary"), "Personal Info & Summary", renderPersonalInfoEditor(resume));

  const otherCards = resume.sectionOrder
    .filter((key) => key !== "summary")
    .map((key) => {
      if (key.startsWith("custom:")) {
        const id = key.slice("custom:".length);
        const section = resume.customSections.find((s) => s.id === id);
        if (!section) return "";
        const removeBtn = `<button type="button" data-action="remove-custom-section" data-id="${esc(id)}" aria-label="Remove custom section" class="rounded p-1 text-xs hover:bg-muted">🗑</button>`;
        return sectionCard(sectionAnchorId(key), section.title, renderCustomSectionEditor(section), removeBtn);
      }
      const renderFn = SECTION_EDITORS[key];
      if (!renderFn) return "";
      return sectionCard(sectionAnchorId(key), getSectionLabel(key, resume.customSections), renderFn(resume));
    })
    .join("");

  document.getElementById("editor-root").innerHTML = `<div class="space-y-6">${personalCard}${otherCards}</div>`;
}

// ---------- Preview ----------

function recomputeBuilderPreviewScale() {
  const outer = document.getElementById("builder-preview-outer");
  const frame = document.getElementById("builder-preview-frame");
  const inner = document.getElementById("builder-preview-inner");
  if (!outer || !frame || !inner) return;
  const PAGE_WIDTH = 816;
  const containerWidth = outer.offsetWidth;
  const scale = Math.min(1, containerWidth / PAGE_WIDTH);
  const naturalHeight = inner.scrollHeight;
  frame.style.width = `${PAGE_WIDTH * scale}px`;
  frame.style.height = `${naturalHeight * scale}px`;
  inner.style.width = `${PAGE_WIDTH}px`;
  inner.style.transform = `scale(${scale})`;
  inner.style.transformOrigin = "top left";
}

function renderPreview() {
  const resume = builderStore.getResume();
  const templateId = builderStore.getTemplateId();
  const theme = builderStore.getTheme();

  const select = document.getElementById("builder-template-select");
  if (select && select.value !== templateId) select.value = templateId;

  const swatchesEl = document.getElementById("builder-color-swatches");
  if (swatchesEl) {
    const swatches = ["#4f46e5", "#0f766e", "#be185d", "#78350f", "#171717", "#1d4ed8", "#b91c1c", "#166534"];
    swatchesEl.innerHTML = swatches
      .map(
        (color) =>
          `<button type="button" data-action="set-color" data-color="${color}" aria-label="Use color ${color}" class="flex size-7 items-center justify-center rounded-full" style="background-color:${color}">${
            theme.primaryColor.toLowerCase() === color ? '<span class="text-white text-xs">✓</span>' : ""
          }</button>`,
      )
      .join("");
  }
  const fontEl = document.getElementById("builder-font-options");
  if (fontEl) {
    const fonts = [
      { label: "Sans", value: "sans" },
      { label: "Serif", value: "serif" },
      { label: "Mono", value: "mono" },
    ];
    fontEl.innerHTML = fonts
      .map((f) => {
        const active = theme.fontFamily === f.value;
        const style = active ? "bg-primary text-primary-foreground" : "border hover:bg-muted";
        return `<button type="button" data-action="set-font" data-font="${f.value}" class="rounded-md px-3 py-1.5 text-sm ${style}">${f.label}</button>`;
      })
      .join("");
  }

  const inner = document.getElementById("builder-preview-inner");
  if (inner) {
    inner.innerHTML = renderResumeTemplate(templateId, resume, theme);
    recomputeBuilderPreviewScale();
  }

  const printRoot = document.getElementById("resume-print-root");
  if (printRoot) {
    printRoot.innerHTML = renderResumeTemplate(templateId, resume, theme);
  }
}

// ---------- Event wiring (delegation, bound once) ----------

function parseFieldValue(fieldName, target) {
  if (fieldName === "achievements") return target.value.split("\n");
  if (fieldName === "isCurrent") return target.checked;
  return target.value;
}

function initBuilderEventDelegation() {
  const sidebarRoot = document.getElementById("sidebar-root");
  const editorRoot = document.getElementById("editor-root");

  sidebarRoot.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const key = btn.dataset.key;
    if (action === "jump") {
      document.getElementById(sectionAnchorId(key))?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (action === "move-up") {
      builderStore.moveSectionUp(key);
    } else if (action === "move-down") {
      builderStore.moveSectionDown(key);
    } else if (action === "hide" || action === "show") {
      builderStore.toggleSectionVisibility(key);
    } else if (action === "add-custom-section") {
      builderStore.addCustomSection();
    }
  });

  function handleFieldChange(event) {
    const target = event.target;
    if (!target.matches("[data-field]")) return;
    const section = target.dataset.section;
    const fieldName = target.dataset.field;
    const value = parseFieldValue(fieldName, target);

    if (section === "personalInfo") {
      builderStore.setPersonalInfo({ [fieldName]: value });
    } else if (section === "summary") {
      builderStore.setSummary(value);
    } else if (section === "interests") {
      builderStore.setInterests(value.split(","));
    } else if (section === "custom") {
      builderStore.updateCustomSection(target.dataset.id, { [fieldName]: value });
    } else if (UPDATE_FN[section]) {
      UPDATE_FN[section](target.dataset.id, { [fieldName]: value });
    }
  }

  editorRoot.addEventListener("input", handleFieldChange);
  editorRoot.addEventListener("change", handleFieldChange);

  editorRoot.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const section = btn.dataset.section;
    if (action === "add" && ADD_FN[section]) {
      ADD_FN[section]();
    } else if (action === "remove" && REMOVE_FN[section]) {
      REMOVE_FN[section](btn.dataset.id);
    } else if (action === "remove-custom-section") {
      builderStore.removeCustomSection(btn.dataset.id);
    }
  });
}

function initBuilderPreviewControls() {
  const select = document.getElementById("builder-template-select");
  if (select) {
    select.innerHTML = TEMPLATE_REGISTRY.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
    select.value = builderStore.getTemplateId();
    select.addEventListener("change", () => builderStore.setTemplateId(select.value));
  }

  const previewControls = document.getElementById("builder-preview-controls");
  if (previewControls) {
    previewControls.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "set-color") {
        builderStore.setTheme({ ...builderStore.getTheme(), primaryColor: btn.dataset.color });
      } else if (btn.dataset.action === "set-font") {
        builderStore.setTheme({ ...builderStore.getTheme(), fontFamily: btn.dataset.font });
      }
    });
  }

  new ResizeObserver(recomputeBuilderPreviewScale).observe(document.getElementById("builder-preview-outer"));
}

function initImportButton() {
  const btn = document.getElementById("import-generated-resume-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const generated = loadGeneratedResume();
    if (!generated) {
      showToast("No generated resume found yet. Generate one on the AI Resume Generator page first.", "error");
      return;
    }
    if (builderStore.hasContent()) {
      const confirmed = window.confirm(
        "This will replace your current summary, experience, skills, and projects with the AI-generated draft. Continue?",
      );
      if (!confirmed) return;
    }
    builderStore.importGeneratedContent(generated);
    showToast("Imported the AI-generated resume draft.", "success");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  builderStore.onStructureChange(() => {
    renderSidebar();
    renderEditor();
  });
  builderStore.onContentChange(renderPreview);

  initBuilderEventDelegation();
  initBuilderPreviewControls();
  initImportButton();

  renderSidebar();
  renderEditor();
  renderPreview();
});
