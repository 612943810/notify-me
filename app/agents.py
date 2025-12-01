import os
from typing import Dict, Any
from datetime import datetime, timedelta, timezone

from .models import Task


def _is_gemini_enabled() -> bool:
    return os.getenv("ENABLE_GEMINI", "false").lower() in ("1", "true", "yes") and bool(
        os.getenv("GEMINI_API_KEY")
    )


def _is_openai_enabled() -> bool:
    return os.getenv("ENABLE_AI", "false").lower() in ("1", "true", "yes") and bool(os.getenv("OPENAI_API_KEY"))


async def suggest_priority(task: Task) -> Dict[str, Any]:
    """Return an advisory suggestion for a Task.

    This function is intentionally lightweight and deterministic for local/dev use.
    When `ENABLE_AI` is enabled and an API key is provided, this function may
    be extended to call external AI providers. For now we provide a simple rule-based
    suggestion so behaviour is predictable in CI and dev.
    """
    now = datetime.now(timezone.utc)
    suggestion = {"priority": "medium", "confidence": 0.5, "explanation": "Default suggestion."}

    if task.due_date:
        # if due within 24 hours -> high
        if task.due_date - now <= timedelta(hours=24):
            suggestion = {"priority": "high", "confidence": 0.9, "explanation": "Due within 24 hours."}
        elif task.due_date - now <= timedelta(days=3):
            suggestion = {"priority": "high", "confidence": 0.7, "explanation": "Due within 3 days."}
        else:
            suggestion = {"priority": "medium", "confidence": 0.6, "explanation": "Due date is not imminent."}

    # placeholder for real AI integration
    if _is_gemini_enabled():
        suggestion["explanation"] += " (Gemini-enabled mode: real model integration available)"
    elif _is_openai_enabled():
        suggestion["explanation"] += " (OpenAI-enabled mode: real model integration available)"

    return suggestion
