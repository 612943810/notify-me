## Change: Add Agent Chat Capability

### Why
Users need a conversational interface that allows them to manage tasks naturally (create, update, remove) using plain language. An agentic chat enables faster capture and hands-free management, and aligns with the product goal of proactive, AI-assisted task reminders.

This change scopes the agent chat feature and defines safety, privacy, and operational guardrails so the implementation is auditable and testable.

### What Changes
- Add an `agent-chat` capability spec describing chat intent handling, action mapping (create/update/delete), and UX for approvals.
- Define a provider-agnostic intent parsing flow and action executor with human-in-the-loop confirmations.
- Implement backend chat endpoint(s) that accept messages and return suggested or executed actions. Agentic execution MUST be gated behind `ENABLE_AGENTIC_BEHAVIOR` and/or explicit `automated=true` request flag.
- Surface chat UI components in the frontend (conversational box) and show suggested actions, confirmations, and audit history.

### Impact
- Affected specs: `agent-chat` (new)
- Affected code: backend chat router(s), agent provider adapters, task model and audit log models, frontend chat UI, notification subsystems
- Operational: introduces a recordable audit log and requires documented opt-in controls and rate limiting

### Non-goals
- Building a fully autonomous agent that makes irreversible changes without user oversight by default. Fully automated mode may be added as an explicit opt-in and documented feature.
- Integrating advanced LLM tool-chains or full LangChain Agents in the first iteration; prefer a thin intent-parser + action executor.
