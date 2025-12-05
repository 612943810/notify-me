## 1. Implementation

- [ ] 1.1 Create `openspec/changes/add-ai-agent/` proposal (this file)
- [ ] 1.2 Add `openspec/changes/add-ai-agent/specs/ai-agent/spec.md` (capability delta)
- [ ] 1.3 Design `design.md` detailing provider adapter and security constraints
- [ ] 1.4 Implement pluggable provider adapter interface `app/agents/provider.py`
- [ ] 1.5 Implement deterministic, test-friendly fallback in `app/agents.py` or `app/agents/local.py`
- [ ] 1.6 Add unit tests for parsing, scheduling, summary helpers in `tests/test_agents.py`
- [ ] 1.7 Add API endpoints (optional) in `app/routers/tasks.py` to expose parse/schedule/summary
- [ ] 1.8 Add integration tests that assert no live external calls when `ENABLE_AI=false`
- [ ] 1.9 Document env vars and usage in `README.md` and `openspec` docs
 - [ ] 1.10 Implement lightweight `AgentController` orchestration component for proactive scans and reminders
 - [ ] 1.11 Add scheduler integration (APScheduler or BackgroundTasks) and persistence for scheduled reminders
 - [ ] 1.12 Implement notification delivery adapters (email/webhook/SMS) and a simple rate-limiter
 - [ ] 1.13 Implement user-level opt-in flags and DND/notification window settings
 - [ ] 1.14 Add audit log model and tests ensuring agent actions are recorded and redacted
 - [ ] 1.15 Add integration tests validating agentic behaviour is gated by `ENABLE_AGENTIC_BEHAVIOR` and does not run in CI

## 2. Validation

- [ ] 2.1 Run `openspec validate add-ai-agent --strict` and fix issues
- [ ] 2.2 Run pytest and ensure deterministic tests pass in CI

