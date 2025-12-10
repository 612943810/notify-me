## Design: Agent Chat — Intent Parsing and Safe Execution

### Goals
- Provide a conversational endpoint that can parse intent (create/update/delete tasks) from natural language.
- Keep execution safe by default: the chat should return suggested actions unless agentic execution is explicitly enabled and permitted.
- Make the implementation provider-agnostic and testable; intent parsing may be implemented with a local rule-based fallback and optionally use LLMs via the provider adapter.

### High-level Flow
1. Client sends a chat message to `/agent/chat` with optional `automated` flag.
2. Server calls `Provider.parse_task` or local parser to extract intent and structured fields (title, description, due_date, action type, target id).
3. Server returns a suggested action payload: `{ action: 'create'|'update'|'delete'|'none', suggested: {...}, confidence, explanation }`.
4. If the client or environment requests execution and `ENABLE_AGENTIC_BEHAVIOR` is true (or user has `automated_mode`), the `AgentExecutor` attempts the action and records an `AuditLog` entry. Otherwise the action is not applied.

### Intent Types
- Create: produce `TaskCreate` fields.
- Update: produce fields and target `task_id` (if not specified, agent may suggest candidates).
- Delete: produce `task_id` or candidate selection.
- Query/List/Other: respond with summary or guidance (no mutation).

### Safety & Human-in-the-loop
- Default mode: suggest-only (no DB mutation).
- Execution gating:
  - Global gate via `ENABLE_AGENTIC_BEHAVIOR` env var.
  - Per-request `automated=true` payload (still subject to global gate).
  - User-level `automated_mode` setting (explicit opt-in to allow automatic changes).
- All executed actions MUST be recorded in an `AuditLog` with redacted inputs and provider metadata.

### Provider Integration & Fallbacks
- Use the provider adapter factory: local deterministic parser as default, LangChainAdapter/OpenAI/Gemini when enabled.
- Keep prompt design minimal: ask providers to return JSON objects with well-defined keys to simplify parsing.

### Executor Responsibilities
- Validate parsed intent and required fields.
- If ambiguity exists (multiple candidate tasks), return candidates for user disambiguation rather than executing.
- Apply DB changes in a transaction and write an AuditLog entry; include an `explanation` and `confidence` fields.

### Monitoring and Rate Limiting
- Track chat usage counts, provider call counts, and failures (Prometheus metrics).
- Implement rate-limiting per-user to avoid abuse.

### UX Notes (Frontend)
- Chat UI shows a suggested action with human-friendly summary and explicit Approve/Reject buttons.
- When approved, the frontend calls `/agent/chat` with `automated=true` to execute the action (or a dedicated `/agent/execute` endpoint).
- Show audit history and an undo option where feasible (soft-delete or keep action seeds to revert).
