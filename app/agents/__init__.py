import os
from typing import Dict, Any

from ..models import Task, TaskCreate
from .provider import task_agent


async def suggest_priority(task: Task) -> Dict[str, Any]:
    """Delegate priority suggestion to the configured provider."""
    return await task_agent.suggest_priority(task)


async def parse_nl_task(text: str) -> TaskCreate:
    """Delegate NL parsing to the configured provider."""
    return await task_agent.parse_task(text)


async def suggest_schedule(task: Task) -> Dict[str, Any]:
    """Delegate schedule suggestion to the configured provider."""
    return await task_agent.suggest_schedule(task)


def summarize_task(task: Task) -> str:
    """Delegate summarization to the configured provider (sync)."""
    return task_agent.summarize(task)
