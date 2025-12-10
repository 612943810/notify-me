from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
import os
from typing import Any, Dict

from ..db import engine
from ..models import Task, TaskCreate, TaskRead
from ..agents import parse_nl_task, summarize_task

router = APIRouter()


def get_session():
    with Session(engine) as session:
        yield session


@router.post('/agent/chat')
async def chat_agent(payload: Dict[str, Any], session: Session = Depends(get_session)):
    """Simple chat endpoint for agentic interactions.

    Payload: { "message": string, "automated": bool (optional) }

    Behavior:
    - Parse intent from message via provider `parse_task`.
    - If the parsed result looks like a create-task intent and agentic behaviour
      is enabled (env `ENABLE_AGENTIC_BEHAVIOR=true` or `automated` true), create the task.
    - Otherwise return a suggested action (no side effects).
    """
    msg = payload.get('message') if isinstance(payload, dict) else None
    automated = bool(payload.get('automated')) if isinstance(payload, dict) else False
    if not msg or not isinstance(msg, str):
        raise HTTPException(status_code=400, detail='message is required')

    # parse message into a TaskCreate (best-effort)
    parsed = await parse_nl_task(msg)

    # If parsed title exists, treat as create intent
    if parsed and parsed.title:
        # If not permitted, return suggested action only
        enabled = os.getenv('ENABLE_AGENTIC_BEHAVIOR', 'false').lower() in ('1', 'true', 'yes')
        if enabled or automated:
            # create the task
            task = Task(**parsed.model_dump())
            session.add(task)
            session.commit()
            session.refresh(task)
            return {
                'action': 'created',
                'task': TaskRead.model_validate(task).model_dump(),
                'explanation': 'Task created by agent',
            }
        else:
            # provide a suggested action (no side-effect)
            return {
                'action': 'suggest_create',
                'suggested_task': parsed.model_dump(),
                'explanation': 'Agentic behavior is disabled; set ENABLE_AGENTIC_BEHAVIOR to enable automated actions or pass automated=true',
            }

    # fallback: summarize message
    summary = summarize_task(Task(title=msg, description=None, priority='medium', status='todo'))
    return {'action': 'none', 'summary': summary}
