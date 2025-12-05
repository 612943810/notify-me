## ADDED Requirements

### Requirement: AI Agent Capability
The system SHALL provide an `ai-agent` capability that exposes deterministic, test-friendly AI helpers for task management. The capability SHALL be pluggable so that different underlying providers (local deterministic, Google Gemini, OpenAI) can be used.

#### Scenario: Suggest priority locally
- **WHEN** a request is made to the local priority helper with a `Task` that has a `due_date` within 24 hours
- **THEN** the helper SHALL return `{"priority": "high", "confidence": 0.9, "explanation": "Due within 24 hours."}` or equivalent deterministic output

#### Scenario: Parse NL task
- **WHEN** a user submits a short natural-language task like "Finish report due tomorrow, urgent"
- **THEN** the system SHALL parse and return a `TaskCreate` DTO with `title`, optional `description`, `due_date` set to tomorrow, and `priority` set to `high`

#### Scenario: Suggest schedule
- **WHEN** a task with a due date and priority is provided
- **THEN** the system SHALL return a suggested start time that is a deterministic offset from the due date based on priority

#### Scenario: Summarize task
- **WHEN** asked to summarize a task
- **THEN** the system SHALL return a short human-readable summary string that includes title, due date (if present), priority and status

### Requirement: Agentic Behaviour (Proactive Suggestions & Reminders)
The system MAY perform proactive scans and send reminders or suggestions based on task deadlines and user preferences. Agentic behaviour MUST be opt-in and respect user-level settings such as Do-Not-Disturb windows and notification frequency limits.

#### Scenario: Proactive reminder (opt-in)
- **WHEN** a user has opted in to agentic behaviour and a `Task` is due within the reminder window
- **THEN** the system SHALL enqueue a reminder notification and record the planned action in the audit log; the notification payload SHALL include an explanation and confidence score

#### Scenario: Respect DND
- **WHEN** the user's Do-Not-Disturb window is active
- **THEN** the system SHALL not deliver proactive notifications during that window; it may schedule delivery for the next allowed window

### Requirement: Human-in-the-loop and Safety
The agent SHALL NOT mutate tasks without explicit user approval unless the user has enabled a separate `automated_mode` setting. All suggested mutations SHALL include an explanation, confidence, and a link to approve the change.

#### Scenario: Require approval
- **WHEN** the agent proposes changing a task's priority or due date
- **THEN** the system SHALL persist the suggestion and await user confirmation before applying the change

### Requirement: Auditability and Privacy
The system SHALL record all agent actions and suggestions in an audit log. Inputs sent to external providers SHALL be redacted to remove PII and secrets before transmission.

#### Scenario: Audit record
- **WHEN** the agent sends a suggestion or reminder
- **THEN** the system SHALL create an audit record containing the timestamp, task id, provider used (if any), redacted input, and action taken

### Requirement: CI & Cost Safety
The system SHALL default to the deterministic local adapter in non-production environments and SHALL NOT make network calls unless `ENABLE_AI` and the appropriate provider keys are set. Agentic behaviour SHALL be additionally gated by `ENABLE_AGENTIC_BEHAVIOR`.

#### Scenario: CI safety
- **WHEN** running in CI or with `ENABLE_AI=false` or `ENABLE_AGENTIC_BEHAVIOR=false`
- **THEN** the system SHALL not perform external provider calls nor enqueue proactive reminders

### Requirement: Pluggable Provider Interface
The system SHALL provide a small adapter interface that enables swapping provider implementations without changing the agent API. The adapter SHALL be instantiated lazily to avoid import-time failures when keys are not present.

#### Scenario: Provider selection
- **WHEN** `ENABLE_GEMINI` is truthy and `GEMINI_API_KEY` is present
- **THEN** the system SHALL prefer the Gemini adapter implementation

#### Scenario: CI safety
- **WHEN** `ENABLE_AI` is not set or is falsy
- **THEN** the system SHALL use the deterministic local adapter and SHALL NOT make network calls to external providers
