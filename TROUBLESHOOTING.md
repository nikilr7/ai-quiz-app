# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Unexpected token '<', '<!DOCTYPE '... is not valid JSON"

**Cause**: The backend is returning HTML (error page) instead of JSON.

**Solutions**:

#### A. Check ALLOWED_HOSTS
```python
# In backend/settings.py
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']
```

#### B. Check CORS Configuration
```python
# In backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
```

#### C. Verify Backend is Running
```bash
# Check if backend is running on port 8000
curl http://localhost:8000/api/
```

#### D. Check API Endpoint
```bash
# Test the generate-quiz endpoint
curl -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{"topic":"Python","difficulty":"easy","num_questions":5}'
```

---

### 2. "Error calling AI model: 'NoneType' object is not subscriptable"

**Cause**: GEMINI_API_KEY environment variable is not set.

**Solution**:

1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Create `.env` file in backend directory:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Restart backend server

---

### 3. CORS Error in Browser Console

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:

#### A. Check Frontend API URL
```typescript
// In frontend/lib/config.ts
export const API_BASE_URL = 'http://localhost:8000/api';
```

#### B. Check .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### C. Verify CORS Middleware
```python
# In backend/settings.py - CORS middleware should be first
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]
```

#### D. Clear Browser Cache
- Press Ctrl+Shift+Delete
- Clear all cache
- Restart browser

---

### 4. Database Connection Error

**Error**: `psycopg2.OperationalError: could not connect to server`

**Solutions**:

#### A. Check PostgreSQL is Running
```bash
# Windows: Check Services
# macOS: brew services list
# Linux: sudo systemctl status postgresql
```

#### B. Verify Database Exists
```bash
psql -U postgres
\l  # List databases
CREATE DATABASE ai_quiz_db;
\q
```

#### C. Check Database Credentials
```python
# In backend/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ai_quiz_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',  # Verify this
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### D. Test Connection
```bash
psql -U postgres -d ai_quiz_db -c "SELECT 1;"
```

---

### 5. Port Already in Use

**Error**: `Address already in use`

**Solutions**:

#### A. Use Different Port (Backend)
```bash
python manage.py runserver 8001
```

#### B. Use Different Port (Frontend)
```bash
npm run dev -- -p 3001
```

#### C. Kill Process Using Port
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

---

### 6. Module Not Found Error

**Error**: `ModuleNotFoundError: No module named 'quiz'`

**Solutions**:

#### A. Install Dependencies
```bash
pip install -r requirements.txt
```

#### B. Check INSTALLED_APPS
```python
# In backend/settings.py
INSTALLED_APPS = [
    # ...
    'quiz',
    'users',
]
```

#### C. Run Migrations
```bash
python manage.py migrate
```

---

### 7. Tailwind CSS Not Loading

**Error**: Styles not applied, CSS not working

**Solutions**:

#### A. Check PostCSS Config
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### B. Check globals.css
```css
/* app/globals.css */
@import "tailwindcss";
```

#### C. Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

#### D. Reinstall Dependencies
```bash
rm -rf node_modules
npm install
npm run dev
```

---

### 8. API Endpoint Not Found (404)

**Error**: `404 Not Found` when accessing API

**Solutions**:

#### A. Check URL Routing
```python
# In backend/urls.py
urlpatterns = [
    path('api/', include('quiz.urls')),
]

# In quiz/urls.py
urlpatterns = [
    path('quizzes/', get_quizzes),
    path('generate-quiz/', generate_quiz_api),
    path('submit-quiz/', submit_quiz),
]
```

#### B. Verify Endpoint URL
```
GET  /api/quizzes/
POST /api/generate-quiz/
POST /api/submit-quiz/
```

#### C. Test with curl
```bash
curl http://localhost:8000/api/quizzes/
```

---

### 9. Quiz Generation Timeout

**Error**: Request takes too long or times out

**Solutions**:

#### A. Check AI API Status
- Visit [Google AI Studio](https://aistudio.google.com/)
- Verify API key is valid
- Check rate limits

#### B. Increase Timeout
```typescript
// In frontend components
const response = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
  // Add timeout if needed
});
```

#### C. Check Network
- Verify internet connection
- Check firewall settings
- Try VPN if blocked

---

### 10. Frontend Not Connecting to Backend

**Error**: Network requests fail, API calls don't work

**Solutions**:

#### A. Verify Both Servers Running
```bash
# Terminal 1: Backend
python manage.py runserver

# Terminal 2: Frontend
npm run dev

# Terminal 3: Check
curl http://localhost:8000/api/
curl http://localhost:3000
```

#### B. Check API URL
```typescript
// frontend/lib/config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
```

#### C. Check .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### D. Restart Frontend
```bash
# Stop frontend (Ctrl+C)
npm run dev
```

---

## Debugging Tips

### 1. Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Look for error messages
- Check Network tab for failed requests

### 2. Check Backend Logs
- Look at terminal where backend is running
- Check for error messages
- Look for stack traces

### 3. Check Database
```bash
psql -U postgres -d ai_quiz_db
SELECT * FROM quiz_quiz;
SELECT * FROM quiz_question;
```

### 4. Test API with curl
```bash
# Get quizzes
curl http://localhost:8000/api/quizzes/

# Generate quiz
curl -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{"topic":"Python","difficulty":"easy","num_questions":5}'

# Submit quiz
curl -X POST http://localhost:8000/api/submit-quiz/ \
  -H "Content-Type: application/json" \
  -d '{"quiz_id":1,"answers":[{"question_id":1,"selected_answer":"A"}]}'
```

### 5. Enable Django Debug Toolbar
```bash
pip install django-debug-toolbar
```

---

## Performance Issues

### Slow Quiz Generation
- Check AI API response time
- Verify network connection
- Check system resources

### Slow Page Load
- Check bundle size: `npm run build`
- Check network requests in DevTools
- Optimize images and assets

### Database Slow Queries
- Check indexes
- Use `select_related()` and `prefetch_related()`
- Monitor query performance

---

## Security Issues

### Exposed API Key
- Never commit `.env` files
- Use `.env.example` for templates
- Rotate keys if exposed

### CORS Issues
- Only allow trusted origins
- Don't use `*` in production
- Verify frontend URL

### SQL Injection
- Always use ORM queries
- Never use raw SQL with user input
- Validate all inputs

---

## Getting Help

1. **Check Documentation**
   - README.md
   - SETUP_GUIDE.md
   - API_DOCUMENTATION.md

2. **Review Error Messages**
   - Read full error message
   - Check stack trace
   - Search for error online

3. **Check Logs**
   - Browser console
   - Backend terminal
   - Database logs

4. **Test Endpoints**
   - Use curl or Postman
   - Verify request format
   - Check response

5. **Restart Services**
   - Stop and restart backend
   - Stop and restart frontend
   - Restart database if needed

---

## Quick Checklist

- [ ] PostgreSQL running
- [ ] Database created
- [ ] Backend migrations run
- [ ] Backend running on 8000
- [ ] Frontend running on 3000
- [ ] GEMINI_API_KEY set
- [ ] ALLOWED_HOSTS configured
- [ ] CORS configured
- [ ] .env.local configured
- [ ] No console errors
- [ ] API endpoints responding

---

**Last Updated**: 2024
**Version**: 1.0.0
