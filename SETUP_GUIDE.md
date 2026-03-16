# AI Quiz App - Complete Setup Guide

This guide will walk you through setting up and running the AI Quiz Application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Step 1: Database Setup

### 1.1 Start PostgreSQL

**Windows:**
- PostgreSQL should start automatically after installation
- Or start it from Services (services.msc)

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
```

### 1.2 Create Database

Open PostgreSQL command line:

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE ai_quiz_db;
\q
```

## Step 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:

```bash
pip install django==6.0.3
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install psycopg2-binary==2.9.9
pip install python-dotenv==1.0.0
pip install google-generativeai==0.3.0
```

### 2.4 Configure Database Connection

Edit `backend/settings.py` and update the DATABASES section:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ai_quiz_db',
        'USER': 'postgres',
        'PASSWORD': 'your_postgres_password',  # Change this
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### 2.5 Run Migrations

```bash
python manage.py migrate
```

You should see output like:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, quiz, users
Running migrations:
  Applying contenttypes.0001_initial... OK
  ...
```

### 2.6 Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 2.7 Start Backend Server

```bash
python manage.py runserver
```

You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

**Backend is now running at:** `http://localhost:8000`

## Step 3: Frontend Setup

### 3.1 Open New Terminal and Navigate to Frontend

```bash
cd frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`.

### 3.3 Configure Environment

Create/update `.env.local` file in the frontend directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3.4 Start Frontend Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
```

**Frontend is now running at:** `http://localhost:3000`

## Step 4: Verify Setup

### 4.1 Check Backend API

Open your browser and visit:
```
http://localhost:8000/api/
```

You should see the API root response with available endpoints.

### 4.2 Check Frontend

Open your browser and visit:
```
http://localhost:3000
```

You should see the AI Quiz App homepage.

### 4.3 Test Quiz Generation

1. Enter a topic (e.g., "Python Programming")
2. Select difficulty level
3. Choose number of questions
4. Click "Generate Quiz"

If everything works, you'll see the quiz questions load.

## Troubleshooting

### Issue: PostgreSQL Connection Error

**Error:** `psycopg2.OperationalError: could not connect to server`

**Solution:**
1. Verify PostgreSQL is running
2. Check username and password in settings.py
3. Ensure database `ai_quiz_db` exists
4. Try connecting manually: `psql -U postgres -d ai_quiz_db`

### Issue: CORS Error in Browser Console

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Verify `CORS_ALLOWED_ORIGINS` in `backend/settings.py` includes `http://localhost:3000`
2. Restart backend server
3. Clear browser cache (Ctrl+Shift+Delete)

### Issue: API URL Not Found

**Error:** `404 Not Found` when accessing API endpoints

**Solution:**
1. Verify backend is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Ensure API endpoints match: `/api/quizzes/`, `/api/generate-quiz/`, `/api/submit-quiz/`

### Issue: AI Service Error

**Error:** `Failed to generate quiz questions`

**Solution:**
1. Check AI API key in `quiz/ai_service.py`
2. Verify API rate limits haven't been exceeded
3. Check network connectivity
4. Review AI service documentation

### Issue: Port Already in Use

**Error:** `Address already in use`

**Solution:**
- Backend: `python manage.py runserver 8001`
- Frontend: `npm run dev -- -p 3001`

## Development Workflow

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

### Terminal 3: Database (if needed)
```bash
psql -U postgres -d ai_quiz_db
```

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
npm start
```

### Backend Deployment

1. Set `DEBUG = False` in settings.py
2. Update `ALLOWED_HOSTS` with your domain
3. Update `CORS_ALLOWED_ORIGINS` with frontend URL
4. Use environment variables for secrets
5. Deploy to hosting service (Heroku, Railway, etc.)

## Project Structure Reference

```
ai-quiz-app/
├── backend/
│   ├── backend/
│   │   ├── settings.py      ← Database config here
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── quiz/
│   │   ├── models.py        ← Database models
│   │   ├── views.py         ← API endpoints
│   │   ├── ai_service.py    ← AI integration
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── page.tsx         ← Main page
    │   ├── layout.tsx
    │   └── globals.css
    ├── components/
    │   ├── QuizForm.tsx
    │   ├── QuizTaking.tsx
    │   ├── QuizResults.tsx
    │   └── QuizHistory.tsx
    ├── lib/
    │   └── config.ts        ← API URL config
    ├── .env.local           ← Environment variables
    └── package.json
```

## Next Steps

1. **Customize AI Service**: Update `quiz/ai_service.py` with your AI API key
2. **Add Authentication**: Implement user registration and login
3. **Enhance UI**: Add more features and styling
4. **Deploy**: Push to production using Vercel (frontend) and your preferred backend hosting
5. **Monitor**: Set up logging and monitoring for production

## Useful Commands

### Backend
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access admin panel
# http://localhost:8000/admin/

# Run tests
python manage.py test

# Shell
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

### Database
```bash
# Connect to database
psql -U postgres -d ai_quiz_db

# List tables
\dt

# Exit
\q
```

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the README.md for architecture details
3. Check browser console for frontend errors
4. Check terminal output for backend errors
5. Verify all prerequisites are installed

---

**Happy coding! 🚀**
