const GENERATED_RESUME_STORAGE_KEY = "cvstudio:last-generated-resume";

function isValidGeneratedResume(resume) {
  return (
    resume &&
    typeof resume.summary === "string" &&
    Array.isArray(resume.experience) &&
    Array.isArray(resume.skills) &&
    Array.isArray(resume.projects) &&
    Array.isArray(resume.achievements)
  );
}

function saveGeneratedResume(resume) {
  const payload = { resume, generatedAt: new Date().toISOString() };
  window.localStorage.setItem(GENERATED_RESUME_STORAGE_KEY, JSON.stringify(payload));
}

function loadGeneratedResume() {
  const raw = window.localStorage.getItem(GENERATED_RESUME_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return isValidGeneratedResume(parsed.resume) ? parsed.resume : null;
  } catch {
    return null;
  }
}
