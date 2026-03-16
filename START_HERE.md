# START HERE 🚀

## Your API Key is Now Configured!

The API key has been added to `backend/.env`:
```
GEMINI_API_KEY=AIzaSyAIp-jELhbUmFUV7Sy2f5ZBdm5vz0UAplo
```

---

## Next Steps (2 Minutes)

### Step 1: Restart Backend

**In the terminal where backend is running:**
1. Press `Ctrl+C` to stop it
2. Run: `python manage.py runserver`
3. Wait for: "Starting development server at http://127.0.0.1:8000/"

### Step 2: Test the App

1. Open http://localhost:3000 in your browser
2. Enter topic: **"Python Programming"**
3. Select difficulty: **"Medium"**
4. Select questions: **5**
5. Click **"Generate Quiz"**
6. Should work now! ✅

---

## What to Expect

### If It Works ✅
- Quiz questions appear
- You can answer them
- Submit and see results
- View quiz history

### If It Doesn't Work ❌
- Check backend terminal for errors
- Verify .env file: `cat backend/.env`
- Verify API key starts with `AIzaSy`
- Restart backend again
- Check TROUBLESHOOTING.md

---

## Quick Commands

```bash
# Start Backend
cd backend
python manage.py runserver

# Start Frontend (in another terminal)
cd frontend
npm run dev

# Check API Key
cat backend/.env

# Test API
curl http://localhost:8000/api/quizzes/
```

---

## Documentation

- **QUICK_FIX.md** - If you have issues
- **QUICK_START.md** - Full setup guide
- **README.md** - Project overview
- **DOCUMENTATION_INDEX.md** - All documentation

---

## That's It! 🎉

Your AI Quiz App is ready to use. Enjoy!

**Questions?** Check DOCUMENTATION_INDEX.md for the right guide.
