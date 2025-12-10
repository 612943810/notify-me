## Change: Frontend Spec — Define Web UI Requirements

### Why
Notify Me has an existing API and a starter React/Vite frontend, but there is no canonical specification describing the frontend requirements, constraints, and acceptance scenarios. Creating a focused frontend spec will:
- Define the user-visible behaviour for task management features
- Specify API expectations (CORS, WebSocket) and integration points with agentic capabilities
- Capture non-functional requirements (accessibility, perf, responsiveness)

This change aims to create a clear, reviewable specification so engineers and designers can implement the frontend consistently with product and security expectations.

### What Changes
- Add `frontend` capability spec describing UI features, real-time behaviour, auth, and notification UX
- Add a tasks list that breaks frontend work into verifiable implementation steps
- Provide a short design document with technology choices and integration notes (Vite, React, Tailwind, React Query, WebSocket, API contract)

### Impact
- Affected specs: `frontend` (new)
- Affected code: `frontend/` app, backend CORS and WebSocket endpoints, docs and CI workflows
- External dependencies: build tooling (Node, Vite), optional real-time infra (Redis, websockets)

### Non-goals
- Full visual design polish — this is a behaviour and integration spec, not a final UX design
- Requiring any specific hosted provider for notifications — adapters remain pluggable
