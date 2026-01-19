import os
import re
import logging
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional, List

from langchain_core.language_models import BaseLanguageModel
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnablePassthrough
from pydantic import BaseModel, Field, field_validator
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatGooglePalm

from ..models import Task, TaskCreate

# Set up logging
logger = logging.getLogger(__name__)


# Pydantic models for structured output parsing
class TaskParseOutput(BaseModel):
    """Structured output for task parsing."""
    title: str = Field(description="Task title", max_length=100)
    description: Optional[str] = Field(default=None, description="Optional task description")
    due_date: Optional[str] = Field(default=None, description="Due date in ISO format (YYYY-MM-DDTHH:MM:SS)")
    priority: str = Field(description="Priority level", pattern="^(high|medium|low)$")

    @field_validator('due_date', mode='before')
    @classmethod
    def parse_due_date(cls, v):
        if v is None:
            return None
        if isinstance(v, str):
            # Try to parse various date formats
            try:
                # Handle relative dates
                now = datetime.now(timezone.utc)
                v_lower = v.lower().strip()
                if v_lower == "today":
                    return now.replace(hour=23, minute=59, second=0, microsecond=0).isoformat()
                elif v_lower == "tomorrow":
                    tomorrow = now + timedelta(days=1)
                    return tomorrow.replace(hour=23, minute=59, second=0, microsecond=0).isoformat()
                elif v_lower.startswith("in ") and " days" in v_lower:
                    days_match = re.search(r"in (\d+) days?", v_lower)
                    if days_match:
                        days = int(days_match.group(1))
                        future_date = now + timedelta(days=days)
                        return future_date.replace(hour=23, minute=59, second=0, microsecond=0).isoformat()
                # Try parsing as ISO format
                datetime.fromisoformat(v.replace('Z', '+00:00'))
                return v
            except ValueError:
                pass
        return None


class PrioritySuggestionOutput(BaseModel):
    """Structured output for priority suggestions."""
    priority: str = Field(description="Suggested priority", pattern="^(high|medium|low)$")
    confidence: float = Field(description="Confidence score", ge=0.0, le=1.0)
    explanation: str = Field(description="Reasoning for the suggestion")


class ScheduleSuggestionOutput(BaseModel):
    """Structured output for schedule suggestions."""
    suggested_start: str = Field(description="Suggested start time in ISO format")
    suggested_end: str = Field(description="Suggested end time in ISO format")
    explanation: str = Field(description="Reasoning for the schedule")


# Prompt templates
TASK_PARSE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are an expert task parsing assistant. Extract structured information from natural language task descriptions.

Guidelines:
- Extract concise, actionable titles
- Identify due dates (today, tomorrow, specific dates, or "in X days")
- Determine priority from urgency indicators (urgent, asap, important = high; low, whenever = low)
- Provide clear descriptions when additional context is given

{format_instructions}"""),
    ("human", "Parse this task: {task_text}")
])

PRIORITY_SUGGEST_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a task prioritization expert. Analyze tasks and suggest appropriate priority levels.

Consider:
- Urgency based on due dates
- Task complexity and importance
- Keywords indicating priority (urgent, critical, important, low priority, whenever)

{format_instructions}"""),
    ("human", """Task: {title}
Description: {description}
Due Date: {due_date}
Current Status: {status}

Suggest appropriate priority.""")
])

SCHEDULE_SUGGEST_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a scheduling assistant. Suggest optimal timing for task completion.

Consider:
- Due dates and deadlines
- Task priority and complexity
- Realistic time estimates
- Current time constraints

{format_instructions}"""),
    ("human", """Task: {title}
Priority: {priority}
Due Date: {due_date}

Suggest optimal scheduling.""")
])


class TaskAgent:
    """A unified agent for task-related AI operations.
    
    This class handles all AI-powered task operations including parsing, 
    priority suggestions, scheduling, and summarization.
    """
    
    def __init__(self):
        self.llm = self._init_llm()
        self._setup_chains()

    def _init_llm(self) -> Optional[BaseLanguageModel]:
        """Initialize the appropriate LLM based on available API keys."""
        try:
            if os.getenv("OPENAI_API_KEY"):
                return ChatOpenAI(temperature=0.7, model="gpt-3.5-turbo")
            elif os.getenv("GOOGLE_API_KEY"):
                return ChatGooglePalm(temperature=0.7)
        except Exception as e:
            logger.warning(f"Failed to initialize LLM: {e}")
        return None

    def _setup_chains(self):
        """Set up LangChain chains for different operations."""
        if not self.llm:
            self.task_parse_chain = None
            self.priority_chain = None
            self.schedule_chain = None
            return

        # Task parsing chain
        task_parser = PydanticOutputParser(pydantic_object=TaskParseOutput)
        self.task_parse_chain = (
            TASK_PARSE_PROMPT.partial(format_instructions=task_parser.get_format_instructions())
            | self.llm
            | task_parser
        )

        # Priority suggestion chain
        priority_parser = PydanticOutputParser(pydantic_object=PrioritySuggestionOutput)
        self.priority_chain = (
            PRIORITY_SUGGEST_PROMPT.partial(format_instructions=priority_parser.get_format_instructions())
            | self.llm
            | priority_parser
        )

        # Schedule suggestion chain
        schedule_parser = PydanticOutputParser(pydantic_object=ScheduleSuggestionOutput)
        self.schedule_chain = (
            SCHEDULE_SUGGEST_PROMPT.partial(format_instructions=schedule_parser.get_format_instructions())
            | self.llm
            | schedule_parser
        )

    # Task Parsing
    async def parse_task(self, text: str) -> TaskCreate:
        """Parse natural language task into structured data using LangChain chains."""
        if not self.task_parse_chain:
            logger.info("No LLM available, using local parsing")
            return self._parse_nl_task_local(text)

        try:
            result = await self.task_parse_chain.ainvoke({"task_text": text})
            return self._convert_parse_result_to_task_create(result)
        except Exception as e:
            logger.error(f"LLM parsing failed: {e}")
            return self._parse_nl_task_local(text)

    def _convert_parse_result_to_task_create(self, parse_result: TaskParseOutput) -> TaskCreate:
        """Convert structured parse result to TaskCreate model."""
        due_date = None
        if parse_result.due_date:
            try:
                # Parse the ISO string back to datetime
                due_date = datetime.fromisoformat(parse_result.due_date.replace('Z', '+00:00'))
            except ValueError:
                logger.warning(f"Could not parse due_date: {parse_result.due_date}")

        return TaskCreate(
            title=parse_result.title,
            description=parse_result.description,
            due_date=due_date,
            priority=parse_result.priority
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
        """Suggest priority for a task using LangChain chains."""
        if not self.priority_chain:
            logger.info("No LLM available, using local priority suggestion")
            return self._suggest_priority_local(task)

        try:
            result = await self.priority_chain.ainvoke({
                "title": task.title,
                "description": task.description or "",
                "due_date": task.due_date.isoformat() if task.due_date else "None",
                "status": task.status or "todo"
            })
            return result.dict()
        except Exception as e:
            logger.error(f"LLM priority suggestion failed: {e}")
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
        """Suggest a schedule for the task using LangChain chains."""
        if not self.schedule_chain:
            logger.info("No LLM available, using local schedule suggestion")
            return self._suggest_schedule_local(task)

        try:
            result = await self.schedule_chain.ainvoke({
                "title": task.title,
                "priority": task.priority or "medium",
                "due_date": task.due_date.isoformat() if task.due_date else "None"
            })
            return result.dict()
        except Exception as e:
            logger.error(f"LLM schedule suggestion failed: {e}")
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
