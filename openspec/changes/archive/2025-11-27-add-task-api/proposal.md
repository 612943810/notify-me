```markdown
# Change: Add Task API

## Why

We need a minimal Task CRUD API and persistence layer to make Notify Me usable for real task management and to enable the notification scheduler. This forms the foundation for agent-driven suggestions and notification delivery.

## What Changes

 - Add new REST endpoints for task CRUD and listing
   - `POST /tasks` - create task
   - `GET /tasks` - list tasks (filter by status, due date, etc.)
   - `GET /tasks/{id}` - fetch task
   - `PUT /tasks/{id}` - update task
   - `DELETE /tasks/{id}` - delete task
 - Add a persistence model and repository (SQLite via SQLModel or SQLAlchemy)
 - Add background scheduler placeholder for sending notifications
 - Add tests for endpoints and repository
 - Update `README.md` with API usage
 - Add an AI agent integration (advisory-first)
   - Provide an advisory AI agent that suggests task priorities and scheduling recommendations.
   - Expose an endpoint `POST /tasks/{id}/suggest` to request suggestions for a task.
   - Agent runs in two modes controlled by env: `ENABLE_AI=true` to enable live OpenAI calls, otherwise the agent returns deterministic/mock suggestions for local dev and CI.
   - The agent is advisory by default: it MUST NOT modify tasks without explicit user approval. An additional autonomous mode may be added later behind a separate config flag and audit logging.

**BREAKING**: None. This is additive.

## Impact

- Affected specs: tasks capability (new)
- Affected code: `main.py`, new `app/tasks.py` or `app/routers/tasks.py`, `app/models.py`, `app/db.py`, `app/agents.py`, tests under `tests/`.
- Deployment: None (backwards compatible). Local SQLite file will be used for dev.

## Rollout Plan / Migration

- Start with in-memory/SQLite implementation behind a feature flag in config.
- Add migrations if moving to Postgres later (out-of-scope for initial change).

```
