import os

# Set an in-memory database for tests before importing the app
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("ENABLE_AI", "false")

from fastapi.testclient import TestClient
from main import app
from sqlmodel import Session
from app.db import engine, create_db_and_tables
from app.models import Task, TaskCreate, TaskUpdate
from app.routers.tasks import create_task, list_tasks, get_task, update_task, delete_task


client = TestClient(app)

# Create tables for unit tests
create_db_and_tables()


def test_create_and_suggest_task():
    # create a task
    payload = {"title": "Test task", "description": "A test"}
    resp = client.post("/tasks", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert "id" in data
    task_id = data["id"]

    # request suggestion
    resp2 = client.post(f"/tasks/{task_id}/suggest")
    assert resp2.status_code == 200
    sugg = resp2.json()
    assert "priority" in sugg and "confidence" in sugg and "explanation" in sugg


def test_create_task_repository():
    with Session(engine) as session:
        task_in = TaskCreate(title="Unit test task", description="Test description")
        task = create_task(task_in, session)
        assert task.id is not None
        assert task.title == "Unit test task"
        assert task.description == "Test description"
        assert task.priority == "medium"
        assert task.status == "todo"


def test_list_tasks_repository():
    with Session(engine) as session:
        # Create a task first
        task_in = TaskCreate(title="List test task")
        create_task(task_in, session)

        tasks = list_tasks(session)
        assert len(tasks) > 0
        assert any(t.title == "List test task" for t in tasks)


def test_get_task_repository():
    with Session(engine) as session:
        # Create a task first
        task_in = TaskCreate(title="Get test task")
        created_task = create_task(task_in, session)

        # Get the task
        task = get_task(created_task.id, session)
        assert task.id == created_task.id
        assert task.title == "Get test task"


def test_update_task_repository():
    with Session(engine) as session:
        # Create a task first
        task_in = TaskCreate(title="Update test task", priority="low")
        created_task = create_task(task_in, session)

        # Update the task
        update_in = TaskUpdate(title="Updated title", priority="high", status="in_progress")
        updated_task = update_task(created_task.id, update_in, session)
        assert updated_task.title == "Updated title"
        assert updated_task.priority == "high"
        assert updated_task.status == "in_progress"


def test_delete_task_repository():
    with Session(engine) as session:
        # Create a task first
        task_in = TaskCreate(title="Delete test task")
        created_task = create_task(task_in, session)

        # Delete the task
        result = delete_task(created_task.id, session)
        assert result.status_code == 204

        # Verify it's deleted
        try:
            get_task(created_task.id, session)
            assert False, "Task should have been deleted"
        except Exception as e:
            assert "404" in str(e) or "not found" in str(e).lower()
