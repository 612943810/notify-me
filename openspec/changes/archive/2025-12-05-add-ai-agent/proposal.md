## Change: Add AI Agent Capability

### Why
- Natural-language task creation (parse short task descriptions)
- Advisory prioritization (suggest priority with confidence)
- Simple scheduling suggestions (start windows)
- Compact task summarization for notifications and UIs
The project currently contains a small, deterministic agent in `app/agents.py` used for priority suggestions. Stakeholders clarified the product intent: this is not meant to be a regular web app, but an application with agentic capabilities that can proactively help users capture, prioritize and remind them of important deadlines.

Key user-facing capabilities requested:
- Natural-language task creation (parse short task descriptions)
- Advisory prioritization (suggest priority with confidence)
- Simple scheduling suggestions (start windows)
- Compact task summarization for notifications and UIs
- Proactive recommendations and background reminders (agentic behaviour)
- Natural-language task creation (parse short task descriptions)
- Advisory prioritization (suggest priority with confidence)
- Simple scheduling suggestions (start windows)
- Compact task summarization for notifications and UIs

Providing a formal OpenSpec change will:
- Define the agent API and expectations
- Ensure the implementation is pluggable (Gemini/OpenAI) and mockable for tests/CI
- Capture security, privacy, and cost guardrails before implementation

### What Changes
- Add a new capability spec `ai-agent` describing the AI helpers and behaviours.
- Introduce a pluggable provider interface with a deterministic, test-friendly fallback.
- Implement agent helpers behind a narrow API in `app/agents.py` (or new modules) and document usage.
- Add repository & API tests validating deterministic behaviour when `ENABLE_AI` is disabled.
- Extend the agent API to support proactive, background behaviours: scheduled reminders, proactive suggestions, and human-in-the-loop approval flows.
- Define clear consent, audit, and DND controls so the agent's proactive behaviour is opt-in and auditable.

### Impact
- Affected specs: `ai-agent` (new)
- Affected code: `app/agents.py`, optionally new modules `app/agents/*`, `app/routers/tasks.py` (new endpoints), `app/models.py` (if new DTOs are required), tests under `tests/`
- External dependencies: Optional Gemini/OpenAI integration behind adapter interfaces (opt-in via env vars)
- Risk: Improper handling of secrets or unintended live calls in CI; mitigated by defaulting to deterministic fallback and explicit `ENABLE_AI` flag

Additional impact considering agentic behaviour:
- Background task scheduling and a small orchestration component (e.g., APScheduler or FastAPI BackgroundTasks) to perform proactive checks and send reminders.
- Notification delivery adapters (email/SMS/webhook) and their configuration & rate-limiting.
- New privacy and consent flows and audit logs for actions taken autonomously by agents.

### Non-goals
- Full LangChain integration at this stage (may be added in a follow-up change)
- Heavyweight ML infra or model hosting
 - Full LangChain agent with complex tool use in the first iteration (may be added later); prefer a minimal adapter first
 - Turning on live provider calls by default — agentic behaviours must remain opt-in
