from schemas import ResumeGeneratorRequest

SYSTEM_PROMPT = """You are an expert resume writer. Generate a realistic, ATS-friendly DRAFT resume for someone to use as a personalized starting point — not a finished, submittable document. Because you don't know the candidate's real employers, always use bracketed placeholders like "[Company Name]" and "[Dates]" for anything you cannot know (employer names, exact dates), while writing realistic, industry-appropriate job titles, responsibilities, and quantified achievements for the given role/level/industry. Never invent a specific real company name.

Respond with ONLY a single JSON object — no markdown code fences, no commentary before or after — matching exactly this shape:
{
  "summary": string (2-3 sentences),
  "experience": [
    { "position": string, "company": string (bracketed placeholder), "startDate": string (bracketed placeholder), "endDate": string (bracketed placeholder, omit if current role), "achievements": string[] (3-4 quantified bullets) }
  ] (2-3 roles),
  "skills": string[] (built from the candidate's skills plus closely related ones),
  "projects": [
    { "title": string, "description": string }
  ] (1-2 example projects relevant to the target role),
  "achievements": string[] (2-3 standout, quantified accomplishments, separate from per-role achievements)
}"""


def build_resume_generator_prompt(input_data: ResumeGeneratorRequest) -> dict:
    prompt = f"""Generate a draft resume as JSON for this candidate profile:

Target job title: {input_data.jobTitle}
Experience level: {input_data.experienceLevel}
Industry: {input_data.industry}
Skills to feature: {input_data.skills}
Education: {input_data.education}"""

    return {"system": SYSTEM_PROMPT, "prompt": prompt}
