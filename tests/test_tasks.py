import os

# Set an in-memory database for tests before importing the app
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("ENABLE_AI", "false")

from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


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
