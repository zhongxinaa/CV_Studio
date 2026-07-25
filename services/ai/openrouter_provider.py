import time
from typing import Optional

import requests

from config import OPENROUTER_API_KEY, OPENROUTER_MODEL
from services.ai.errors import AIConfigurationError, AIProviderError

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MAX_ATTEMPTS = 3
RETRY_DELAY_SECONDS = 0.5
PROVIDER_NAME = "openrouter"


def generate_text(
    prompt: str,
    system: Optional[str] = None,
    max_tokens: int = 1024,
    temperature: float = 0.7,
    json_mode: bool = False,
) -> str:
    if not OPENROUTER_API_KEY:
        raise AIConfigurationError("AI provider is not configured. Set OPENROUTER_API_KEY.")

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    reasoning_disabled = True
    last_error: Optional[Exception] = None

    for attempt in range(1, MAX_ATTEMPTS + 1):
        body = {
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        if reasoning_disabled:
            body["reasoning"] = {"effort": "none"}
        if json_mode:
            body["response_format"] = {"type": "json_object"}

        try:
            response = requests.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json=body,
                timeout=60,
            )
            if response.status_code >= 400:
                raise AIProviderError(
                    f"OpenRouter request failed with status {response.status_code}: {response.text}",
                    PROVIDER_NAME,
                )
            data = response.json()
            choices = data.get("choices")
            if not choices:
                raise AIProviderError("OpenRouter returned no choices", PROVIDER_NAME)
            content = choices[0].get("message", {}).get("content")
            if not isinstance(content, str) or not content:
                raise AIProviderError("OpenRouter returned an empty response", PROVIDER_NAME)
            return content
        except Exception as error:  # noqa: BLE001 - mirrors the TS catch-and-retry-on-anything behavior
            last_error = error
            print(f"[OpenRouterProvider] attempt {attempt}/{MAX_ATTEMPTS} failed: {error}")
            message = str(error)
            if reasoning_disabled and "reasoning" in message.lower():
                reasoning_disabled = False
            if attempt < MAX_ATTEMPTS:
                time.sleep(RETRY_DELAY_SECONDS * attempt)

    raise AIProviderError("OpenRouter request failed", PROVIDER_NAME, last_error)
