# Debugging Guide - JSON Parse Error

## The Issue

**Error**: `Unexpected token '<', '<!DOCTYPE '... is not valid JSON`

This error occurs when the frontend expects JSON but receives HTML instead. This typically happens when:

1. The backend is returning an error page (HTML) instead of JSON
2. The backend is not running
3. The API endpoint is incorrect
4. There's a server error (500)

## Root Causes

### 1. Missing GEMINI_API_KEY

**Symptom**: Backend returns 500 error with HTML error page

**Solution**:
```bash
# Create .env file in backend directory
cd backend
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

Get your API key from: https://aistudio.google.com/

### 2. ALLOWED_HOSTS Not Configured

**Symptom**: 400 Bad Request with HTML error page

**Solution**:
```python
# In backend/settings.py
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']
```

### 3. Backend Not Running

**Symptom**: Connection refused or timeout

**Solution**:
```bash
# Terminal 1: Start backend
cd backend
python manage.py runserver
# Should see: Starting development server at http://127.0.0.1:8000/
```

### 4. Database Not Connected

**Symptom**: 500 error with database connection error

**Solution**:
```bash
# Verify PostgreSQL is running
psql -U postgres

# Create database if not exists
CREATE DATABASE ai_quiz_db;

# Run migrations
python manage.py migrate
```

### 5. Wrong API Endpoint

**Symptom**: 404 Not Found

**Solution**:
```
Correct endpoints:
GET  /api/quizzes/
POST /api/generate-quiz/
POST /api/submit-quiz/

NOT:
/api/quiz/generate-quiz/  ❌
/api/generate_quiz/       ❌
/generate-quiz/           ❌
```

## Step-by-Step Debugging

### Step 1: Verify Backend is Running

```bash
# In a terminal, run:
curl http://localhost:8000/api/

# Should return JSON like:
# {
#   "message": "AI Quiz API",
#   "endpoints": {...}
# }
```

If this fails:
- Backend is not running
- Start it: `python manage.py runserver`

### Step 2: Check ALLOWED_HOSTS

```python
# backend/settings.py should have:
ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']
```

If not, add it and restart backend.

### Step 3: Verify GEMINI_API_KEY

```bash
# In backend directory, check .env file exists:
cat .env

# Should contain:
# GEMINI_API_KEY=your_key_here
```

If missing:
1. Get key from https://aistudio.google.com/
2. Create .env file with the key
3. Restart backend

### Step 4: Test API Endpoint

```bash
# Test quiz generation
curl -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python",
    "difficulty": "easy",
    "num_questions": 5
  }'

# Should return JSON with quiz data
# If you get HTML, check backend logs for errors
```

### Step 5: Check Frontend Configuration

```typescript
// frontend/lib/config.ts should have:
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// frontend/.env.local should have:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 6: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests
5. Click on failed request to see response

## Common Error Messages

### "Failed to fetch"
- Backend not running
- Wrong API URL
- CORS issue

**Fix**:
```bash
# Restart backend
python manage.py runserver

# Check API URL in frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### "Unexpected token '<'"
- Backend returning HTML instead of JSON
- Server error (500)
- Wrong endpoint

**Fix**:
```bash
# Check backend logs for errors
# Verify endpoint URL
# Check ALLOWED_HOSTS and CORS config
```

### "CORS policy blocked"
- Frontend URL not in CORS_ALLOWED_ORIGINS
- CORS middleware not configured

**Fix**:
```python
# backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
]

# Restart backend
```

### "API key not valid"
- GEMINI_API_KEY not set
- API key is invalid
- API key has expired

**Fix**:
```bash
# Get new key from https://aistudio.google.com/
# Update .env file
GEMINI_API_KEY=new_key_here

# Restart backend
```

## Verification Checklist

- [ ] PostgreSQL running
- [ ] Database `ai_quiz_db` exists
- [ ] Backend migrations run (`python manage.py migrate`)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] GEMINI_API_KEY set in backend/.env
- [ ] ALLOWED_HOSTS configured in settings.py
- [ ] CORS_ALLOWED_ORIGINS configured
- [ ] API_BASE_URL correct in frontend
- [ ] .env.local exists in frontend
- [ ] No console errors in browser
- [ ] Backend logs show no errors

## Testing the Full Flow

### 1. Start Services

```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Test (optional)
# Use curl to test endpoints
```

### 2. Test API Directly

```bash
# Get all quizzes
curl http://localhost:8000/api/quizzes/

# Generate quiz
curl -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python Programming",
    "difficulty": "medium",
    "num_questions": 5
  }'
```

### 3. Test in Browser

1. Open http://localhost:3000
2. Enter topic: "Python Programming"
3. Select difficulty: "Medium"
4. Select questions: 5
5. Click "Generate Quiz"
6. Check browser console for errors
7. Check backend terminal for logs

## If Still Not Working

### Check Backend Logs

```bash
# Look at terminal where backend is running
# Should show:
# - Request received
# - Processing
# - Response sent

# If you see errors, note them and check:
# 1. Is GEMINI_API_KEY set?
# 2. Is database connected?
# 3. Are migrations run?
```

### Check Frontend Logs

```bash
# Open browser DevTools (F12)
# Console tab shows JavaScript errors
# Network tab shows HTTP requests/responses
# Click on failed request to see details
```

### Check Database

```bash
psql -U postgres -d ai_quiz_db

# Check tables exist
\dt

# Check quiz table
SELECT * FROM quiz_quiz;

# Exit
\q
```

### Restart Everything

```bash
# Stop all services (Ctrl+C in each terminal)

# Restart in order:
# 1. PostgreSQL (should be running)
# 2. Backend: python manage.py runserver
# 3. Frontend: npm run dev

# Try again
```

## Advanced Debugging

### Enable Django Debug Toolbar

```bash
pip install django-debug-toolbar

# Add to INSTALLED_APPS in settings.py
'debug_toolbar',

# Add to MIDDLEWARE
'debug_toolbar.middleware.DebugToolbarMiddleware',

# Add to urls.py
if DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
```

### Check Request/Response

```bash
# Use curl with verbose output
curl -v -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{"topic":"Python","difficulty":"easy","num_questions":5}'

# Shows:
# - Request headers
# - Response headers
# - Response body
```

### Monitor Network

```bash
# In browser DevTools:
# 1. Open Network tab
# 2. Reload page
# 3. Click on request
# 4. Check:
#    - Status code (should be 200 or 201)
#    - Response headers (Content-Type should be application/json)
#    - Response body (should be valid JSON)
```

## Prevention

### Best Practices

1. **Always check ALLOWED_HOSTS**
   ```python
   ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']
   ```

2. **Always set GEMINI_API_KEY**
   ```bash
   echo "GEMINI_API_KEY=your_key" > backend/.env
   ```

3. **Always run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Always verify endpoints**
   ```bash
   curl http://localhost:8000/api/
   ```

5. **Always check logs**
   - Backend terminal
   - Browser console
   - Network tab

## Summary

The "Unexpected token '<'" error means the backend is returning HTML instead of JSON. This is usually caused by:

1. **Missing GEMINI_API_KEY** → Set it in .env
2. **ALLOWED_HOSTS not configured** → Add to settings.py
3. **Backend not running** → Start with `python manage.py runserver`
4. **Database not connected** → Run migrations
5. **Wrong endpoint** → Check URL

**Quick Fix**:
```bash
# 1. Set API key
echo "GEMINI_API_KEY=your_key" > backend/.env

# 2. Update settings.py
# ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']

# 3. Run migrations
python manage.py migrate

# 4. Restart backend
python manage.py runserver

# 5. Test
curl http://localhost:8000/api/
```

---

**Last Updated**: 2024
**Version**: 1.0.0
