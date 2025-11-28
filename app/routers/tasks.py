from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlmodel import Session, select
from typing import List

from ..models import Task, TaskCreate, TaskRead, TaskUpdate
from ..db import engine
from ..agents import suggest_priority

router = APIRouter()


def get_session():
    with Session(engine) as session:
        yield session


@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, session: Session = Depends(get_session)):
    task = Task.from_orm(task_in)
    if task.priority is None:
        task.priority = "medium"
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("/tasks", response_model=List[TaskRead])
def list_tasks(session: Session = Depends(get_session)):
    statement = select(Task)
    results = session.exec(statement).all()
    return results


@router.get("/tasks/{task_id}", response_model=TaskRead)
def get_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(task_id: int, task_in: TaskUpdate, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task_data = task_in.dict(exclude_unset=True)
    for key, val in task_data.items():
        setattr(task, key, val)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/tasks/{task_id}/suggest")
async def suggest(task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    suggestion = await suggest_priority(task)
    return suggestion
