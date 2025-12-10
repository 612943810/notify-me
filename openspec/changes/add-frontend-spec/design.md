## Design: Frontend Architecture & Integration Notes

### Tech choices (minimal, pragmatic)
- Framework: React + TypeScript (already present via Vite)
- Styling: Tailwind CSS (already configured)
- Data fetching: `@tanstack/react-query` + `axios` for API calls
- Build: Vite, with `VITE_API_BASE` env var for API base during dev
- State: keep local component state + React Query for server state; avoid complex global state unless needed

### Real-time updates
- Use WebSocket endpoint (backend) for real-time task updates. For local dev, Vite's proxy or Polling fallback is acceptable.
- Keep messages small: only task id and updated fields. Frontend should `refetch` or update cache via React Query upon notification.

### API contract & CORS
- Frontend expects these backend behaviours:
  - `GET /tasks` → list tasks
  - `POST /tasks` → create task
  - `POST /tasks/{id}/suggest` → return suggestion JSON
  - CORS: backend must include permissive CORS for the frontend origin in dev; production should be restrictive.

### Auth & Security
- Start with a stubbed local auth or cookie-based session for early work. Document the auth contract so backend can return 401/403.
- Avoid storing secrets in frontend; use backend proxies for sensitive operations.

### Notifications & Reminders
- Frontend will show scheduled reminders and allow users to opt-in/out of agentic behaviour.
- Notification delivery is backend responsibility; frontend displays and allows acknowledgement/approval of agent suggestions.

### Accessibility & Internationalization
- Ensure components are keyboard-accessible and use semantic HTML.
- Keep strings in a simple messages file for later i18n.

### Testing & CI
- Unit tests: React Testing Library + vitest (or Jest) for components.
- E2E: optional Playwright tests for core flows.
