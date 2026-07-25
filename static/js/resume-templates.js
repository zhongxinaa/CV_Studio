const FONT_STACKS = {
  sans: '"Geist", ui-sans-serif, system-ui, -apple-system, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace',
};

const TEMPLATE_REGISTRY = [
  { id: "modern", name: "Modern", category: "Modern", description: "Bold colored header, icon-led contact line, rounded skill tags.", defaultColor: "#4f46e5" },
  { id: "minimal", name: "Minimal", category: "Minimal", description: "Understated typography, thin rules, generous whitespace.", defaultColor: "#404040" },
  { id: "ats", name: "ATS", category: "ATS", description: "Single column, plain text, no graphics — built to parse cleanly.", defaultColor: "#171717" },
  { id: "executive", name: "Executive", category: "Executive", description: "Centered header, formal rules, conservative and authoritative.", defaultColor: "#78350f" },
  { id: "creative", name: "Creative", category: "Creative", description: "Two-column layout with a colored sidebar for contact and skills.", defaultColor: "#be185d" },
];

function getTemplateById(id) {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}

function esc(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resumePagePaper(theme, innerHtml, extraClass) {
  const style = `--resume-primary:${theme.primaryColor};--resume-font:${FONT_STACKS[theme.fontFamily]};font-family:var(--resume-font);`;
  return `<div class="resume-paper mx-auto shrink-0 text-neutral-900 ${extraClass || ""}" style="${style}">${innerHtml}</div>`;
}

function findCustomSection(resume, key) {
  return resume.customSections.find((s) => `custom:${s.id}` === key);
}

// The Builder pre-seeds one blank experience/education row so the editor
// isn't empty on first load — filter those out of the preview/export until
// the person actually fills something in, instead of showing stray
// punctuation like "." or "in ,".
function nonBlankExperience(resume) {
  return resume.experience.filter((exp) => exp.company || exp.position);
}
function nonBlankEducation(resume) {
  return resume.education.filter((edu) => edu.school || edu.degree || edu.field);
}

// ---------- Modern ----------

function modernSectionHeading(text) {
  return `<h2 class="mb-2 text-xs font-bold tracking-widest uppercase" style="color:var(--resume-primary)">${esc(text)}</h2>`;
}

function renderModernSection(resume, key) {
  switch (key) {
    case "summary":
      if (!resume.summary) return "";
      return `<section class="mb-5">${modernSectionHeading("Summary")}<p class="text-sm leading-relaxed text-neutral-700">${esc(resume.summary)}</p></section>`;
    case "experience": {
      const items = nonBlankExperience(resume);
      if (items.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Experience")}<div class="space-y-4">${items
        .map(
          (exp) => `<div>
          <div class="flex items-baseline justify-between">
            <p class="text-sm font-semibold">${esc(exp.position)} · ${esc(exp.company)}</p>
            <p class="text-xs text-neutral-500">${esc(exp.startDate)} – ${exp.isCurrent ? "Present" : esc(exp.endDate)}</p>
          </div>
          <ul class="mt-1 list-disc space-y-0.5 pl-4 text-sm text-neutral-700">
            ${exp.achievements.filter(Boolean).map((a) => `<li>${esc(a)}</li>`).join("")}
          </ul>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "education": {
      const items = nonBlankEducation(resume);
      if (items.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Education")}<div class="space-y-2">${items
        .map(
          (edu) => `<div class="flex items-baseline justify-between">
          <p class="text-sm font-semibold">${esc(edu.degree)} in ${esc(edu.field)}, ${esc(edu.school)}</p>
          <p class="text-xs text-neutral-500">${esc(edu.startDate)} – ${esc(edu.endDate)}</p>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "skills":
      if (resume.skills.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Skills")}<div class="flex flex-wrap gap-1.5">${resume.skills
        .map(
          (skill) =>
            `<span class="rounded-full px-2.5 py-0.5 text-xs font-medium" style="background-color:color-mix(in srgb, var(--resume-primary) 12%, white);color:var(--resume-primary)">${esc(skill.name)}</span>`,
        )
        .join("")}</div></section>`;
    case "projects":
      if (resume.projects.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Projects")}<div class="space-y-2">${resume.projects
        .map((p) => `<div><p class="text-sm font-semibold">${esc(p.title)}</p><p class="text-sm text-neutral-700">${esc(p.description)}</p></div>`)
        .join("")}</div></section>`;
    case "certifications":
      if (resume.certifications.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Certifications")}${resume.certifications
        .map((c) => `<p class="text-sm text-neutral-700">${esc(c.name)} — ${esc(c.issuer)} (${esc(c.issueDate)})</p>`)
        .join("")}</section>`;
    case "awards":
      if (resume.awards.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Awards")}${resume.awards
        .map((a) => `<p class="text-sm text-neutral-700">${esc(a.title)} — ${esc(a.issuer)} (${esc(a.date)})</p>`)
        .join("")}</section>`;
    case "interests":
      if (resume.interests.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Interests")}<p class="text-sm text-neutral-700">${resume.interests.map(esc).join(" · ")}</p></section>`;
    case "volunteer":
      if (resume.volunteer.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Volunteer Experience")}<div class="space-y-2">${resume.volunteer
        .map(
          (v) => `<div>
          <p class="text-sm font-semibold">${esc(v.role)} · ${esc(v.organization)}</p>
          <p class="text-xs text-neutral-500">${esc(v.startDate)} – ${v.endDate ? esc(v.endDate) : "Present"}</p>
          ${v.description ? `<p class="text-sm text-neutral-700">${esc(v.description)}</p>` : ""}
        </div>`,
        )
        .join("")}</div></section>`;
    case "publications":
      if (resume.publications.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("Publications")}${resume.publications
        .map((p) => `<p class="text-sm text-neutral-700">${esc(p.title)} — ${esc(p.publisher)} (${esc(p.date)})</p>`)
        .join("")}</section>`;
    case "references":
      if (resume.references.length === 0) return "";
      return `<section class="mb-5">${modernSectionHeading("References")}${resume.references
        .map((r) => `<p class="text-sm text-neutral-700">${esc(r.name)} — ${esc(r.relationship)} (${esc(r.contactInfo)})</p>`)
        .join("")}</section>`;
    default: {
      if (!key.startsWith("custom:")) return "";
      const section = findCustomSection(resume, key);
      if (!section) return "";
      return `<section class="mb-5">${modernSectionHeading(section.title)}<p class="text-sm whitespace-pre-wrap text-neutral-700">${esc(section.content)}</p></section>`;
    }
  }
}

function contactLine(personalInfo, iconClass) {
  const items = [];
  if (personalInfo.email) items.push(`<span class="flex items-center gap-1">✉ ${esc(personalInfo.email)}</span>`);
  if (personalInfo.phone) items.push(`<span class="flex items-center gap-1">☎ ${esc(personalInfo.phone)}</span>`);
  if (personalInfo.address) items.push(`<span class="flex items-center gap-1">⚲ ${esc(personalInfo.address)}</span>`);
  if (personalInfo.linkedin) items.push(`<span class="flex items-center gap-1">🔗 ${esc(personalInfo.linkedin)}</span>`);
  if (personalInfo.github) items.push(`<span class="flex items-center gap-1">〈/〉 ${esc(personalInfo.github)}</span>`);
  if (personalInfo.portfolio) items.push(`<span class="flex items-center gap-1">🌐 ${esc(personalInfo.portfolio)}</span>`);
  return items.join("");
}

function renderModernTemplate(resume, theme) {
  const { personalInfo } = resume;
  const header = `<header class="-mx-10 -mt-10 mb-6 px-10 py-8 text-white" style="background-color:var(--resume-primary)">
    <h1 class="text-3xl font-bold">${esc(personalInfo.fullName)}</h1>
    <p class="mt-1 text-sm opacity-90">${esc(personalInfo.jobTitle)}</p>
    <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-90">${contactLine(personalInfo)}</div>
  </header>`;
  const body = resume.sectionOrder.map((key) => renderModernSection(resume, key)).join("");
  return resumePagePaper(theme, `${header}${body}`, "p-10");
}

// ---------- Minimal ----------

function minimalSectionHeading(text) {
  return `<h2 class="mb-2 text-[11px] font-semibold tracking-[0.2em] text-neutral-500 uppercase">${esc(text)}</h2>`;
}

function renderMinimalSection(resume, key) {
  switch (key) {
    case "summary":
      if (!resume.summary) return "";
      return `<section class="mb-6">${minimalSectionHeading("Summary")}<p class="text-sm leading-relaxed text-neutral-700">${esc(resume.summary)}</p></section>`;
    case "experience": {
      const items = nonBlankExperience(resume);
      if (items.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Experience")}<div class="space-y-5">${items
        .map(
          (exp) => `<div>
          <div class="flex items-baseline justify-between">
            <p class="text-sm font-medium">${esc(exp.position)}</p>
            <p class="text-xs text-neutral-400">${esc(exp.startDate)} – ${exp.isCurrent ? "Present" : esc(exp.endDate)}</p>
          </div>
          <p class="text-xs text-neutral-500">${esc(exp.company)}</p>
          <ul class="mt-2 space-y-1 text-sm text-neutral-700">${exp.achievements.filter(Boolean).map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "education": {
      const items = nonBlankEducation(resume);
      if (items.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Education")}<div class="space-y-2">${items
        .map(
          (edu) => `<div class="flex items-baseline justify-between">
          <p class="text-sm font-medium">${esc(edu.degree)} in ${esc(edu.field)}</p>
          <p class="text-xs text-neutral-400">${esc(edu.school)}, ${esc(edu.endDate)}</p>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "skills":
      if (resume.skills.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Skills")}<p class="text-sm text-neutral-700">${resume.skills.map((s) => esc(s.name)).join(" · ")}</p></section>`;
    case "projects":
      if (resume.projects.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Projects")}<div class="space-y-2">${resume.projects
        .map((p) => `<div><p class="text-sm font-medium">${esc(p.title)}</p><p class="text-sm text-neutral-700">${esc(p.description)}</p></div>`)
        .join("")}</div></section>`;
    case "certifications":
      if (resume.certifications.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Certifications")}${resume.certifications
        .map((c) => `<p class="text-sm text-neutral-700">${esc(c.name)}, ${esc(c.issuer)} (${esc(c.issueDate)})</p>`)
        .join("")}</section>`;
    case "awards":
      if (resume.awards.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Awards")}${resume.awards
        .map((a) => `<p class="text-sm text-neutral-700">${esc(a.title)}, ${esc(a.issuer)} (${esc(a.date)})</p>`)
        .join("")}</section>`;
    case "interests":
      if (resume.interests.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Interests")}<p class="text-sm text-neutral-700">${resume.interests.map(esc).join(" · ")}</p></section>`;
    case "volunteer":
      if (resume.volunteer.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Volunteer")}<div class="space-y-3">${resume.volunteer
        .map(
          (v) => `<div>
          <p class="text-sm font-medium">${esc(v.role)}</p>
          <p class="text-xs text-neutral-400">${esc(v.organization)} · ${esc(v.startDate)} – ${v.endDate ? esc(v.endDate) : "Present"}</p>
          ${v.description ? `<p class="mt-1 text-sm text-neutral-700">${esc(v.description)}</p>` : ""}
        </div>`,
        )
        .join("")}</div></section>`;
    case "publications":
      if (resume.publications.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("Publications")}${resume.publications
        .map((p) => `<p class="text-sm text-neutral-700">${esc(p.title)}, ${esc(p.publisher)} (${esc(p.date)})</p>`)
        .join("")}</section>`;
    case "references":
      if (resume.references.length === 0) return "";
      return `<section class="mb-6">${minimalSectionHeading("References")}${resume.references
        .map((r) => `<p class="text-sm text-neutral-700">${esc(r.name)}, ${esc(r.relationship)} — ${esc(r.contactInfo)}</p>`)
        .join("")}</section>`;
    default: {
      if (!key.startsWith("custom:")) return "";
      const section = findCustomSection(resume, key);
      if (!section) return "";
      return `<section class="mb-6">${minimalSectionHeading(section.title)}<p class="text-sm whitespace-pre-wrap text-neutral-700">${esc(section.content)}</p></section>`;
    }
  }
}

function renderMinimalTemplate(resume, theme) {
  const { personalInfo } = resume;
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.address, personalInfo.linkedin].filter(Boolean).map(esc).join("   ");
  const header = `<header class="mb-8 border-b border-neutral-200 pb-6">
    <h1 class="text-2xl font-semibold" style="color:var(--resume-primary)">${esc(personalInfo.fullName)}</h1>
    <p class="mt-0.5 text-sm text-neutral-500">${esc(personalInfo.jobTitle)}</p>
    <p class="mt-3 text-xs text-neutral-400">${contact}</p>
  </header>`;
  const body = resume.sectionOrder.map((key) => renderMinimalSection(resume, key)).join("");
  return resumePagePaper(theme, `${header}${body}`, "p-12");
}

// ---------- ATS ----------

function atsSectionHeading(text) {
  return `<h2 class="mb-1.5 border-b border-black pb-0.5 text-sm font-bold uppercase">${esc(text)}</h2>`;
}

function renderATSSection(resume, key) {
  switch (key) {
    case "summary":
      if (!resume.summary) return "";
      return `<section class="mb-4">${atsSectionHeading("Summary")}<p class="text-sm leading-relaxed text-black">${esc(resume.summary)}</p></section>`;
    case "experience": {
      const items = nonBlankExperience(resume);
      if (items.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Experience")}<div class="space-y-3">${items
        .map(
          (exp) => `<div>
          <p class="text-sm font-bold">${esc(exp.position)}, ${esc(exp.company)}</p>
          <p class="text-sm text-black">${esc(exp.startDate)} - ${exp.isCurrent ? "Present" : esc(exp.endDate)}</p>
          <ul class="mt-1 list-disc space-y-0.5 pl-5 text-sm text-black">${exp.achievements.filter(Boolean).map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "education": {
      const items = nonBlankEducation(resume);
      if (items.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Education")}${items
        .map((edu) => `<p class="text-sm text-black">${esc(edu.degree)} in ${esc(edu.field)}, ${esc(edu.school)}, ${esc(edu.startDate)} - ${esc(edu.endDate)}</p>`)
        .join("")}</section>`;
    }
    case "skills":
      if (resume.skills.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Skills")}<p class="text-sm text-black">${resume.skills.map((s) => esc(s.name)).join(", ")}</p></section>`;
    case "projects":
      if (resume.projects.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Projects")}${resume.projects
        .map((p) => `<p class="text-sm text-black"><span class="font-bold">${esc(p.title)}:</span> ${esc(p.description)}</p>`)
        .join("")}</section>`;
    case "certifications":
      if (resume.certifications.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Certifications")}${resume.certifications
        .map((c) => `<p class="text-sm text-black">${esc(c.name)}, ${esc(c.issuer)}, ${esc(c.issueDate)}</p>`)
        .join("")}</section>`;
    case "awards":
      if (resume.awards.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Awards")}${resume.awards
        .map((a) => `<p class="text-sm text-black">${esc(a.title)}, ${esc(a.issuer)}, ${esc(a.date)}</p>`)
        .join("")}</section>`;
    case "interests":
      if (resume.interests.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Interests")}<p class="text-sm text-black">${resume.interests.map(esc).join(", ")}</p></section>`;
    case "volunteer":
      if (resume.volunteer.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Volunteer Experience")}<div class="space-y-2">${resume.volunteer
        .map(
          (v) =>
            `<p class="text-sm text-black">${esc(v.role)}, ${esc(v.organization)}, ${esc(v.startDate)} - ${v.endDate ? esc(v.endDate) : "Present"}${v.description ? `. ${esc(v.description)}` : ""}</p>`,
        )
        .join("")}</div></section>`;
    case "publications":
      if (resume.publications.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("Publications")}${resume.publications
        .map((p) => `<p class="text-sm text-black">${esc(p.title)}, ${esc(p.publisher)}, ${esc(p.date)}</p>`)
        .join("")}</section>`;
    case "references":
      if (resume.references.length === 0) return "";
      return `<section class="mb-4">${atsSectionHeading("References")}${resume.references
        .map((r) => `<p class="text-sm text-black">${esc(r.name)}, ${esc(r.relationship)}, ${esc(r.contactInfo)}</p>`)
        .join("")}</section>`;
    default: {
      if (!key.startsWith("custom:")) return "";
      const section = findCustomSection(resume, key);
      if (!section) return "";
      return `<section class="mb-4">${atsSectionHeading(section.title)}<p class="text-sm whitespace-pre-wrap text-black">${esc(section.content)}</p></section>`;
    }
  }
}

function renderATSTemplate(resume, theme) {
  const { personalInfo } = resume;
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.address, personalInfo.linkedin].filter(Boolean).map(esc).join(" | ");
  const header = `<header class="mb-5">
    <h1 class="text-2xl font-bold text-black">${esc(personalInfo.fullName)}</h1>
    <p class="text-sm text-black">${esc(personalInfo.jobTitle)}</p>
    <p class="mt-1 text-sm text-black">${contact}</p>
  </header>`;
  const body = resume.sectionOrder.map((key) => renderATSSection(resume, key)).join("");
  return resumePagePaper(theme, `${header}${body}`, "p-10");
}

// ---------- Executive ----------

function executiveSectionHeading(text) {
  return `<h2 class="mb-2 text-center text-sm font-semibold tracking-[0.15em] uppercase" style="color:var(--resume-primary)">${esc(text)}</h2>`;
}

function renderExecutiveSection(resume, key) {
  switch (key) {
    case "summary":
      if (!resume.summary) return "";
      return `<section class="mb-6">${executiveSectionHeading("Executive Summary")}<p class="text-center text-sm leading-relaxed text-neutral-700">${esc(resume.summary)}</p></section>`;
    case "experience": {
      const items = nonBlankExperience(resume);
      if (items.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Professional Experience")}<div class="space-y-4">${items
        .map(
          (exp) => `<div>
          <div class="flex items-baseline justify-between border-b border-neutral-300 pb-1">
            <p class="text-sm font-bold">${esc(exp.company)}</p>
            <p class="text-xs text-neutral-500">${esc(exp.startDate)} – ${exp.isCurrent ? "Present" : esc(exp.endDate)}</p>
          </div>
          <p class="mt-1 text-sm font-semibold italic">${esc(exp.position)}</p>
          <ul class="mt-1 list-disc space-y-0.5 pl-5 text-sm text-neutral-700">${exp.achievements.filter(Boolean).map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "education": {
      const items = nonBlankEducation(resume);
      if (items.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Education")}${items
        .map((edu) => `<p class="text-center text-sm text-neutral-700">${esc(edu.degree)} in ${esc(edu.field)} — ${esc(edu.school)} (${esc(edu.endDate)})</p>`)
        .join("")}</section>`;
    }
    case "skills":
      if (resume.skills.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Core Competencies")}<p class="text-center text-sm text-neutral-700">${resume.skills.map((s) => esc(s.name)).join("  •  ")}</p></section>`;
    case "projects":
      if (resume.projects.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Notable Initiatives")}<div class="space-y-2">${resume.projects
        .map((p) => `<p class="text-center text-sm text-neutral-700"><span class="font-semibold">${esc(p.title)}</span> — ${esc(p.description)}</p>`)
        .join("")}</div></section>`;
    case "certifications":
      if (resume.certifications.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Certifications")}${resume.certifications
        .map((c) => `<p class="text-center text-sm text-neutral-700">${esc(c.name)} — ${esc(c.issuer)} (${esc(c.issueDate)})</p>`)
        .join("")}</section>`;
    case "awards":
      if (resume.awards.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Honors &amp; Awards")}${resume.awards
        .map((a) => `<p class="text-center text-sm text-neutral-700">${esc(a.title)} — ${esc(a.issuer)} (${esc(a.date)})</p>`)
        .join("")}</section>`;
    case "interests":
      if (resume.interests.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Interests")}<p class="text-center text-sm text-neutral-700">${resume.interests.map(esc).join("  •  ")}</p></section>`;
    case "volunteer":
      if (resume.volunteer.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Volunteer Experience")}<div class="space-y-2">${resume.volunteer
        .map(
          (v) =>
            `<p class="text-center text-sm text-neutral-700"><span class="font-semibold">${esc(v.role)}</span>, ${esc(v.organization)} (${esc(v.startDate)} – ${v.endDate ? esc(v.endDate) : "Present"})</p>`,
        )
        .join("")}</div></section>`;
    case "publications":
      if (resume.publications.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("Publications")}${resume.publications
        .map((p) => `<p class="text-center text-sm text-neutral-700">${esc(p.title)} — ${esc(p.publisher)} (${esc(p.date)})</p>`)
        .join("")}</section>`;
    case "references":
      if (resume.references.length === 0) return "";
      return `<section class="mb-6">${executiveSectionHeading("References")}${resume.references
        .map((r) => `<p class="text-center text-sm text-neutral-700">${esc(r.name)} — ${esc(r.relationship)} (${esc(r.contactInfo)})</p>`)
        .join("")}</section>`;
    default: {
      if (!key.startsWith("custom:")) return "";
      const section = findCustomSection(resume, key);
      if (!section) return "";
      return `<section class="mb-6">${executiveSectionHeading(section.title)}<p class="text-center text-sm whitespace-pre-wrap text-neutral-700">${esc(section.content)}</p></section>`;
    }
  }
}

function renderExecutiveTemplate(resume, theme) {
  const { personalInfo } = resume;
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.address, personalInfo.linkedin].filter(Boolean).map(esc).join("   |   ");
  const header = `<header class="mb-8 text-center">
    <h1 class="text-3xl font-bold tracking-wide text-neutral-900">${esc(personalInfo.fullName)}</h1>
    <p class="mt-1 text-sm font-semibold tracking-wide uppercase" style="color:var(--resume-primary)">${esc(personalInfo.jobTitle)}</p>
    <div class="mx-auto mt-3 h-px w-24" style="background-color:var(--resume-primary)"></div>
    <p class="mt-3 text-xs text-neutral-500">${contact}</p>
  </header>`;
  const body = resume.sectionOrder.map((key) => renderExecutiveSection(resume, key)).join("");
  return resumePagePaper(theme, `${header}${body}`, "p-12");
}

// ---------- Creative ----------

const CREATIVE_SIDEBAR_KEYS = new Set(["skills", "interests"]);

function creativeMainHeading(text) {
  return `<h2 class="mb-2 text-xs font-bold tracking-widest uppercase" style="color:var(--resume-primary)">${esc(text)}</h2>`;
}

function creativeSidebarHeading(text) {
  return `<h2 class="mb-2 text-xs font-bold tracking-widest text-white uppercase opacity-90">${esc(text)}</h2>`;
}

function renderCreativeMainSection(resume, key) {
  switch (key) {
    case "summary":
      if (!resume.summary) return "";
      return `<section class="mb-5">${creativeMainHeading("About")}<p class="text-sm leading-relaxed text-neutral-700">${esc(resume.summary)}</p></section>`;
    case "experience": {
      const items = nonBlankExperience(resume);
      if (items.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Experience")}<div class="space-y-4">${items
        .map(
          (exp) => `<div>
          <p class="text-sm font-semibold">${esc(exp.position)}</p>
          <p class="text-xs text-neutral-500">${esc(exp.company)} · ${esc(exp.startDate)} – ${exp.isCurrent ? "Present" : esc(exp.endDate)}</p>
          <ul class="mt-1 list-disc space-y-0.5 pl-4 text-sm text-neutral-700">${exp.achievements.filter(Boolean).map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
        </div>`,
        )
        .join("")}</div></section>`;
    }
    case "education": {
      const items = nonBlankEducation(resume);
      if (items.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Education")}${items
        .map((edu) => `<div><p class="text-sm font-semibold">${esc(edu.degree)} in ${esc(edu.field)}</p><p class="text-xs text-neutral-500">${esc(edu.school)}, ${esc(edu.endDate)}</p></div>`)
        .join("")}</section>`;
    }
    case "projects":
      if (resume.projects.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Projects")}<div class="space-y-2">${resume.projects
        .map((p) => `<div><p class="text-sm font-semibold">${esc(p.title)}</p><p class="text-sm text-neutral-700">${esc(p.description)}</p></div>`)
        .join("")}</div></section>`;
    case "certifications":
      if (resume.certifications.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Certifications")}${resume.certifications
        .map((c) => `<p class="text-sm text-neutral-700">${esc(c.name)} — ${esc(c.issuer)} (${esc(c.issueDate)})</p>`)
        .join("")}</section>`;
    case "awards":
      if (resume.awards.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Awards")}${resume.awards
        .map((a) => `<p class="text-sm text-neutral-700">${esc(a.title)} — ${esc(a.issuer)} (${esc(a.date)})</p>`)
        .join("")}</section>`;
    case "volunteer":
      if (resume.volunteer.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Volunteer Experience")}<div class="space-y-2">${resume.volunteer
        .map(
          (v) => `<div><p class="text-sm font-semibold">${esc(v.role)}</p><p class="text-xs text-neutral-500">${esc(v.organization)} · ${esc(v.startDate)} – ${v.endDate ? esc(v.endDate) : "Present"}</p></div>`,
        )
        .join("")}</div></section>`;
    case "publications":
      if (resume.publications.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("Publications")}${resume.publications
        .map((p) => `<p class="text-sm text-neutral-700">${esc(p.title)} — ${esc(p.publisher)} (${esc(p.date)})</p>`)
        .join("")}</section>`;
    case "references":
      if (resume.references.length === 0) return "";
      return `<section class="mb-5">${creativeMainHeading("References")}${resume.references
        .map((r) => `<p class="text-sm text-neutral-700">${esc(r.name)} — ${esc(r.relationship)} (${esc(r.contactInfo)})</p>`)
        .join("")}</section>`;
    default: {
      if (!key.startsWith("custom:")) return "";
      const section = findCustomSection(resume, key);
      if (!section) return "";
      return `<section class="mb-5">${creativeMainHeading(section.title)}<p class="text-sm whitespace-pre-wrap text-neutral-700">${esc(section.content)}</p></section>`;
    }
  }
}

function renderCreativeSidebarSection(resume, key) {
  if (key === "skills" && resume.skills.length > 0) {
    return `<section class="mb-6">${creativeSidebarHeading("Skills")}<ul class="space-y-1 text-sm text-white/90">${resume.skills.map((s) => `<li>${esc(s.name)}</li>`).join("")}</ul></section>`;
  }
  if (key === "interests" && resume.interests.length > 0) {
    return `<section class="mb-6">${creativeSidebarHeading("Interests")}<ul class="space-y-1 text-sm text-white/90">${resume.interests.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></section>`;
  }
  return "";
}

function renderCreativeTemplate(resume, theme) {
  const { personalInfo } = resume;
  const mainKeys = resume.sectionOrder.filter((k) => !CREATIVE_SIDEBAR_KEYS.has(k));
  const sidebarKeys = resume.sectionOrder.filter((k) => CREATIVE_SIDEBAR_KEYS.has(k));

  const sidebarContact = [];
  if (personalInfo.email) sidebarContact.push(`<p class="flex items-center gap-1.5">✉ ${esc(personalInfo.email)}</p>`);
  if (personalInfo.phone) sidebarContact.push(`<p class="flex items-center gap-1.5">☎ ${esc(personalInfo.phone)}</p>`);
  if (personalInfo.address) sidebarContact.push(`<p class="flex items-center gap-1.5">⚲ ${esc(personalInfo.address)}</p>`);
  if (personalInfo.linkedin) sidebarContact.push(`<p class="flex items-center gap-1.5">🔗 ${esc(personalInfo.linkedin)}</p>`);
  if (personalInfo.github) sidebarContact.push(`<p class="flex items-center gap-1.5">〈/〉 ${esc(personalInfo.github)}</p>`);
  if (personalInfo.portfolio) sidebarContact.push(`<p class="flex items-center gap-1.5">🌐 ${esc(personalInfo.portfolio)}</p>`);

  const inner = `<div class="flex min-h-[1056px]">
    <aside class="w-[260px] shrink-0 p-8 text-white" style="background-color:var(--resume-primary)">
      <h1 class="text-xl font-bold">${esc(personalInfo.fullName)}</h1>
      <p class="mt-1 text-sm opacity-90">${esc(personalInfo.jobTitle)}</p>
      <div class="mt-5 space-y-1.5 text-xs text-white/90">${sidebarContact.join("")}</div>
      <div class="mt-6">${sidebarKeys.map((k) => renderCreativeSidebarSection(resume, k)).join("")}</div>
    </aside>
    <div class="flex-1 p-8">${mainKeys.map((k) => renderCreativeMainSection(resume, k)).join("")}</div>
  </div>`;

  return resumePagePaper(theme, inner);
}

// ---------- Dispatcher ----------

function renderResumeTemplate(templateId, resume, theme) {
  switch (templateId) {
    case "minimal":
      return renderMinimalTemplate(resume, theme);
    case "ats":
      return renderATSTemplate(resume, theme);
    case "executive":
      return renderExecutiveTemplate(resume, theme);
    case "creative":
      return renderCreativeTemplate(resume, theme);
    case "modern":
    default:
      return renderModernTemplate(resume, theme);
  }
}
