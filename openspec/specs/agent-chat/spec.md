# agent-chat Specification

## Purpose
TBD - created by archiving change add-agent-chat. Update Purpose after archive.
## Requirements
### Requirement: Agent Chat Interface
The system SHALL provide a chat interface (backend + frontend) that accepts natural-language messages and returns structured suggested actions (create/update/delete tasks) with an explanation and confidence.

#### Scenario: Create task suggestion
- **WHEN** a user sends "Add a reminder to submit report tomorrow" via the chat UI
- **THEN** the system SHALL return a suggested `create` action with extracted `title`, `due_date` set to tomorrow, priority suggestion, explanation, and confidence score

#### Scenario: Execute create with approval
- **WHEN** the user approves the suggested create action in the UI
- **THEN** the frontend SHALL call the backend with `automated=true` and the backend SHALL create the task and return the created task object

### Requirement: Delete/Remove intent handling
The system SHALL detect delete/remove intents and identify target tasks; if ambiguous, it SHALL return candidates and request disambiguation.

#### Scenario: Delete with confirmation
- **WHEN** user says "Delete my old draft" and multiple candidate tasks match
- **THEN** the system SHALL return candidate tasks for user selection and SHALL NOT delete anything until a specific target is selected and confirmed

### Requirement: Human-in-the-loop Safety
By default, the chat SHALL operate in suggest-only mode. Execution SHALL only occur when:
- `ENABLE_AGENTIC_BEHAVIOR` is enabled AND the per-request `automated` flag is set, OR
- The user has explicitly enabled `automated_mode` in their settings.

#### Scenario: Suggest-only default
- **WHEN** the user sends a request and `ENABLE_AGENTIC_BEHAVIOR=false`
- **THEN** the system SHALL NOT perform any side-effecting actions and SHALL return a suggested action instead

### Requirement: Auditability
All suggestions and executed actions SHALL be recorded in an `AuditLog` with the following fields: timestamp, user (if available), provider used (local|openai|gemini), redacted input, action type, target task id (if applicable), outcome, and confidence.

#### Scenario: Audit record created
- **WHEN** an action is executed by the agent
- **THEN** an audit record SHALL be persisted with relevant metadata and a redacted copy of the input

### Requirement: Ambiguity & Disambiguation
If parsed intent lacks required data (e.g., missing target task id for delete), the chat SHALL return candidate suggestions and a follow-up question to clarify.

#### Scenario: Ambiguity prompt
- **WHEN** the agent finds multiple tasks that match "my draft"
- **THEN** the response SHALL list candidates and prompt the user to pick or provide additional context

### Requirement: CI & Cost Safety
The system SHALL default to local deterministic parsing in CI/dev (`ENABLE_AI=false`) and SHALL NOT call external providers unless explicitly enabled. Agentic execution SHALL be additionally gated by `ENABLE_AGENTIC_BEHAVIOR`.

