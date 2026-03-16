# Setup Verification Guide

## Current Issue

**Error**: `No API_KEY or ADC found`

**Cause**: The GEMINI_API_KEY environment variable is not set or the backend hasn't been restarted after creating the .env file.

## Quick Fix (5 Steps)

### Step 1: Get Your API Key

1. Go to: https://aistudio.google.com/
2. Sign in with Google
3. Click "Get API Key"
4. Copy the generated key (starts with `AIzaSy`)

### Step 2: Create .env File

The .env file should already exist at `backend/.env`, but let's verify and update it:

```bash
# Navigate to backend directory
cd backend

# Check if .env exists
ls -la .env

# If it doesn't exist, create it
echo GEMINI_API_KEY=your_api_key_here > .env
```

### Step 3: Update .env with Your Key

Edit `backend/.env` and replace `your_api_key_here` with your actual API key:

```
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important**: 
- No quotes needed
- No spaces around the `=`
- The key should start with `AIzaSy`

### Step 4: Restart Backend

```bash
# Stop the backend server (Ctrl+C in the terminal)

# Start it again
python manage.py runserver
```

**Important**: You MUST restart the backend after creating/updating the .env file!

### Step 5: Test

1. Go to http://localhost:3000
2. Enter topic: "Python"
3. Click "Generate Quiz"
4. Should work now!

---

## Detailed Verification Checklist

### ✅ Check 1: .env File Exists

```bash
# Navigate to backend
cd backend

# Check if file exists
ls -la .env

# Should show: -rw-r--r-- ... .env
```

If file doesn't exist:
```bash
# Create it
echo GEMINI_API_KEY=your_api_key_here > .env
```

### ✅ Check 2: .env File Content

```bash
# View file content
cat .env

# Should show:
# GEMINI_API_KEY=AIzaSy...
```

If it shows `your_api_key_here`:
1. Get real key from https://aistudio.google.com/
2. Update the file with your actual key

### ✅ Check 3: API Key Format

Your API key should:
- Start with `AIzaSy`
- Be a long string (100+ characters)
- Have no spaces
- Have no special characters (except `-` and `_`)

Example: `AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### ✅ Check 4: Backend Restarted

```bash
# Stop backend (Ctrl+C)

# Start backend
python manage.py runserver

# Should see:
# Starting development server at http://127.0.0.1:8000/
```

### ✅ Check 5: Environment Variable Loaded

```bash
# In Python shell
python

# Then run:
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(api_key)

# Should print your API key (not "your_api_key_here")
```

### ✅ Check 6: API Key Works

```bash
# Test with curl
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'

# Should return JSON response (not error)
```

---

## Complete Setup Steps

### 1. Get API Key

```
https://aistudio.google.com/
→ Get API Key
→ Create API key in new project
→ Copy the key
```

### 2. Create .env File

```bash
cd backend
```

Create file `backend/.env` with content:
```
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Verify .env File

```bash
# Check file exists
ls -la .env

# Check content
cat .env

# Should show your API key
```

### 4. Install Dependencies

```bash
# Make sure python-dotenv is installed
pip install python-dotenv

# Or reinstall all dependencies
pip install -r requirements.txt
```

### 5. Restart Backend

```bash
# Stop backend (Ctrl+C)

# Start backend
python manage.py runserver

# Should see: Starting development server at http://127.0.0.1:8000/
```

### 6. Test in Browser

```
http://localhost:3000
→ Enter topic: "Python"
→ Select difficulty: "Medium"
→ Select questions: 5
→ Click "Generate Quiz"
→ Should work!
```

---

## Troubleshooting

### Problem 1: Still Getting API Key Error

**Symptom**: Error still shows after restarting

**Solution**:
1. Verify .env file exists: `ls -la backend/.env`
2. Verify content: `cat backend/.env`
3. Verify API key format (starts with `AIzaSy`)
4. Restart backend: `python manage.py runserver`
5. Check backend logs for error messages

### Problem 2: .env File Not Being Read

**Symptom**: API key error even though .env exists

**Solution**:
```bash
# Verify python-dotenv is installed
pip install python-dotenv

# Verify .env is in correct location
# Should be: backend/.env (not frontend/.env)

# Verify file name is exactly ".env"
# Not ".env.txt" or ".env.local"

# Restart backend
python manage.py runserver
```

### Problem 3: API Key Invalid

**Symptom**: "Invalid API key" error

**Solution**:
1. Get new key from https://aistudio.google.com/
2. Update .env file
3. Restart backend
4. Try again

### Problem 4: Backend Not Starting

**Symptom**: Backend crashes when starting

**Solution**:
```bash
# Check for syntax errors in .env
cat backend/.env

# Make sure no extra spaces or quotes
# Should be: GEMINI_API_KEY=AIzaSy...
# Not: GEMINI_API_KEY = "AIzaSy..."

# Fix and restart
python manage.py runserver
```

---

## File Locations

```
ai-quiz-app/
├── backend/
│   ├── .env                    ← API key goes here
│   ├── manage.py
│   ├── requirements.txt
│   └── quiz/
│       └── ai_service.py       ← Loads .env
├── frontend/
│   ├── .env.local              ← Different purpose
│   └── ...
└── ...
```

**Important**: 
- API key goes in `backend/.env`
- NOT in `frontend/.env.local`
- NOT in root `.env`

---

## Environment Variable Methods

### Method 1: .env File (Recommended)

```bash
# Create backend/.env
GEMINI_API_KEY=your_key_here

# Backend loads it automatically
```

### Method 2: Command Line (Windows)

```bash
# Set environment variable
set GEMINI_API_KEY=your_key_here

# Start backend
python manage.py runserver
```

### Method 3: Command Line (macOS/Linux)

```bash
# Set environment variable
export GEMINI_API_KEY=your_key_here

# Start backend
python manage.py runserver
```

### Method 4: Python Script

```python
import os
os.environ['GEMINI_API_KEY'] = 'your_key_here'

# Then start Django
```

---

## Verification Commands

### Check .env File

```bash
# Navigate to backend
cd backend

# List files
ls -la

# Should show: .env

# View content
cat .env

# Should show: GEMINI_API_KEY=AIzaSy...
```

### Check Environment Variable

```bash
# In Python
python
>>> import os
>>> from dotenv import load_dotenv
>>> load_dotenv()
>>> api_key = os.getenv("GEMINI_API_KEY")
>>> print(api_key)
AIzaSy...  # Should print your key
```

### Check Backend Logs

```bash
# Look at terminal where backend is running
# Should show:
# Starting development server at http://127.0.0.1:8000/
# [16/Mar/2026 10:23:06] "POST /api/generate-quiz/ HTTP/1.1" 200 ...
```

### Check API Endpoint

```bash
# Test API
curl http://localhost:8000/api/quizzes/

# Should return JSON (not error)
```

---

## Complete Checklist

- [ ] Got API key from https://aistudio.google.com/
- [ ] Created `backend/.env` file
- [ ] Added `GEMINI_API_KEY=your_key` to .env
- [ ] Verified .env file exists: `ls -la backend/.env`
- [ ] Verified .env content: `cat backend/.env`
- [ ] Verified API key format (starts with `AIzaSy`)
- [ ] Installed python-dotenv: `pip install python-dotenv`
- [ ] Restarted backend: `python manage.py runserver`
- [ ] Checked backend logs (no errors)
- [ ] Tested in browser: http://localhost:3000
- [ ] Tried generating a quiz
- [ ] Quiz generation works!

---

## Next Steps

Once API key is working:

1. **Test Quiz Generation**
   - Enter topic: "Python Programming"
   - Select difficulty: "Medium"
   - Select questions: 5
   - Click "Generate Quiz"

2. **Test Quiz Taking**
   - Answer all questions
   - Click "Submit Quiz"

3. **Test Results**
   - View score and feedback
   - Check performance level

4. **Test Quiz History**
   - Click "Quiz History"
   - See all created quizzes

---

## Support

If you're still having issues:

1. **Check backend logs**
   - Look at terminal where backend is running
   - Copy the error message

2. **Verify API key**
   - Go to https://aistudio.google.com/
   - Check if key is still valid
   - Create new key if needed

3. **Check .env file**
   - Verify file exists: `backend/.env`
   - Verify content: `GEMINI_API_KEY=...`
   - Verify no extra spaces or quotes

4. **Restart everything**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `python manage.py runserver`
   - Start frontend: `npm run dev`

---

**Last Updated**: 2024
**Version**: 1.0.0
