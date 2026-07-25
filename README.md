# CV Studio (Python)

An AI-powered resume builder and cover letter generator, built with Flask and
vanilla JavaScript. This is a from-scratch Python rebuild of the original
Next.js/React version of CV Studio — same features, no framework.

## Features

- **Resume Builder** — a live-updating editor for personal info, summary,
  experience, education, skills, projects, certifications, awards,
  volunteer work, publications, interests, references, and custom sections.
  Reorder or hide/show any section, switch between 5 templates, and theme
  the resume with a custom color and font.
- **5 resume templates** — Modern, Minimal, ATS, Executive, and Creative,
  each with its own layout and color styling.
- **AI Resume Generator** — generates a structured draft resume (summary,
  experience, projects, skills, achievements) from a job title, experience
  level, industry, skills, and education, via OpenRouter.
- **AI Cover Letter Generator** — generates a personalized cover letter
  from a pasted resume, company, position, hiring manager, tone, and
  optional job description.
- **Import bridge** — the last resume generated on the AI Resume Generator
  page can be pulled directly into the Builder with one click (via
  `localStorage`, no account needed).
- **Export** — download the resume as a PDF (browser print) or DOCX
  (generated server-side with `python-docx`).
- **Light/dark theme toggle** for the site UI, independent of the resume's
  own color theme (resumes always render on white paper).

## Tech stack

- **Backend**: Flask, Pydantic (request/response validation), `requests`
  (OpenRouter API calls), `python-docx` (DOCX export)
- **Frontend**: Server-rendered Jinja2 templates + vanilla JavaScript (no
  build step, no frontend framework), Tailwind CSS via CDN
- **AI**: [OpenRouter](https://openrouter.ai) — a single API for models
  from OpenAI, Anthropic, Google, and open-source providers

## Project structure

```
app.py                      Flask app factory + blueprint registration
config.py                   Environment variable loading
schemas.py                  Pydantic request/response models
rate_limit.py                In-memory rate limiter for the AI endpoints
routes/
  pages.py                   Page routes (/, /builder, /cover-letter, ...)
  resume_generator_api.py    POST /api/resume-generator
  cover_letter_api.py        POST /api/cover-letter
  export_api.py               POST /api/export/docx
services/
  ai/openrouter_provider.py   OpenRouter integration with retry logic
  export/resume_docx.py       DOCX document builder
prompts/                     AI prompt builders
templates/                   Jinja2 page templates
static/js/                   Builder state/UI, template renderers, page scripts
static/css/                  Site styling
```

## Setup

1. **Create a virtual environment and install dependencies**

   ```
   python -m venv .venv
   .venv\Scripts\pip install -r requirements.txt
   ```

2. **Configure environment variables**

   Copy `.env.example` to `.env` and set your OpenRouter API key:

   ```
   OPENROUTER_API_KEY=sk-or-...
   ```

## Running the app

```
.venv\Scripts\python.exe app.py
```

Then open `http://127.0.0.1:3000` — it redirects to the Cover Letter
Generator.

## Notes

- There's no authentication or database — the Builder's resume data lives
  only in the browser for the current session and is not persisted across
  page reloads.
- The rate limiter is in-memory per process; it resets whenever the app
  restarts and doesn't share state across multiple workers/instances.
