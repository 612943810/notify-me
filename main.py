from fastapi import FastAPI
import os
from dotenv import load_dotenv

# Load environment variables from a .env file when present
load_dotenv()

app = FastAPI()


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

