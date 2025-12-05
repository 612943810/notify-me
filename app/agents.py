
import os
from typing import Dict, Any

from .models import Task, TaskCreate
from .agents_pkg.provider import get_provider


def _get_provider():
    # keep provider selection lazy and simple
    return get_provider()


async def suggest_priority(task: Task) -> Dict[str, Any]:
    """Delegate priority suggestion to the configured provider."""
    provider = _get_provider()
    return await provider.suggest_priority(task)


async def parse_nl_task(text: str) -> TaskCreate:
    """Delegate NL parsing to the configured provider."""
    provider = _get_provider()
    return await provider.parse_task(text)


async def suggest_schedule(task: Task) -> Dict[str, Any]:
    """Delegate schedule suggestion to the configured provider."""
    provider = _get_provider()
    return await provider.suggest_schedule(task)


def summarize_task(task: Task) -> str:
    """Delegate summarization to the configured provider (sync)."""
    provider = _get_provider()
    return provider.summarize(task)


async def parse_nl_task(text: str) -> TaskCreate:
    """Parse a short natural-language task into a `TaskCreate`.

    This is intentionally simple and deterministic so it can be used in
    development and tests without external AI. It recognizes a few common
    phrases like "due tomorrow", "due in 3 days", ISO dates, and priority
    keywords like "urgent" or "low priority".
    """
    text = text.strip()
    lower = text.lower()

    title = text
    description = None
    due_date = None
    priority = None

    # detect due phrases: "due tomorrow", "due in 3 days", ISO date, or yyyy-mm-dd
    m = re.search(r"due (on |by |at )?(tomorrow|today|in \d+ days?|\d{4}-\d{2}-\d{2}|\w+ \d{1,2}(?:, \d{4})?)", lower)
    if m:
        due_str = m.group(2)
        now = datetime.now(timezone.utc)
        if due_str == "today":
            due_date = now.replace(hour=23, minute=59, second=0, microsecond=0)
        elif due_str == "tomorrow":
            due_date = (now + timedelta(days=1)).replace(hour=23, minute=59, second=0, microsecond=0)
        else:
            dm = re.match(r"in (\d+) days?", due_str)
            if dm:
                days = int(dm.group(1))
                due_date = (now + timedelta(days=days)).replace(hour=23, minute=59, second=0, microsecond=0)
            else:
                # try ISO date first
                try:
                    parsed = datetime.fromisoformat(due_str)
                    if parsed.tzinfo is None:
                        parsed = parsed.replace(tzinfo=timezone.utc)
                    due_date = parsed
                except Exception:
                    # ignore parse errors; keep due_date None
                    due_date = None

        # remove trailing "due ..." from title
        title = re.sub(r"\sdue.*$", "", title, flags=re.IGNORECASE).strip()

    # priority hints
    if any(k in lower for k in ("high priority", "priority high", "urgent", "asap")):
        priority = "high"
    elif any(k in lower for k in ("low priority", "priority low")):
        priority = "low"

    # if the text is long, keep a shorter title and move rest to description
    if len(title) > 120:
        description = title
        title = title[:120] + "..."

    return TaskCreate(title=title or "Untitled task", description=description, due_date=due_date, priority=priority)


async def suggest_schedule(task: Task) -> Dict[str, Any]:
    """Return a simple suggested start time/window for the task.

    Rules (deterministic):
    - If task has a due_date: suggest a start time before the due date based on priority.
    - If no due_date: suggest next weekday at 09:00 UTC.
    """
    now = datetime.now(timezone.utc)
    suggestion: Dict[str, Any] = {"suggested_start": None, "rationale": "No suggestion available."}

    if task.due_date:
        delta = timedelta(hours=24)
        if task.priority == "high":
            delta = timedelta(hours=6)
        elif task.priority == "low":
            delta = timedelta(days=3)
        suggested = task.due_date - delta
        if suggested < now:
            suggested = now
        suggestion["suggested_start"] = suggested.isoformat()
        suggestion["rationale"] = f"Start {delta} before due date based on priority '{task.priority}'."
    else:
        # pick next weekday at 09:00 UTC
        candidate = now + timedelta(days=1)
        candidate = candidate.replace(hour=9, minute=0, second=0, microsecond=0)
        # roll forward to Monday-Friday
        while candidate.weekday() >= 5:
            candidate += timedelta(days=1)
        suggestion["suggested_start"] = candidate.isoformat()
        suggestion["rationale"] = "No due date; suggest next workday morning."

    return suggestion


def summarize_task(task: Task) -> str:
    """Return a short human-readable summary for a Task.

    Deterministic short format used in UIs or notifications.
    """
    parts = [f"{task.title}"]
    if task.due_date:
        parts.append(f"due {task.due_date.date().isoformat()}")
    parts.append(f"priority={task.priority}")
    parts.append(f"status={task.status}")
    return " | ".join(parts)
