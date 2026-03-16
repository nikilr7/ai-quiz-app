# Quick Start Guide

Get the AI Quiz App running in 5 minutes!

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 12+

## 1. Database Setup (2 minutes)

```bash
# Start PostgreSQL
# Windows: Services → PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Create database
psql -U postgres
CREATE DATABASE ai_quiz_db;
\q
```

## 2. Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

✅ Backend running at `http://localhost:8000`

## 3. Frontend Setup (1 minute)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

## 4. Test the App

1. Open `http://localhost:3000` in browser
2. Enter a topic (e.g., "Python Programming")
3. Select difficulty and number of questions
4. Click "Generate Quiz"
5. Answer the questions
6. Submit and view results

## Environment Setup

### Backend (.env)
```
GEMINI_API_KEY=your_api_key_here
```

Get API key from: https://aistudio.google.com/

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Common Commands

### Backend
```bash
# Run server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Access admin
# http://localhost:8000/admin/

# Django shell
python manage.py shell
```

### Frontend
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CORS_ALLOWED_ORIGINS` in backend/settings.py |
| Database Error | Verify PostgreSQL is running and credentials are correct |
| API Not Found | Ensure backend is running on port 8000 |
| Port in Use | Use different port: `python manage.py runserver 8001` |
| Module Not Found | Run `npm install` or `pip install -r requirements.txt` |

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
3. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
4. Explore [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md) for frontend development
5. Study [BACKEND_GUIDE.md](BACKEND_GUIDE.md) for backend development

## Project Structure

```
ai-quiz-app/
├── frontend/          # Next.js app
├── backend/           # Django API
├── README.md          # Full documentation
├── SETUP_GUIDE.md     # Detailed setup
├── API_DOCUMENTATION.md
├── FRONTEND_GUIDE.md
├── BACKEND_GUIDE.md
└── PROJECT_SUMMARY.md
```

## Key Features

✅ AI-powered quiz generation
✅ Customizable difficulty levels
✅ Real-time progress tracking
✅ Instant results with feedback
✅ Quiz history and statistics
✅ Responsive design
✅ Full-stack implementation

## Architecture

```
Frontend (Next.js)
    ↓
API (Django REST)
    ↓
Database (PostgreSQL)
    ↓
AI Service (Gemini API)
```

## Deployment

### Frontend
```bash
npm run build
vercel deploy
```

### Backend
Deploy to Heroku, Railway, or your preferred service

## Support

- 📖 Check documentation files
- 🐛 Review error messages
- 💻 Check browser/server logs
- 📝 Read code comments

---

**Ready to go!** 🚀

For more details, see the full documentation in the project root.
