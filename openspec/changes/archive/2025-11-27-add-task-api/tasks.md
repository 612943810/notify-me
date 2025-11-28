```markdown
## 1. Implementation
- [ ] 1.1 Create `app/models.py` with Task SQLModel/SQLAlchemy model
- [ ] 1.2 Create `app/db.py` to initialize SQLite engine and session
- [ ] 1.3 Create `app/routers/tasks.py` with the REST endpoints listed in proposal.md
- [ ] 1.4 Wire router into `main.py` and add configuration options
- [ ] 1.5 Add unit tests for repository functions
- [ ] 1.6 Add integration tests for endpoints using `TestClient`
- [ ] 1.7 Add `.env.example` updates and README usage docs
- [ ] 1.8 Create `app/agents.py` implementing an advisory AI agent (mockable)
- [ ] 1.9 Add endpoint `POST /tasks/{id}/suggest` and wire agent suggestions into create/update flows as an optional hook
- [ ] 1.10 Add unit + integration tests for the agent (mock OpenAI) and for the `/suggest` endpoint
- [ ] 1.11 Add `ENABLE_AI` and `AI_MODE` config flags to `.env.example` and README (default advisory/mock mode)

## 2. Validation
- [ ] 2.1 Run `pytest` and ensure all tests pass
- [ ] 2.2 Run `openspec validate add-task-api --strict` (after adding spec deltas)

## 3. Optional
- [ ] 3.1 Add background scheduler job to enqueue notifications
- [ ] 3.2 Add email/SMS adapters (mocked in tests)

```
