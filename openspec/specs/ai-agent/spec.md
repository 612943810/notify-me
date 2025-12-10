# ai-agent Specification

## Purpose
TBD - created by archiving change add-ai-agent. Update Purpose after archive.
## Requirements
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

### Requirement: Natural Language Task Processing
The system SHALL provide natural language processing capabilities to create and analyze tasks from user input.

#### Scenario: Task creation from natural language
- **WHEN** a user provides natural language input like "Schedule team meeting for tomorrow at 2pm"
- **THEN** the system extracts task title, description, due date, and priority automatically
- **AND** creates a structured task with the extracted information

#### Scenario: Task analysis from description
- **WHEN** a user provides a task description with context
- **THEN** the system analyzes the content for complexity, estimated duration, and dependencies
- **AND** provides insights and suggestions for task management

### Requirement: Intelligent Priority Analysis
The system SHALL provide AI-powered priority analysis that considers multiple factors beyond due dates.

#### Scenario: Enhanced priority scoring
- **WHEN** priority analysis is requested for a task
- **THEN** the system analyzes task complexity, dependencies, user workload, and deadlines
- **AND** provides a confidence-scored priority recommendation with detailed reasoning

#### Scenario: Workload-aware prioritization
- **WHEN** analyzing multiple tasks for a user
- **THEN** the system considers current workload and capacity
- **AND** suggests optimal task ordering and scheduling recommendations

### Requirement: Smart Scheduling Suggestions
The system SHALL provide intelligent scheduling recommendations based on task requirements and user patterns.

#### Scenario: Optimal timing suggestions
- **WHEN** a task has flexible timing requirements
- **THEN** the system analyzes user's historical completion patterns and current schedule
- **AND** suggests optimal time slots for task completion

#### Scenario: Conflict resolution
- **WHEN** potential scheduling conflicts are detected
- **THEN** the system provides alternative scheduling options
- **AND** explains the reasoning behind each recommendation

### Requirement: Proactive Task Recommendations
The system SHALL provide proactive suggestions to help users manage their tasks more effectively.

#### Scenario: Task decomposition suggestions
- **WHEN** a complex task is identified
- **THEN** the system suggests breaking it down into smaller, manageable subtasks
- **AND** provides a recommended order of completion

#### Scenario: Deadline risk alerts
- **WHEN** tasks are at risk of missing deadlines
- **THEN** the system proactively alerts users with specific mitigation suggestions
- **AND** provides options for re-prioritization or deadline adjustment

### Requirement: AI Provider Integration
The system SHALL integrate with multiple AI providers while maintaining consistent functionality.

#### Scenario: Gemini integration
- **WHEN** Google Gemini API is configured and available
- **THEN** the system uses Gemini for natural language processing and analysis
- **AND** falls back to rule-based logic if Gemini becomes unavailable

#### Scenario: OpenAI integration
- **WHEN** OpenAI API is configured and available
- **THEN** the system uses OpenAI models for task analysis and recommendations
- **AND** maintains consistent behavior regardless of provider

#### Scenario: Provider fallback
- **WHEN** the primary AI provider is unavailable or exceeds rate limits
- **THEN** the system gracefully falls back to secondary provider or rule-based logic
- **AND** maintains core functionality without service interruption

### Requirement: Cost and Privacy Controls
The system SHALL provide controls for managing AI costs and protecting user privacy.

#### Scenario: Usage monitoring
- **WHEN** AI features are used
- **THEN** the system tracks API usage and associated costs
- **AND** provides visibility into consumption patterns

#### Scenario: Privacy protection
- **WHEN** processing user task data with AI providers
- **THEN** the system anonymizes sensitive information when possible
- **AND** provides clear disclosure about data usage
- **AND** allows users to opt-out of AI processing

### Requirement: AI Task Parsing API
The system SHALL provide an API endpoint to parse natural language task descriptions into structured task data.

#### Scenario: Parse simple task
- **WHEN** a user submits "Buy milk tomorrow"
- **THEN** the system returns a TaskCreate object with title "Buy milk tomorrow", due_date set to tomorrow, and priority "medium"

#### Scenario: Parse complex task with priority
- **WHEN** a user submits "Urgent: Fix critical bug in production"
- **THEN** the system returns a TaskCreate object with priority "high" and appropriate title/description

### Requirement: AI Priority Suggestion Service
The system SHALL provide a service to suggest task priorities based on task content and due dates.

#### Scenario: Suggest priority for urgent task
- **WHEN** a task is due within 24 hours
- **THEN** the system suggests priority "high" with confidence >= 0.8

#### Scenario: Suggest priority for normal task
- **WHEN** a task has no due date or is far in the future
- **THEN** the system suggests priority "medium" with confidence >= 0.5

### Requirement: AI Schedule Suggestion Service
The system SHALL provide a service to suggest optimal scheduling for tasks.

#### Scenario: Suggest schedule for task with due date
- **WHEN** a task has a due date
- **THEN** the system suggests a start time before the due date with appropriate duration

#### Scenario: Suggest schedule for task without due date
- **WHEN** a task has no due date
- **THEN** the system suggests a start time 1 hour from now with 1-hour duration

### Requirement: AI Task Summarization Service
The system SHALL provide a service to generate concise summaries of tasks.

#### Scenario: Summarize task with all fields
- **WHEN** a task has title, description, priority, due date, and status
- **THEN** the system returns a summary including all key fields in a readable format

#### Scenario: Summarize minimal task
- **WHEN** a task only has a title
- **THEN** the system returns a simple title-only summary

### Requirement: AI Provider Fallback System
The system SHALL gracefully fallback to local implementations when AI providers are unavailable.

#### Scenario: Fallback when API keys missing
- **WHEN** no AI API keys are configured
- **THEN** the system uses local parsing and suggestion methods

#### Scenario: Fallback on AI errors
- **WHEN** AI provider returns an error
- **THEN** the system gracefully falls back to local implementations

### Requirement: AI Testing Framework
The system SHALL include comprehensive tests for all AI functionality.

#### Scenario: Test parsing with mock AI
- **WHEN** running unit tests
- **THEN** parsing tests use mock AI responses and verify correct TaskCreate output

#### Scenario: Test fallback behavior
- **WHEN** testing without API keys
- **THEN** tests verify local implementations work correctly

