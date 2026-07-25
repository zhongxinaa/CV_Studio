import json

from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from prompts.resume_generator import build_resume_generator_prompt
from rate_limit import check_rate_limit
from schemas import GeneratedResume, ResumeGeneratorRequest
from services.ai.errors import AIConfigurationError, AIProviderError
from services.ai.openrouter_provider import generate_text

resume_generator_bp = Blueprint("resume_generator_api", __name__)

RATE_LIMIT_COUNT = 5
RATE_LIMIT_WINDOW_SECONDS = 10 * 60


def _get_client_key() -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return "unknown"


def _extract_json_object(text: str):
    """Models sometimes wrap JSON in a code fence or add stray commentary."""
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("No JSON object found in AI response")
    return json.loads(text[start : end + 1])


@resume_generator_bp.route("/api/resume-generator", methods=["POST"])
def generate_resume():
    client_key = _get_client_key()
    rate_result = check_rate_limit(
        f"resume-generator:{client_key}", RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW_SECONDS
    )
    if not rate_result["allowed"]:
        return (
            jsonify(
                error="Too many requests. Please wait a few minutes before generating another resume draft."
            ),
            429,
        )

    body = request.get_json(silent=True)
    if body is None:
        return jsonify(error="Request body must be valid JSON."), 400

    try:
        parsed = ResumeGeneratorRequest(**body)
    except ValidationError as error:
        return jsonify(error=error.errors()[0]["msg"] if error.errors() else "Invalid request."), 400

    try:
        prompt_data = build_resume_generator_prompt(parsed)
        content = generate_text(
            prompt=prompt_data["prompt"],
            system=prompt_data["system"],
            max_tokens=1536,
            temperature=0.7,
            json_mode=True,
        )

        try:
            raw_json = _extract_json_object(content)
        except (ValueError, json.JSONDecodeError) as error:
            print(f"[resume-generator] JSON extraction failed. Raw content: {content} {error}")
            return jsonify(error="The AI returned an unexpected format. Please try again."), 502

        try:
            resume_result = GeneratedResume(**raw_json)
        except ValidationError as error:
            print(f"[resume-generator] Schema validation failed: {error.errors()} Raw JSON: {raw_json}")
            return jsonify(error="The AI returned an unexpected format. Please try again."), 502

        return jsonify(resume=resume_result.model_dump())
    except AIConfigurationError:
        return (
            jsonify(
                error="The AI provider isn't configured yet. Set OPENROUTER_API_KEY in .env."
            ),
            503,
        )
    except AIProviderError:
        return jsonify(error="The AI provider failed to generate a response. Please try again."), 502
    except Exception:  # noqa: BLE001
        return jsonify(error="Something went wrong generating the resume draft."), 500
