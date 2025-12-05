# Change: Enhance AI Agent Capabilities

## Why
The current agent implementation in `app/agents.py` provides only basic rule-based priority suggestions with placeholder AI integration. Users need more intelligent task management capabilities including smart scheduling, natural language task creation, and proactive recommendations.

## What Changes
- Enhance the existing AI agent with real Gemini/OpenAI integration
- Add natural language task processing capabilities
- Implement smart scheduling and deadline optimization
- Add proactive task recommendations and insights
- **BREAKING**: Update agent API to support new capabilities

## Impact
- Affected specs: ai-agent (new capability)
- Affected code: `app/agents.py`, `app/models.py`, `main.py`, new agent modules
- External dependencies: Enhanced LangChain integration, Google Gemini/OpenAI APIs
