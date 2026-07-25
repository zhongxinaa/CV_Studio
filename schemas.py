from typing import Literal, Optional

from pydantic import BaseModel, Field

ExperienceLevel = Literal[
    "Entry level (0-1 years)",
    "Junior (2-4 years)",
    "Mid-level (5-9 years)",
    "Senior (10+ years)",
]
EXPERIENCE_LEVELS: list[str] = [
    "Entry level (0-1 years)",
    "Junior (2-4 years)",
    "Mid-level (5-9 years)",
    "Senior (10+ years)",
]

CoverLetterTone = Literal["Professional", "Formal", "Friendly", "Startup", "Executive"]
COVER_LETTER_TONES: list[str] = ["Professional", "Formal", "Friendly", "Startup", "Executive"]


class ResumeGeneratorRequest(BaseModel):
    jobTitle: str = Field(min_length=1, max_length=200)
    experienceLevel: ExperienceLevel
    industry: str = Field(min_length=1, max_length=200)
    skills: str = Field(min_length=3, max_length=2000)
    education: str = Field(min_length=3, max_length=1000)


class GeneratedExperience(BaseModel):
    position: str
    company: str
    startDate: str
    endDate: Optional[str] = None
    achievements: list[str]


class GeneratedProject(BaseModel):
    title: str
    description: str


class GeneratedResume(BaseModel):
    summary: str
    experience: list[GeneratedExperience]
    skills: list[str]
    projects: list[GeneratedProject]
    achievements: list[str]


class CoverLetterRequest(BaseModel):
    resumeText: str = Field(min_length=50, max_length=20000)
    companyName: str = Field(min_length=1, max_length=200)
    hiringManager: Optional[str] = Field(default=None, max_length=200)
    position: str = Field(min_length=1, max_length=200)
    jobDescription: Optional[str] = Field(default=None, max_length=10000)
    tone: CoverLetterTone
