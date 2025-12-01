## 1. Implementation
- [x] 1.1 Create `app/models.py` with Task SQLModel/SQLAlchemy model
- [x] 1.2 Create `app/db.py` to initialize SQLite engine and session
- [x] 1.3 Create `app/routers/tasks.py` with the REST endpoints listed in proposal.md
- [x] 1.4 Wire router into `main.py` and add configuration options
- [x] 1.5 Add unit tests for repository functions
- [x] 1.6 Add integration tests for endpoints using `TestClient`
- [x] 1.7 Add `.env.example` updates and README usage docs
- [x] 1.8 Create `app/agents.py` implementing an advisory AI agent (mockable)
- [x] 1.9 Add endpoint `POST /tasks/{id}/suggest` and wire agent suggestions into create/update flows as an optional hook
- [x] 1.10 Add unit + integration tests for the agent (mock OpenAI) and for the `/suggest` endpoint
- [x] 1.11 Add `ENABLE_AI` and `AI_MODE` config flags to `.env.example` and README (default advisory/mock mode)

## 2. Validation
- [x] 2.1 Run `pytest` and ensure all tests pass
- [x] 2.2 Run `openspec validate add-task-api --strict` (after adding spec deltas)

## 3. Optional
- [ ] 3.1 Add background scheduler job to enqueue notifications
- [ ] 3.2 Add email/SMS adapters (mocked in tests)
