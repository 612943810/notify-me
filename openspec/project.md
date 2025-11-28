# Project Context
# Project Context

## Purpose
Notify Me is an intelligent task management and reminder service that helps users capture tasks, prioritize work using AI assistance, and receive timely notifications so they don't miss deadlines. The project provides a REST API and lightweight web UI (future) and integrates optional AI helpers for prioritization and scheduling.

## Tech Stack
- Language: Python 3.8+ (recommended 3.11+)
- Web framework: FastAPI + Uvicorn
-- AI/agents: LangChain (optional integration) and Google Gemini (preferred) or OpenAI API
- Data: SQLite for local/dev persistence (SQLModel or SQLAlchemy), swappable for PostgreSQL in production
- Background jobs: FastAPI BackgroundTasks or APScheduler for notification scheduling
- Config: python-dotenv for local env, environment variables for deployment
- Testing: pytest
- Dev tooling: black, isort, flake8 (optional), pre-commit

## Project Conventions

### Code Style
- Formatting: `black` for automatic formatting
- Imports: `isort` for order and grouping
- Linting: `flake8` or `ruff` for style and quality checks
- Typing: Prefer type hints for public functions; keep signatures simple
- Docstrings: Use short module/function docstrings (reStructuredText or Google-style)

### Architecture Patterns
- API-first: expose features via REST endpoints in `main.py` / `app` package
- Modular services: separate AI/agent integrations into their own modules to avoid import-time failures (lazy imports)
- Persistence abstraction: use a simple repository layer so switching from SQLite to Postgres is straightforward
-- Keep third-party integrations (Gemini/OpenAI, email, SMS) behind adapter interfaces for testing/mocking

### Testing Strategy
- Unit tests: `pytest` for business logic and small modules
- Integration tests: pytest with TestClient for API endpoints (tests live under `tests/`)
-- Mock external services in CI (Gemini/OpenAI, email) and use environment variables to enable/disable live calls
- Aim for small, fast tests (default < 1s per unit test)

### Git Workflow
- Branching: `main` is the canonical branch. Feature branches: `feature/<short-desc>` or `changes/<change-id>` for OpenSpec work.
- Commits: Prefer concise messages, optionally follow Conventional Commits (feat/, fix/, docs/)
- PRs: Open a PR per change proposal, link the corresponding `openspec/changes/<change-id>/` directory

## Domain Context
- Core domain: tasks and reminders. A task has: title, description, due date/time, priority, status (todo/in-progress/done), optional recurrence rules, and optional notification channels (email/SMS/webhook).
- Business rules: notifications should respect user local timezone, respect do-not-disturb windows, and avoid spam (rate-limit notifications).
- AI behavior: AI suggestions (priority, due-date adjustments) are advisory only — user must approve changes.

## Important Constraints
- Privacy: Do not store sensitive PII in plain text or send it to external services without consent.
-- API keys: `GEMINI_API_KEY`, `OPENAI_API_KEY`, and other secrets must be provided via environment variables; never commit them.
- Cost: OpenAI usage should be opt-in; default is to mock or disable live calls in CI/dev.

## External Dependencies
-- Google Gemini API or OpenAI API (optional) — used for prioritization and smart suggestions
- Email provider (SMTP) or SendGrid/Mailgun for notifications (optional)
- SMS provider (Twilio) for SMS notifications (optional)
- Optional: Sentry for error monitoring

```
