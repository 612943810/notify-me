# frontend Specification

## Purpose
TBD - created by archiving change add-frontend-spec. Update Purpose after archive.
## Requirements
### Requirement: Web UI for Task Management
The system SHALL provide a responsive web UI allowing users to create, read, update, and delete tasks, view metadata (priority, due date, status), and request AI suggestions per task.

#### Scenario: User creates and views a task
- **GIVEN** a user is authenticated or using the local dev flow
- **WHEN** they create a task via the UI with title and optional description
- **THEN** the task SHALL appear in the user's task list and be persisted via the backend API

#### Scenario: User requests a priority suggestion
- **WHEN** a user clicks "Suggest" on a task
- **THEN** the frontend SHALL call `POST /tasks/{id}/suggest` and display the returned suggestion (priority, confidence, explanation)

### Requirement: Authentication
The frontend SHALL integrate with an authentication mechanism. For early iterations, a stubbed dev-mode auth or cookie-based session is acceptable, but production SHALL enforce secure authentication.

#### Scenario: Unauthenticated access
- **WHEN** the frontend attempts an authenticated endpoint without a valid session
- **THEN** the backend SHALL return `401` and the frontend SHALL redirect to a login flow or display an appropriate message

### Requirement: Real-time Updates
The frontend SHALL receive updates when tasks change (via WebSocket or fallback polling) and update the UI in near-real-time.

#### Scenario: Task update notification
- **WHEN** Task A is updated in the backend
- **THEN** the frontend SHALL receive a notification and update Task A's display within the task list

### Requirement: Responsive & Accessible UI
The frontend SHALL be responsive for desktop and mobile and meet basic accessibility standards (keyboard navigation and semantic HTML).

#### Scenario: Mobile layout
- **WHEN** a user opens the UI on a narrow viewport
- **THEN** the layout SHALL adapt to a single-column view and controls remain usable via touch

### Requirement: API & Integration
The frontend SHALL rely on API contracts (CORS and WebSocket). The backend SHALL provide CORS headers for the frontend origin in dev and a WebSocket endpoint that authenticates connections.

#### Scenario: CORS and proxy
- **WHEN** the frontend makes an API request from `http://localhost:5173`
- **THEN** the backend SHALL respond with appropriate CORS headers OR a Vite dev proxy SHALL be configured

### Requirement: Notifications & Agentic UX
The frontend SHALL present agentic suggestions and scheduled reminders; all agentic actions that modify tasks SHALL require explicit user approval unless user has enabled `automated_mode`.

#### Scenario: Agent suggestion requires approval
- **WHEN** the agent proposes changing a task's priority
- **THEN** the frontend SHALL display the suggestion with explanation and a clear approval action; automatic changes SHALL NOT be applied without explicit consent unless `automated_mode` is set

