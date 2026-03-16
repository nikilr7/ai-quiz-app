# Quick Fix - API Key Error

## The Problem

```
Error calling AI model: No API_KEY or ADC found
```

## The Solution (3 Steps)

### Step 1: Get Your API Key (1 minute)

1. Go to: **https://aistudio.google.com/**
2. Sign in with Google
3. Click **"Get API Key"**
4. Click **"Create API key in new project"**
5. **Copy** the generated key (looks like: `AIzaSyDxxx...`)

### Step 2: Create .env File (1 minute)

**Option A: Using File Explorer**
1. Open: `c:\Users\nikil\Source\repo\ai-quiz-app\backend\`
2. Create new file: `.env`
3. Open it with Notepad
4. Paste: `GEMINI_API_KEY=AIzaSyDxxx...` (replace with your key)
5. Save

**Option B: Using Command Line**
```bash
cd backend
echo GEMINI_API_KEY=AIzaSyDxxx... > .env
```

### Step 3: Restart Backend (1 minute)

```bash
# Stop backend (Ctrl+C in the terminal)

# Start it again
python manage.py runserver
```

## Done! ✅

Now try generating a quiz:
1. Go to http://localhost:3000
2. Enter topic: "Python"
3. Click "Generate Quiz"
4. Should work!

---

## Verification

### Check if .env file exists

```bash
cd backend
ls -la .env
```

Should show the file.

### Check if .env has your key

```bash
cat .env
```

Should show: `GEMINI_API_KEY=AIzaSy...`

### Check backend logs

Look at the terminal where backend is running. Should NOT show API key error.

---

## If Still Not Working

### Problem 1: Still getting API key error

**Solution**:
1. Stop backend (Ctrl+C)
2. Verify .env file: `cat backend/.env`
3. Verify key starts with `AIzaSy`
4. Restart backend: `python manage.py runserver`

### Problem 2: Can't find .env file

**Solution**:
```bash
# Navigate to backend
cd backend

# Create .env file
echo GEMINI_API_KEY=your_key_here > .env

# Verify it was created
ls -la .env
```

### Problem 3: API key is invalid

**Solution**:
1. Get new key from https://aistudio.google.com/
2. Update .env file
3. Restart backend

---

## File Location

```
ai-quiz-app/
└── backend/
    └── .env  ← Create this file here
```

**Important**: The .env file goes in the `backend` folder, NOT in the root or frontend folder.

---

## API Key Format

Your key should:
- Start with `AIzaSy`
- Be a long string (100+ characters)
- Have NO spaces
- Have NO quotes

**Correct**: `GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Wrong**: `GEMINI_API_KEY = "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`

---

## Summary

| Step | Action | Time |
|------|--------|------|
| 1 | Get API key from aistudio.google.com | 1 min |
| 2 | Create backend/.env file | 1 min |
| 3 | Restart backend | 1 min |
| **Total** | | **3 min** |

---

**That's it! Your app should now work.** 🚀
