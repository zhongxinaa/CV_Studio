from schemas import CoverLetterRequest

TONE_GUIDANCE = {
    "Professional": "Professional and polished, confident but not boastful, suitable for most corporate roles.",
    "Formal": "Formal and traditional, precise language, minimal contractions, suited for conservative industries like law or finance.",
    "Friendly": "Warm and personable while staying professional — approachable, conversational sentence rhythm.",
    "Startup": "Energetic and direct, emphasizes impact and ownership, comfortable with a slightly informal register.",
    "Executive": "Authoritative and strategic, emphasizes leadership impact and business outcomes over day-to-day tasks.",
}

SYSTEM_PROMPT = """You are an expert career writer who produces concise, ATS-friendly cover letters. Write only the cover letter body (no subject line, no explanation, no markdown formatting, no placeholder brackets like "[Your Name]" unless that exact information genuinely isn't available). Keep it to 3-5 paragraphs. Ground every claim in the candidate's actual resume content provided — never invent employers, titles, or achievements that aren't in the resume."""


def build_cover_letter_prompt(input_data: CoverLetterRequest) -> dict:
    hiring_manager_line = (
        f"Hiring manager: {input_data.hiringManager}"
        if input_data.hiringManager
        else "Hiring manager: not specified — use a general professional greeting."
    )
    job_description_block = (
        f"Job description:\n{input_data.jobDescription}\n\n" if input_data.jobDescription else ""
    )
    job_description_suffix = " and job description" if input_data.jobDescription else ""

    prompt = f"""Write a cover letter for the following application.

Target role: {input_data.position}
Company: {input_data.companyName}
{hiring_manager_line}
Tone: {input_data.tone} — {TONE_GUIDANCE[input_data.tone]}

{job_description_block}Candidate's resume:
{input_data.resumeText}

Write a cover letter that connects the candidate's actual experience from the resume above to this specific role{job_description_suffix}. Do not fabricate experience that isn't in the resume."""

    return {"system": SYSTEM_PROMPT, "prompt": prompt}
