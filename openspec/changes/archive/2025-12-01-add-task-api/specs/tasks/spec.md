## ADDED Requirements

### Requirement: Task CRUD API
The system SHALL provide a Task CRUD API that allows clients to create, read, update, delete, and list tasks.

#### Scenario: Create task success
- **WHEN** a client POSTs a valid payload to `/tasks` with a title and optional due date
- **THEN** the system returns 201 Created with the new task's ID and stored fields

#### Scenario: List tasks with filters
- **WHEN** a client GETs `/tasks?status=todo&due_before=2025-12-01T00:00:00Z`
- **THEN** the system returns a list of tasks matching the filters and a 200 OK status

#### Scenario: Update task
- **WHEN** a client PUTs `/tasks/{id}` with valid updates
- **THEN** the system updates the persisted task and returns the updated resource with 200 OK

#### Scenario: Delete task
- **WHEN** a client DELETEs `/tasks/{id}`
- **THEN** the system marks the task as deleted (or removes it) and returns 204 No Content

### Requirement: Notifications scheduling (scaffold)
The system SHALL provide a mechanism to schedule notifications based on task due dates. Initial implementation SHALL be a placeholder/background task runner that logs notification events.

#### Scenario: Schedule notification
- **WHEN** a task with a due date is created and notifications are enabled
- **THEN** the system enqueues a notification job (or logs an intended notification) respecting the user's timezone and do-not-disturb rules

### Requirement: Advisory AI Agent for Task Suggestions
The system SHALL provide an advisory AI agent that can suggest task priorities and scheduling recommendations. The agent SHALL be advisory by default and MUST NOT change persisted tasks without explicit user approval.

#### Scenario: Request suggestion
- **WHEN** a client POSTs to `/tasks/{id}/suggest` (or requests a suggestion via internal hook)
- **THEN** the system returns a suggestion payload containing `{priority, confidence, explanation}` and a 200 OK

#### Scenario: Agent mock/dev mode
- **WHEN** `ENABLE_AI` is not enabled or an API key is not configured
- **THEN** the agent returns deterministic/mock suggestions suitable for local development and CI (no external calls)

#### Scenario: Advisory-only enforcement
- **WHEN** the agent provides a suggestion
- **THEN** the system does not apply changes to the task automatically; the client must explicitly accept/apply suggested updates via a separate endpoint or action
