## Design: AI Agent - Provider Adapter & Fallback

### Context
We need a pluggable, minimal adapter that allows optional live calls to Gemini/OpenAI while keeping deterministic behaviour for tests and CI. The design should be simple, auditable, and minimize blast radius for secrets and network calls.

### Goals
- Provide a small adapter interface for calls used by the agent (e.g., `generate_priority`, `parse_task`, `summarize`).
- Default to a deterministic local implementation when `ENABLE_AI` is falsy or API keys are not present.
- Allow tests and CI to mock provider implementations easily.
- Keep signatures synchronous/async consistent with FastAPI usage.
 - Support a lightweight orchestration layer for agentic behaviour (scheduled scans, proactive suggestions, and reminders) while keeping business logic testable.

### Interface
- `class ProviderAdapter` (abstract)
  - `async def generate_priority(self, prompt: str) -> Dict[str, Any]`
  - `async def parse_task(self, text: str) -> Dict[str, Any]`
  - `async def summarize(self, text: str) -> str`

Implementations:
- `LocalAdapter` — deterministic, rule-based; used when `ENABLE_AI=false` or no API key
- `GeminiAdapter` — calls Google Gemini API; enabled when `ENABLE_GEMINI=true` and `GEMINI_API_KEY` set
- `OpenAIAdapter` — calls OpenAI when `ENABLE_AI=true` and `OPENAI_API_KEY` set

### Agent Orchestration (Agentic Behavior)

- A small orchestration component (`AgentController`) will be responsible for:
  - Periodically scanning tasks for upcoming deadlines and trigger proactive suggestions
  - Scheduling reminder jobs and dispatching notifications via configured channels
  - Recording actions taken and requiring human approval for any automated changes to tasks (human-in-the-loop)

- Implementation details:
  - Use `APScheduler` or FastAPI `BackgroundTasks` for scheduling; keep scheduling decisions deterministic and testable
  - Persist scheduled reminders and agent actions in the database for auditability
  - AgentController will call the provider adapter for any LLM-assisted suggestion, but fall back to `LocalAdapter` if providers are not enabled

### Privacy, Consent & Controls

- Agentic behaviours MUST be opt-in. Provide an `ENABLE_AGENTIC_BEHAVIOR` environment flag (or user-level preference) that gates proactive actions.
- Provide Do-Not-Disturb and notification window settings; agent must respect these when scheduling reminders.
- Implement an audit log of agent actions (what suggestion, when, provider used, redacted inputs) stored in DB for at least 30 days.

### Human-in-the-loop & Safety

- Agents MAY propose changes but MUST NOT mutate tasks without explicit user approval unless user has explicitly enabled fully automated mode.
- For automated notifications that suggest changes, include an explanation and confidence score in the notification payload.
- Implement rate-limiting for proactive suggestions and notification delivery to prevent spam or runaway behavior.

### Monitoring & Observability

- Record metrics for agent actions, provider errors, and notification delivery failures.
- Provide a simple health-check endpoint for the agent orchestration component.

### Security & Cost Guardrails
- Never call live providers in CI by default; require `ENABLE_AI=true` and explicit env var present.
- Log only metadata (no secrets) and redact any PII before sending to providers (documented requirement).
- Provide rate-limiting and retry/backoff in provider adapters.

### Error Handling
- Provider errors should not surface to end-users as 5xx; return a graceful fallback response and log the error.

### Migration Plan
- Implement `LocalAdapter` and default wiring in `app/agents.py` first.
- Add provider adapters in separate files behind a factory function to keep imports lazy.
