from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from prompts.cover_letter import build_cover_letter_prompt
from rate_limit import check_rate_limit
from schemas import CoverLetterRequest
from services.ai.errors import AIConfigurationError, AIProviderError
from services.ai.openrouter_provider import generate_text

cover_letter_bp = Blueprint("cover_letter_api", __name__)

RATE_LIMIT_COUNT = 5
RATE_LIMIT_WINDOW_SECONDS = 10 * 60


def _get_client_key() -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return "unknown"


@cover_letter_bp.route("/api/cover-letter", methods=["POST"])
def generate_cover_letter():
    client_key = _get_client_key()
    rate_result = check_rate_limit(
        f"cover-letter:{client_key}", RATE_LIMIT_COUNT, RATE_LIMIT_WINDOW_SECONDS
    )
    if not rate_result["allowed"]:
        return (
            jsonify(
                error="Too many requests. Please wait a few minutes before generating another cover letter."
            ),
            429,
        )

    body = request.get_json(silent=True)
    if body is None:
        return jsonify(error="Request body must be valid JSON."), 400

    try:
        parsed = CoverLetterRequest(**body)
    except ValidationError as error:
        return jsonify(error=error.errors()[0]["msg"] if error.errors() else "Invalid request."), 400

    try:
        prompt_data = build_cover_letter_prompt(parsed)
        content = generate_text(
            prompt=prompt_data["prompt"],
            system=prompt_data["system"],
            max_tokens=1024,
            temperature=0.7,
        )
        return jsonify(content=content)
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
        return jsonify(error="Something went wrong generating the cover letter."), 500
