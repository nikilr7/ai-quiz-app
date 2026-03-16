# Backend Development Guide

Complete guide for developing and maintaining the AI Quiz App backend.

## Project Overview

The backend is built with:
- **Django 6.0**: Web framework
- **Django REST Framework**: REST API toolkit
- **PostgreSQL**: Database
- **Gemini API**: AI service for question generation

## Project Structure

```
backend/
├── backend/
│   ├── __init__.py
│   ├── settings.py          # Django configuration
│   ├── urls.py              # URL routing
│   ├── asgi.py              # ASGI config
│   └── wsgi.py              # WSGI config
├── quiz/
│   ├── migrations/          # Database migrations
│   ├── __init__.py
│   ├── admin.py             # Django admin configuration
│   ├── apps.py              # App configuration
│   ├── models.py            # Database models
│   ├── views.py             # API views
│   ├── serializers.py       # DRF serializers
│   ├── ai_service.py        # AI integration
│   ├── urls.py              # Quiz app URLs
│   └── tests.py             # Tests
├── users/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── manage.py
└── requirements.txt
```

## Database Models

### Quiz Model

```python
class Quiz(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=50)
    num_questions = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
```

**Fields:**
- `user`: User who created the quiz
- `topic`: Quiz topic
- `difficulty`: "easy", "medium", or "hard"
- `num_questions`: Number of questions
- `created_at`: Creation timestamp

**Relationships:**
- One-to-Many with Question (via related_name="questions")
- One-to-Many with Attempt

### Question Model

```python
class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1)
```

**Fields:**
- `quiz`: Parent quiz
- `question_text`: Question content
- `option_a`, `option_b`, `option_c`, `option_d`: Answer options
- `correct_answer`: Correct option (A, B, C, or D)

**Relationships:**
- Many-to-One with Quiz
- One-to-Many with Answer

### Attempt Model

```python
class Attempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
```

**Fields:**
- `user`: User who took the quiz
- `quiz`: Quiz that was taken
- `score`: Number of correct answers
- `created_at`: Submission timestamp

**Relationships:**
- Many-to-One with User
- Many-to-One with Quiz
- One-to-Many with Answer

### Answer Model

```python
class Answer(models.Model):
    attempt = models.ForeignKey(Attempt, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=1)
```

**Fields:**
- `attempt`: Parent attempt
- `question`: Question being answered
- `selected_answer`: User's selected option (A, B, C, or D)

**Relationships:**
- Many-to-One with Attempt
- Many-to-One with Question

## API Views

### get_quizzes

**Endpoint:** `GET /api/quizzes/`

**Purpose:** Retrieve all quizzes

**Implementation:**
```python
@api_view(['GET'])
def get_quizzes(request):
    quizzes = Quiz.objects.all()
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)
```

**Response:** List of quiz objects with questions

### generate_quiz_api

**Endpoint:** `POST /api/generate-quiz/`

**Purpose:** Generate AI-powered quiz

**Implementation:**
```python
@api_view(['POST'])
def generate_quiz_api(request):
    # 1. Validate input
    # 2. Create Quiz object
    # 3. Call AI service
    # 4. Create Question objects
    # 5. Return quiz_id
```

**Process:**
1. Extract topic, difficulty, num_questions from request
2. Validate required fields
3. Get or create default user
4. Create Quiz record
5. Call `generate_quiz()` from ai_service
6. Create Question records for each AI-generated question
7. Return success response with quiz_id

**Error Handling:**
- Missing fields: 400 Bad Request
- AI service error: 500 Internal Server Error
- Invalid data: 500 Internal Server Error

### submit_quiz

**Endpoint:** `POST /api/submit-quiz/`

**Purpose:** Submit quiz answers and calculate score

**Implementation:**
```python
@api_view(['POST'])
def submit_quiz(request):
    # 1. Validate input
    # 2. Get quiz and user
    # 3. Create Attempt
    # 4. Process answers
    # 5. Calculate score
    # 6. Return results
```

**Process:**
1. Extract quiz_id and answers from request
2. Validate required fields
3. Get Quiz object
4. Get or create default user
5. Create Attempt record
6. For each answer:
   - Get Question object
   - Compare selected_answer with correct_answer
   - Increment score if correct
   - Create Answer record
7. Update Attempt with final score
8. Return attempt_id, score, and total

**Error Handling:**
- Missing fields: 400 Bad Request
- Quiz not found: 500 Internal Server Error
- Invalid answer format: 500 Internal Server Error

## AI Service

### Configuration

The AI service uses Google's Gemini API:

```python
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)
```

**Setup:**
1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Create `.env` file in backend directory
3. Add: `GEMINI_API_KEY=your_api_key`

### generate_quiz Function

**Purpose:** Generate multiple-choice questions using AI

**Input:**
- `topic` (str): Quiz topic
- `num_questions` (int): Number of questions
- `difficulty` (str): Difficulty level

**Output:**
```python
[
  {
    "question": "Question text",
    "option_a": "Option A",
    "option_b": "Option B",
    "option_c": "Option C",
    "option_d": "Option D",
    "correct_answer": "A"
  },
  ...
]
```

**Implementation Details:**
1. Constructs prompt with topic, num_questions, and difficulty
2. Calls Gemini API with prompt
3. Parses JSON response
4. Validates response format
5. Returns list of question objects or error dict

**Error Handling:**
- Empty response: Returns error dict
- Invalid JSON: Returns error dict with JSONDecodeError
- API error: Returns error dict with exception message

## Serializers

### QuizSerializer

```python
class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'user', 'topic', 'difficulty', 'num_questions', 'created_at', 'questions']
```

**Purpose:** Serialize Quiz objects with nested questions

**Fields:**
- `id`: Quiz ID
- `user`: User ID
- `topic`: Quiz topic
- `difficulty`: Difficulty level
- `num_questions`: Number of questions
- `created_at`: Creation timestamp
- `questions`: Nested question objects

## Settings Configuration

### Database

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'ai_quiz_db',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS Configuration

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
```

### Installed Apps

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'quiz',
    'users',
]
```

## Development Workflow

### Running Development Server

```bash
python manage.py runserver
```

Server runs at `http://localhost:8000`

### Creating Migrations

```bash
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### Django Shell

```bash
python manage.py shell

# Example queries
from quiz.models import Quiz, Question, Attempt
quizzes = Quiz.objects.all()
quiz = Quiz.objects.get(id=1)
questions = quiz.questions.all()
```

### Admin Panel

Access at `http://localhost:8000/admin/`

Register models in `quiz/admin.py`:

```python
from django.contrib import admin
from .models import Quiz, Question, Attempt, Answer

admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Attempt)
admin.site.register(Answer)
```

## Testing

### Running Tests

```bash
python manage.py test
```

### Writing Tests

```python
from django.test import TestCase
from django.contrib.auth.models import User
from quiz.models import Quiz, Question

class QuizTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser')
        self.quiz = Quiz.objects.create(
            user=self.user,
            topic='Python',
            difficulty='medium',
            num_questions=5
        )
    
    def test_quiz_creation(self):
        self.assertEqual(self.quiz.topic, 'Python')
        self.assertEqual(self.quiz.difficulty, 'medium')
```

## Error Handling

### Common Patterns

```python
try:
    # Attempt operation
    quiz = Quiz.objects.get(id=quiz_id)
except Quiz.DoesNotExist:
    return Response(
        {"error": "Quiz not found"},
        status=404
    )
except Exception as e:
    return Response(
        {"error": str(e)},
        status=500
    )
```

### Validation

```python
if not topic or not difficulty or not num_questions:
    return Response(
        {"error": "Missing required fields"},
        status=400
    )

if num_questions < 5 or num_questions > 20:
    return Response(
        {"error": "num_questions must be between 5 and 20"},
        status=400
    )
```

## Performance Optimization

### Database Queries

**Use select_related for foreign keys:**
```python
quizzes = Quiz.objects.select_related('user').all()
```

**Use prefetch_related for reverse relations:**
```python
quizzes = Quiz.objects.prefetch_related('questions').all()
```

**Use only() to limit fields:**
```python
quizzes = Quiz.objects.only('id', 'topic').all()
```

### Caching

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)  # Cache for 5 minutes
@api_view(['GET'])
def get_quizzes(request):
    # ...
```

### Pagination

```python
from rest_framework.pagination import PageNumberPagination

class QuizPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
```

## Security

### CSRF Protection

Enabled by default in Django middleware.

### SQL Injection Prevention

Use ORM queries (not raw SQL):
```python
# Good
Quiz.objects.filter(topic=topic)

# Bad
Quiz.objects.raw(f"SELECT * FROM quiz WHERE topic = '{topic}'")
```

### Input Validation

Always validate user input:
```python
if not isinstance(num_questions, int):
    return Response({"error": "Invalid input"}, status=400)
```

### Environment Variables

Store sensitive data in `.env`:
```
GEMINI_API_KEY=your_key
SECRET_KEY=your_secret
DATABASE_PASSWORD=your_password
```

## Deployment

### Production Settings

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
CORS_ALLOWED_ORIGINS = ['https://yourdomain.com']
```

### Environment Variables

```bash
export DEBUG=False
export SECRET_KEY=your_secret_key
export DATABASE_URL=postgresql://user:password@host:port/dbname
export GEMINI_API_KEY=your_api_key
```

### Gunicorn

```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

### Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres

# Verify credentials in settings.py
# Ensure database exists
psql -U postgres -c "CREATE DATABASE ai_quiz_db;"
```

### Migration Errors

```bash
# Reset migrations (development only)
python manage.py migrate quiz zero
python manage.py migrate

# Or create new migration
python manage.py makemigrations
python manage.py migrate
```

### API Not Responding

```bash
# Check if server is running
# Verify CORS configuration
# Check browser console for errors
# Review Django logs
```

## Code Style

### Naming Conventions

- **Models**: PascalCase (Quiz, Question)
- **Functions**: snake_case (generate_quiz)
- **Constants**: UPPER_SNAKE_CASE (API_KEY)
- **Variables**: snake_case (quiz_id)

### File Organization

```python
# 1. Imports
from django.db import models
from django.contrib.auth.models import User

# 2. Constants
MAX_QUESTIONS = 20

# 3. Models
class Quiz(models.Model):
    # ...

# 4. Functions
def generate_quiz(topic, num_questions, difficulty):
    # ...
```

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Google Generative AI](https://ai.google.dev/)

## Contributing

When contributing to the backend:

1. Create a new branch
2. Make changes following the style guide
3. Write tests for new features
4. Run migrations if needed
5. Test thoroughly
6. Submit a pull request

---

**Last Updated**: 2024
**Version**: 1.0.0
