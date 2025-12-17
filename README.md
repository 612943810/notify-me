# Notify Me

Notify Me is an intelligent agent that helps you organize your tasks and sends you timely notifications to ensure you never miss a deadline.

## Features

*   **Task Management:** Create, update, and delete tasks.
*   **Smart Notifications:** Get notified of upcoming deadlines.
*   **AI-Powered:** Uses AI to help you prioritize your tasks.

## Getting Started

### Prerequisites

*   Python 3.7+
*   Gemini API Key (optional) or OpenAI API Key

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/notify-me.git
    ```

2.  Install the dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3.  Create a `.env` file and add your AI provider API key. This project supports Google Gemini (preferred) and OpenAI as fallbacks. Example:

    ```bash
    # For Gemini (preferred):
    GEMINI_API_KEY="your-gemini-api-key"
    ENABLE_GEMINI=true

    # Or for OpenAI:
    OPENAI_API_KEY="your-openai-api-key"
    ENABLE_AI=true
    ```

### Running the Application

1.  Start the FastAPI server:

    ```bash
    uvicorn main:app --reload
    ```

2.  The application will be available at `http://localhost:8000`.

## Usage

You can interact with the agent through the API endpoints.

*   `GET /`: Returns a "Hello, World" message.


## Technologies Used

*   [FastAPI](https://fastapi.tiangolo.com/)
*   [LangChain](https://js.langchain.com/docs/)
*   [OpenAI](https://openai.com/) or Google Gemini (optional)
