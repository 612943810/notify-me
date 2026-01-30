# Boilerplate App

A personal FastAPI + React TypeScript boilerplate for building web applications. Features a simple item management system with full CRUD operations.

*Built for personal projects and learning.*

## ✨ Features

- ✅ **Simple CRUD API** - FastAPI backend with automatic OpenAPI documentation
- ✅ **Modern React Frontend** - TypeScript + Vite for fast development
- ✅ **Hot Reload** - Instant updates during development
- ✅ **CORS Configured** - Ready for frontend-backend communication
- ✅ **Clean Architecture** - Well-organized project structure
- ✅ **Production Ready** - Easy deployment to multiple platforms
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Responsive Design** - Mobile-friendly UI

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd boilerplate-app
   ```

2. **Setup backend:**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Setup frontend:**
   ```bash
   cd frontend

   # Install Node dependencies
   npm install

   # Start development server
   npm run dev
   ```

4. **Start the backend** (in a separate terminal):
   ```bash
   # From project root
   python main.py
   ```

5. **Open your browser:**
   - Frontend: http://localhost:5174
   - API docs: http://localhost:8000/docs

## 📁 Project Structure

```
boilerplate-app/
├── 📁 backend/               # Backend application
│   ├── __init__.py          # Backend package initialization
│   └── routes.py            # API route definitions
├── 📁 frontend/             # Frontend application
│   ├── 📁 src/             # Source code
│   │   ├── App.tsx         # Main React component
│   │   ├── App.css         # Component styles
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies and scripts
│   ├── vite.config.ts      # Vite configuration
│   ├── index.html          # HTML template
│   └── tsconfig.json       # TypeScript configuration
├── main.py                  # FastAPI application entry point
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── README.md               # Project documentation
└── .gitignore              # Git ignore rules
```

## 🛠 Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **CSS** - Styling (easily replaceable with Tailwind, etc.)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting (via ESLint)

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/health` | Health status |
| `GET` | `/items` | Get all items |
| `POST` | `/items` | Create new item |
| `GET` | `/items/{id}` | Get item by ID |
| `DELETE` | `/items/{id}` | Delete item |

## 🧪 Testing

### Backend Tests
```bash
# Install test dependencies
pip install pytest httpx

# Run tests
pytest
```

### Frontend Tests
```bash
cd frontend

# Run tests (when added)
npm test
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend Configuration
DEBUG=True
PORT=8000

# Database (when added)
DATABASE_URL=sqlite:///./app.db

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
```

### Scripts

#### Backend Scripts
- `python main.py` - Start development server
- `uvicorn main:app --reload` - Alternative dev server

#### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Development

### Running the Application

1. **Start the backend:**
   ```bash
   python main.py
   ```

2. **Start the frontend** (in a separate terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5174
   - API Docs: http://localhost:8000/docs

### Code Quality

```bash
# Backend linting (when added)
flake8 backend/
black backend/

# Frontend linting
cd frontend
npm run lint
```

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: your feature description"

# Push to remote
git push origin feature/your-feature-name
```

## Expanding the Boilerplate

### Adding New API Endpoints

1. Add routes in `backend/routes.py`
2. Import and include them in `main.py`

### Adding Frontend Features

1. Create components in `frontend/src/components/`
2. Update `App.tsx` to use new components
3. Add styles in corresponding CSS files

### Adding Database

Replace the in-memory storage with a real database:

```python
# backend/db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

### Adding Authentication

Add authentication middleware and user models:

```python
# backend/auth.py
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException, status

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    # Implement your auth logic here
    pass
```

### Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t boilerplate-app .

# Run the container
docker run -p 8000:8000 boilerplate-app
```

## 🚀 Deployment

### Quick Deploy Options

#### Railway (Recommended)
1. Push to GitHub
2. Connect Railway to your repo
3. It auto-detects FastAPI
4. Set any environment variables
5. Deploy!

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy backend
vercel --prod

# Deploy frontend
cd frontend
vercel --prod
```

#### Heroku
```bash
# Add gunicorn to requirements
echo "gunicorn>=21.2.0" >> requirements.txt

# Create Procfile
echo "web: gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:\$PORT" > Procfile

# Deploy
git push heroku main
```
## 🙏 Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

---

