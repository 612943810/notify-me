import os
import re
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional

from langchain.chat_models import ChatOpenAI, ChatGooglePalm
from langchain.schema import HumanMessage, SystemMessage

from ..models import Task, TaskCreate


class TaskAgent:
    """A unified agent for task-related AI operations.
    
    This class handles all AI-powered task operations including parsing, 
    priority suggestions, scheduling, and summarization.
    """
    
    def __init__(self):
        self.llm = self._init_llm()
    
    def _init_llm(self):
        """Initialize the appropriate LLM based on available API keys."""
        if os.getenv("OPENAI_API_KEY"):
            return ChatOpenAI(temperature=0.7)
        elif os.getenv("GOOGLE_API_KEY"):
            return ChatGooglePalm(temperature=0.7)
        return None

    # Task Parsing
    async def parse_task(self, text: str) -> TaskCreate:
        """Parse natural language task into structured data."""
        if not self.llm:
            return self._parse_nl_task_local(text)
            
        try:
            messages = [
                SystemMessage(content="You are a helpful task parsing assistant."),
                HumanMessage(content=f"Parse this task into JSON with: title, description, due_date, priority.\nInput: {text}")
            ]
            response = await self.llm.agenerate([messages])
            return self._parse_llm_response(response)
        except Exception as e:
            print(f"LLM Error: {e}")
            return self._parse_nl_task_local(text)

    def _parse_llm_response(self, response) -> TaskCreate:
        """Parse LLM response into TaskCreate model."""
        text = response.generations[0][0].text
        return TaskCreate(
            title=text[:100],
            description=text,
            due_date=None,
            priority="medium"
        )

    def _parse_nl_task_local(self, text: str) -> TaskCreate:
        """Local implementation of natural language task parsing."""
        text = text.strip()
        lower = text.lower()

        title = text
        description = None
        due_date = None
        priority = None

        # Detect due phrases
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

        # Simple priority detection
        if any(word in lower for word in ["urgent", "asap", "important"]):
            priority = "high"
        elif any(word in lower for word in ["low", "whenever"]):
            priority = "low"

        return TaskCreate(
            title=title[:100],
            description=description,
            due_date=due_date,
            priority=priority or "medium"
        )

    # Priority Suggestions
    async def suggest_priority(self, task: Task) -> Dict[str, Any]:
        """Suggest priority for a task."""
        if not self.llm:
            return self._suggest_priority_local(task)
            
        try:
            messages = [
                SystemMessage(content="You are a task prioritization assistant."),
                HumanMessage(content=f"Suggest priority (high/medium/low) for task: {task.title}\n{task.description}")
            ]
            response = await self.llm.agenerate([messages])
            return {"priority": response.generations[0][0].text.lower(), "confidence": 0.9}
        except Exception as e:
            print(f"LLM Priority Error: {e}")
            return self._suggest_priority_local(task)

    def _suggest_priority_local(self, task: Task) -> Dict[str, Any]:
        """Local implementation of priority suggestion."""
        now = datetime.now(timezone.utc)
        if task.due_date:
            if (task.due_date - now) <= timedelta(hours=24):
                return {"priority": "high", "confidence": 0.9, "explanation": "Due within 24 hours."}
            elif (task.due_date - now) <= timedelta(days=3):
                return {"priority": "high", "confidence": 0.7, "explanation": "Due within 3 days."}
        return {"priority": "medium", "confidence": 0.6, "explanation": "No urgent due date."}

    # Scheduling
    async def suggest_schedule(self, task: Task) -> Dict[str, Any]:
        """Suggest a schedule for the task."""
        if not self.llm:
            return self._suggest_schedule_local(task)
            
        try:
            # LLM-based scheduling logic would go here
            return self._suggest_schedule_local(task)
        except Exception as e:
            print(f"LLM Schedule Error: {e}")
            return self._suggest_schedule_local(task)

    def _suggest_schedule_local(self, task: Task) -> Dict[str, Any]:
        """Local implementation of schedule suggestion."""
        now = datetime.now(timezone.utc)
        if task.due_date:
            # Schedule for 1 hour before due date, or now if due soon
            start = min(now + timedelta(hours=1), task.due_date - timedelta(hours=1))
        else:
            # Default to 1 hour from now for tasks without due dates
            start = now + timedelta(hours=1)
            
        return {
            "suggested_start": start.isoformat(),
            "suggested_end": (start + timedelta(hours=1)).isoformat(),
            "explanation": "Scheduled based on due date."
        }

    # Summarization
    def summarize(self, task: Task) -> str:
        """Generate a summary of the task."""
        if not self.llm:
            return self._summarize_local(task)
            
        try:
            # LLM-based summarization would go here
            return self._summarize_local(task)
        except Exception as e:
            print(f"LLM Summary Error: {e}")
            return self._summarize_local(task)

    def _summarize_local(self, task: Task) -> str:
        """Local implementation of task summarization."""
        parts = [f"{task.title}"]
        if task.priority:
            parts.append(f"priority={task.priority}")
        if task.due_date:
            parts.append(f"due={task.due_date.strftime('%Y-%m-%d')}")
        if task.status:
            parts.append(f"status={task.status}")
        return " | ".join(parts)


# Singleton instance
task_agent = TaskAgent()
