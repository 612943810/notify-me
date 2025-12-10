## 1. Implementation

- [ ] 1.1 Create `openspec/changes/add-agent-chat/` proposal (this file)
- [ ] 1.2 Add `openspec/changes/add-agent-chat/specs/agent-chat/spec.md` (capability delta)
- [ ] 1.3 Add `openspec/changes/add-agent-chat/design.md` describing intent parsing, actions, and safety
- [ ] 1.4 Implement backend chat endpoint(s) under `app/routers/agent.py` (non-destructive suggest mode and gated execute mode)
- [ ] 1.5 Implement an `AgentExecutor` component responsible for mapping parsed intents to actions (create/update/delete) and applying them when authorized
- [ ] 1.6 Add an `AuditLog` model to persist agent suggestions and actions (redacted inputs, timestamps, actor, provider)
- [ ] 1.7 Add frontend chat UI component and UX for reviewing and approving suggested actions
- [ ] 1.8 Add unit tests for intent parsing, executor mapping, and gating behaviour (ensure non-destructive by default)
- [ ] 1.9 Add integration tests covering end-to-end chat flows (suggest-only, confirm-and-execute, automated mode)
- [ ] 1.10 Add rate-limiting, metrics, and monitoring for agent chat usage
- [ ] 1.11 Document env vars and admin controls for enabling agentic behaviour

## 2. Validation

- [ ] 2.1 Run `openspec validate add-agent-chat --strict` and fix issues
- [ ] 2.2 Run pytest and ensure deterministic tests pass with `ENABLE_AI=false`
