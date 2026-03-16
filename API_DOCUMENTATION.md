# AI Quiz App - API Documentation

Complete API reference for the AI Quiz Application backend.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Currently, the API uses a default user for all operations. Future versions should implement proper authentication.

## Endpoints

### 1. Get All Quizzes

Retrieve a list of all quizzes that have been created.

**Endpoint:**
```
GET /quizzes/
```

**Method:** GET

**Headers:**
```
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": 1,
    "topic": "Python Programming",
    "difficulty": "medium",
    "num_questions": 10,
    "created_at": "2024-01-15T10:30:00Z",
    "questions": [
      {
        "id": 1,
        "question_text": "What is Python?",
        "option_a": "A snake",
        "option_b": "A programming language",
        "option_c": "A movie",
        "option_d": "A type of food",
        "correct_answer": "B"
      },
      ...
    ]
  },
  ...
]
```

**Example Request:**
```bash
curl -X GET http://localhost:8000/api/quizzes/
```

---

### 2. Generate Quiz

Generate a new AI-powered quiz with questions on a specified topic.

**Endpoint:**
```
POST /generate-quiz/
```

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "topic": "Python Programming",
  "difficulty": "medium",
  "num_questions": 10
}
```

**Parameters:**
- `topic` (string, required): The topic for the quiz
  - Example: "Python Programming", "World History", "Biology"
  - Max length: 255 characters
  
- `difficulty` (string, required): Difficulty level
  - Allowed values: "easy", "medium", "hard"
  
- `num_questions` (integer, required): Number of questions
  - Allowed range: 5-20

**Response (201 Created):**
```json
{
  "message": "Quiz generated successfully",
  "quiz_id": 1
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: topic, difficulty, num_questions"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to generate quiz questions"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python Programming",
    "difficulty": "medium",
    "num_questions": 10
  }'
```

**Example Response:**
```json
{
  "message": "Quiz generated successfully",
  "quiz_id": 1
}
```

---

### 3. Submit Quiz

Submit answers for a quiz and receive the score.

**Endpoint:**
```
POST /submit-quiz/
```

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "quiz_id": 1,
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "A"
    },
    {
      "question_id": 2,
      "selected_answer": "B"
    },
    ...
  ]
}
```

**Parameters:**
- `quiz_id` (integer, required): ID of the quiz being submitted
- `answers` (array, required): Array of answer objects
  - `question_id` (integer): ID of the question
  - `selected_answer` (string): Selected option (A, B, C, or D)

**Response (201 Created):**
```json
{
  "message": "Quiz submitted successfully",
  "attempt_id": 1,
  "score": 8,
  "total": 10
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "quiz_id and answers required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Quiz not found"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/submit-quiz/ \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_id": 1,
    "answers": [
      {
        "question_id": 1,
        "selected_answer": "A"
      },
      {
        "question_id": 2,
        "selected_answer": "B"
      },
      {
        "question_id": 3,
        "selected_answer": "C"
      }
    ]
  }'
```

**Example Response:**
```json
{
  "message": "Quiz submitted successfully",
  "attempt_id": 1,
  "score": 2,
  "total": 3
}
```

---

## Data Models

### Quiz Model

Represents a quiz created by a user.

```python
{
  "id": 1,
  "user": 1,
  "topic": "Python Programming",
  "difficulty": "medium",
  "num_questions": 10,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Fields:**
- `id`: Unique identifier
- `user`: Foreign key to User
- `topic`: Quiz topic (max 255 characters)
- `difficulty`: "easy", "medium", or "hard"
- `num_questions`: Number of questions (5-20)
- `created_at`: Timestamp of creation

---

### Question Model

Represents a single question in a quiz.

```python
{
  "id": 1,
  "quiz": 1,
  "question_text": "What is Python?",
  "option_a": "A snake",
  "option_b": "A programming language",
  "option_c": "A movie",
  "option_d": "A type of food",
  "correct_answer": "B"
}
```

**Fields:**
- `id`: Unique identifier
- `quiz`: Foreign key to Quiz
- `question_text`: The question text
- `option_a`, `option_b`, `option_c`, `option_d`: Answer options
- `correct_answer`: Correct option (A, B, C, or D)

---

### Attempt Model

Represents a user's attempt at taking a quiz.

```python
{
  "id": 1,
  "user": 1,
  "quiz": 1,
  "score": 8,
  "created_at": "2024-01-15T10:45:00Z"
}
```

**Fields:**
- `id`: Unique identifier
- `user`: Foreign key to User
- `quiz`: Foreign key to Quiz
- `score`: Number of correct answers
- `created_at`: Timestamp of submission

---

### Answer Model

Represents a user's answer to a specific question.

```python
{
  "id": 1,
  "attempt": 1,
  "question": 1,
  "selected_answer": "B"
}
```

**Fields:**
- `id`: Unique identifier
- `attempt`: Foreign key to Attempt
- `question`: Foreign key to Question
- `selected_answer`: User's selected option (A, B, C, or D)

---

## Error Handling

### Common Error Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Quiz or question not found |
| 500 | Internal Server Error | AI service error, database error |

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Description of the error"
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider implementing:
- Per-IP rate limiting
- Per-user rate limiting
- AI API rate limiting

---

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

To add more origins, update `CORS_ALLOWED_ORIGINS` in `backend/settings.py`.

---

## Example Workflow

### 1. Generate a Quiz

```bash
curl -X POST http://localhost:8000/api/generate-quiz/ \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python Programming",
    "difficulty": "medium",
    "num_questions": 5
  }'
```

Response:
```json
{
  "message": "Quiz generated successfully",
  "quiz_id": 1
}
```

### 2. Get Quiz Details

```bash
curl -X GET http://localhost:8000/api/quizzes/
```

Response includes the quiz with all questions.

### 3. Submit Answers

```bash
curl -X POST http://localhost:8000/api/submit-quiz/ \
  -H "Content-Type: application/json" \
  -d '{
    "quiz_id": 1,
    "answers": [
      {"question_id": 1, "selected_answer": "A"},
      {"question_id": 2, "selected_answer": "B"},
      {"question_id": 3, "selected_answer": "C"},
      {"question_id": 4, "selected_answer": "D"},
      {"question_id": 5, "selected_answer": "A"}
    ]
  }'
```

Response:
```json
{
  "message": "Quiz submitted successfully",
  "attempt_id": 1,
  "score": 4,
  "total": 5
}
```

---

## Testing with Postman

1. Import the endpoints into Postman
2. Set base URL: `http://localhost:8000/api`
3. Create requests for each endpoint
4. Test with various parameters
5. Verify responses match documentation

---

## Frontend Integration

The frontend consumes these endpoints as follows:

```typescript
// Generate Quiz
const response = await fetch(`${API_BASE_URL}/generate-quiz/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic, difficulty, num_questions })
});

// Get Quizzes
const response = await fetch(`${API_BASE_URL}/quizzes/`);

// Submit Quiz
const response = await fetch(`${API_BASE_URL}/submit-quiz/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ quiz_id, answers })
});
```

---

## Future Enhancements

1. **Authentication**: Implement JWT or session-based authentication
2. **User Endpoints**: Add user registration and profile endpoints
3. **Quiz Filtering**: Filter quizzes by user, topic, or difficulty
4. **Pagination**: Add pagination for large datasets
5. **Search**: Add search functionality for quizzes
6. **Analytics**: Add endpoints for user statistics and progress tracking
7. **Caching**: Implement caching for frequently accessed data
8. **Versioning**: Add API versioning (v1, v2, etc.)

---

## Support

For issues or questions about the API:
1. Check the error response message
2. Verify request format matches documentation
3. Ensure all required fields are provided
4. Check backend logs for detailed error information

---

**Last Updated**: 2024
**API Version**: 1.0.0
