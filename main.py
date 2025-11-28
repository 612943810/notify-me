from fastapi import FastAPI
import os
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Load environment variables from a .env file when present
load_dotenv()

from app.db import create_db_and_tables
from app.routers.tasks import router as tasks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler to run startup/shutdown tasks.

    Using a lifespan handler avoids the deprecated `@app.on_event("startup")`
    API and keeps startup logic explicit and test-friendly.
    """
    # ensure DB tables exist when the app starts
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

# include routers at import time so routes are available to TestClient immediately
app.include_router(tasks_router)


@app.get("/")
def read_root():
    """Root endpoint returning a friendly greeting.

    Kept intentionally simple so the project is runnable without LangChain
    being required at import time. LangChain integrations can be added
    behind feature flags or in separate modules to avoid import errors.
    """
    return {"hello": "world"}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    # Allow running the app directly with `python main.py` for local dev
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=int(os.getenv("PORT", 8000)), reload=True)

