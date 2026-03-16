# AI-Powered Quiz Application

A full-stack web application that generates AI-powered quizzes, allows users to take them, and tracks their performance. Built with Next.js (frontend), Django REST API (backend), and PostgreSQL (database).

## 🎯 Project Overview

This application enables users to:
- Generate AI-powered multiple-choice quizzes on any topic
- Customize quiz difficulty (Easy, Medium, Hard)
- Select the number of questions (5-20)
- Take quizzes with progress tracking
- View instant results with performance metrics
- Access quiz history and statistics

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Django 6.0, Django REST Framework, PostgreSQL
- **AI Integration**: Gemini API (or any free AI service)
- **Database**: PostgreSQL

### Project Structure

```
ai-quiz-app/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Main page with state management
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── QuizForm.tsx     # Quiz creation form
│   │   ├── QuizTaking.tsx   # Quiz taking interface
│   │   ├── QuizResults.tsx  # Results display
│   │   └── QuizHistory.tsx  # Quiz history view
│   ├── lib/
│   │   └── config.ts        # API configuration
│   ├── .env.local           # Environment variables
│   └── package.json
│
└── backend/                  # Django REST API
    ├── backend/
    │   ├── settings.py      # Django settings with CORS config
    │   ├── urls.py          # URL routing
    │   └── wsgi.py
    ├── quiz/
    │   ├── models.py        # Database models (Quiz, Question, Attempt, Answer)
    │   ├── views.py         # API endpoints
    │   ├── serializers.py   # DRF serializers
    │   ├── ai_service.py    # AI integration
    │   └── urls.py          # Quiz app URLs
    ├── users/               # User management app
    ├── manage.py
    └── requirements.txt
```

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   - Ensure PostgreSQL is running
   - Update `backend/settings.py` with your database credentials:
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.postgresql',
             'NAME': 'ai_quiz_db',
             'USER': 'your_postgres_user',
             'PASSWORD': 'your_password',
             'HOST': 'localhost',
             'PORT': '5432',
         }
     }
     ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Create/update `.env.local`:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000/api
     ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:3000`

## 📋 API Endpoints

### Quiz Endpoints

#### Get All Quizzes
```
GET /api/quizzes/
```
Returns list of all created quizzes.

#### Generate Quiz
```
POST /api/generate-quiz/
Content-Type: application/json

{
  "topic": "Python Programming",
  "difficulty": "medium",
  "num_questions": 10
}
```
Generates AI-powered quiz questions and creates a quiz record.

**Response:**
```json
{
  "message": "Quiz generated successfully",
  "quiz_id": 1
}
```

#### Submit Quiz
```
POST /api/submit-quiz/
Content-Type: application/json

{
  "quiz_id": 1,
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "A"
    },
    ...
  ]
}
```
Submits quiz answers and calculates score.

**Response:**
```json
{
  "message": "Quiz submitted successfully",
  "attempt_id": 1,
  "score": 8,
  "total": 10
}
```

## 🗄️ Database Design

### Models

#### Quiz
- `id`: Primary Key
- `user`: Foreign Key to User
- `topic`: CharField (max 255)
- `difficulty`: CharField (easy/medium/hard)
- `num_questions`: IntegerField
- `created_at`: DateTimeField (auto_now_add)

#### Question
- `id`: Primary Key
- `quiz`: Foreign Key to Quiz
- `question_text`: TextField
- `option_a`, `option_b`, `option_c`, `option_d`: CharField
- `correct_answer`: CharField (A/B/C/D)

#### Attempt
- `id`: Primary Key
- `user`: Foreign Key to User
- `quiz`: Foreign Key to Quiz
- `score`: IntegerField
- `created_at`: DateTimeField (auto_now_add)

#### Answer
- `id`: Primary Key
- `attempt`: Foreign Key to Attempt
- `question`: Foreign Key to Question
- `selected_answer`: CharField (A/B/C/D)

## 🎨 Frontend Features

### Components

#### QuizForm
- Topic input field
- Difficulty level selector (Easy/Medium/Hard)
- Number of questions slider (5-20)
- Form validation
- Loading state with spinner
- Error handling

#### QuizTaking
- Question display with progress bar
- Multiple choice options with visual feedback
- Previous/Next navigation
- Answer tracking
- Submit button (only on last question)
- Progress indicator

#### QuizResults
- Circular progress indicator showing percentage
- Performance level feedback (Excellent/Good/Fair/Needs Improvement)
- Score breakdown (Correct/Incorrect/Total)
- Personalized feedback message
- Action buttons to take another quiz or return home

#### QuizHistory
- List of all created quizzes
- Difficulty badges with color coding
- Question count and creation date
- Statistics dashboard
- Empty state handling

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend (settings.py)**
- `DEBUG`: Set to False in production
- `ALLOWED_HOSTS`: Add your domain
- `CORS_ALLOWED_ORIGINS`: Add frontend URL
- Database credentials
- AI service API key (in ai_service.py)

## 🤖 AI Integration

The application uses the Gemini API (or similar) to generate quiz questions. The `ai_service.py` file handles:
- Prompt engineering for question generation
- Response parsing
- Error handling
- Rate limiting

### Example AI Service Implementation
```python
def generate_quiz(topic, num_questions, difficulty):
    # Calls AI API to generate questions
    # Returns list of question objects
    pass
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Quiz generation with various topics
- [ ] Difficulty level selection
- [ ] Question count variation
- [ ] Quiz taking with all options
- [ ] Answer submission
- [ ] Results calculation
- [ ] Quiz history display
- [ ] Error handling (network, validation)
- [ ] Responsive design on mobile/tablet

## 📊 Performance Considerations

1. **Frontend**
   - Component-based architecture for reusability
   - Client-side state management
   - Optimized re-renders with React hooks
   - CSS-in-JS with Tailwind for minimal bundle

2. **Backend**
   - Database indexing on frequently queried fields
   - Pagination for large datasets
   - Caching for AI responses (optional)
   - Connection pooling for database

3. **Database**
   - Proper foreign key relationships
   - Indexed primary and foreign keys
   - Normalized schema to reduce redundancy

## 🔒 Security Considerations

1. **CORS Configuration**: Restricted to allowed origins
2. **Input Validation**: Server-side validation on all endpoints
3. **Authentication**: User authentication for future enhancements
4. **Environment Variables**: Sensitive data in .env files
5. **HTTPS**: Use in production
6. **CSRF Protection**: Django CSRF middleware enabled

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

### Backend (Any Python hosting)
- Heroku, Railway, PythonAnywhere, or AWS
- Set `DEBUG = False`
- Configure production database
- Set `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
- Use environment variables for secrets

## 📝 Key Design Decisions

1. **Monolithic Backend**: Single Django project for simplicity
2. **Default User**: Uses default user for quiz creation (can be enhanced with authentication)
3. **Client-side State**: Frontend manages quiz state for better UX
4. **RESTful API**: Standard REST conventions for API design
5. **Tailwind CSS**: Utility-first CSS for rapid UI development
6. **TypeScript**: Type safety in frontend code

## 🐛 Troubleshooting

### Common Issues

**CORS Error**
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- Check API_BASE_URL in frontend config

**Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in settings.py
- Ensure database exists

**AI Service Error**
- Check API key configuration
- Verify API rate limits
- Check network connectivity

**Quiz Not Loading**
- Check browser console for errors
- Verify backend is running
- Check API endpoint URLs

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 👨‍💻 Development Notes

### Code Quality
- Clean, readable code with meaningful variable names
- Proper error handling and validation
- Component separation of concerns
- Reusable utility functions

### Best Practices Implemented
- Responsive design for all screen sizes
- Accessibility considerations
- Loading and error states
- User feedback mechanisms
- Proper state management

## 📄 License

This project is part of a fullstack developer assignment.

## 🤝 Support

For issues or questions, refer to the assignment documentation or contact the development team.

---

**Last Updated**: 2024
**Version**: 1.0.0
