# How to Get and Set Up Gemini API Key

## Current Error

```
Error calling AI model: No API_KEY or ADC found. Please either:
- Set the `GOOGLE_API_KEY` environment variable.
- Manually pass the key with `genai.configure(api_key=my_api_key)`.
- Or set up Application Default Credentials, see https://ai.google.dev/gemini-api/docs/oauth for more information.
```

This error means the `GEMINI_API_KEY` environment variable is not set.

## Step-by-Step Guide

### Step 1: Get Your API Key

1. **Visit Google AI Studio**
   - Go to: https://aistudio.google.com/
   - Sign in with your Google account (create one if needed)

2. **Create API Key**
   - Click on "Get API Key" button
   - Select "Create API key in new project"
   - Copy the generated API key

3. **Save the Key**
   - Keep it safe and secure
   - Don't share it publicly
   - Don't commit it to version control

### Step 2: Set Environment Variable

#### Option A: Using .env File (Recommended for Development)

1. **Create .env file in backend directory**
   ```bash
   cd backend
   ```

2. **Add your API key**
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Replace `your_api_key_here` with your actual key**
   - Example: `GEMINI_API_KEY=AIzaSyDxxx...`

4. **Save the file**

5. **Restart backend**
   ```bash
   python manage.py runserver
   ```

#### Option B: Using Command Line (Windows)

```bash
# Set environment variable
set GEMINI_API_KEY=your_api_key_here

# Verify it's set
echo %GEMINI_API_KEY%

# Start backend
python manage.py runserver
```

#### Option C: Using Command Line (macOS/Linux)

```bash
# Set environment variable
export GEMINI_API_KEY=your_api_key_here

# Verify it's set
echo $GEMINI_API_KEY

# Start backend
python manage.py runserver
```

### Step 3: Verify Setup

1. **Check .env file exists**
   ```bash
   cat backend/.env
   # Should show: GEMINI_API_KEY=AIzaSy...
   ```

2. **Restart backend**
   ```bash
   # Stop backend (Ctrl+C)
   python manage.py runserver
   ```

3. **Test in browser**
   - Go to http://localhost:3000
   - Enter a topic
   - Click "Generate Quiz"
   - Should work without API key error

## Troubleshooting

### Error: "No API_KEY or ADC found"

**Cause**: Environment variable not set

**Solution**:
1. Create `.env` file in backend directory
2. Add: `GEMINI_API_KEY=your_key`
3. Restart backend
4. Try again

### Error: "Invalid API key"

**Cause**: API key is incorrect or expired

**Solution**:
1. Get a new API key from https://aistudio.google.com/
2. Update `.env` file
3. Restart backend

### Error: "API key not found"

**Cause**: .env file not being loaded

**Solution**:
1. Verify .env file exists in backend directory
2. Verify file name is exactly `.env` (not `.env.txt`)
3. Verify `python-dotenv` is installed: `pip install python-dotenv`
4. Restart backend

## Security Best Practices

### ✅ DO:
- Store API key in `.env` file
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate keys periodically
- Use `.env.example` for templates

### ❌ DON'T:
- Commit `.env` file to git
- Share API key publicly
- Hardcode API key in code
- Use same key for multiple projects
- Leave API key in logs

## .env File Setup

### Create .env File

```bash
# Navigate to backend
cd backend

# Create .env file
echo GEMINI_API_KEY=your_api_key_here > .env
```

### Verify .env File

```bash
# Check file exists
ls -la .env

# Check content
cat .env
# Should show: GEMINI_API_KEY=AIzaSy...
```

### Update .gitignore

```bash
# Make sure .env is in .gitignore
cat .gitignore
# Should include: .env
```

## Example .env File

```
# Gemini API Configuration
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Django Settings (optional)
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database (optional)
DATABASE_NAME=ai_quiz_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
```

## Getting API Key - Detailed Steps

### 1. Open Google AI Studio

```
https://aistudio.google.com/
```

### 2. Sign In

- Click "Sign in with Google"
- Use your Google account
- Create account if needed

### 3. Create API Key

- Look for "Get API Key" button
- Click "Create API key in new project"
- Wait for key to be generated

### 4. Copy API Key

- Click "Copy" button
- Key is now in clipboard
- Format: `AIzaSy...` (long string)

### 5. Paste in .env

```
GEMINI_API_KEY=AIzaSy...
```

## Testing the API Key

### Test with curl

```bash
# Test if API key works
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Hello"
      }]
    }]
  }'
```

### Test in Python

```python
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Hello")
    print("API Key works!")
    print(response.text)
else:
    print("API Key not found!")
```

## Common Issues

### Issue 1: .env File Not Being Loaded

**Symptom**: API key error even though .env exists

**Solution**:
```bash
# Verify python-dotenv is installed
pip install python-dotenv

# Verify .env file location
# Should be in: backend/.env

# Verify file name
# Should be exactly: .env (not .env.txt or .env.local)

# Restart backend
python manage.py runserver
```

### Issue 2: API Key Format Wrong

**Symptom**: "Invalid API key" error

**Solution**:
- API key should start with `AIzaSy`
- Should be a long string (100+ characters)
- No spaces or special characters
- Get new key from https://aistudio.google.com/

### Issue 3: Multiple .env Files

**Symptom**: API key works in one place but not another

**Solution**:
- Only use one .env file in backend directory
- Don't create .env in frontend directory
- Frontend uses .env.local for different purpose

## Quick Setup Checklist

- [ ] Visit https://aistudio.google.com/
- [ ] Sign in with Google account
- [ ] Click "Get API Key"
- [ ] Copy the generated key
- [ ] Create `backend/.env` file
- [ ] Add: `GEMINI_API_KEY=your_key`
- [ ] Save file
- [ ] Restart backend: `python manage.py runserver`
- [ ] Test in browser: http://localhost:3000
- [ ] Try generating a quiz
- [ ] Should work without API key error

## Support

If you still have issues:

1. **Check backend logs**
   - Look at terminal where backend is running
   - Should show error message

2. **Verify API key**
   - Go to https://aistudio.google.com/
   - Check if API key is still valid
   - Create new key if needed

3. **Check .env file**
   - Verify file exists: `backend/.env`
   - Verify content: `GEMINI_API_KEY=...`
   - Verify no extra spaces or quotes

4. **Restart services**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `python manage.py runserver`
   - Start frontend: `npm run dev`

---

**Last Updated**: 2024
**Version**: 1.0.0
