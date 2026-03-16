from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Quiz, Question, Attempt, Answer
from .serializers import QuizSerializer
from .ai_service import generate_quiz


@api_view(['GET'])
def get_quizzes(request):
    quizzes = Quiz.objects.all()
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def generate_quiz_api(request):
    try:
        topic = request.data.get("topic")
        difficulty = request.data.get("difficulty")
        num_questions = request.data.get("num_questions")

        # Validate required fields
        if not topic or not difficulty or not num_questions:
            return Response(
                {"error": "Missing required fields: topic, difficulty, num_questions"},
                status=400
            )

        # Validate num_questions is an integer
        try:
            num_questions = int(num_questions)
        except (ValueError, TypeError):
            return Response(
                {"error": "num_questions must be an integer"},
                status=400
            )

        # Validate num_questions range
        if num_questions < 5 or num_questions > 20:
            return Response(
                {"error": "num_questions must be between 5 and 20"},
                status=400
            )

        # Get or create a default user
        user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@quiz.local'}
        )

        quiz = Quiz.objects.create(
            user=user,
            topic=topic,
            difficulty=difficulty,
            num_questions=num_questions
        )

        ai_questions = generate_quiz(topic, num_questions, difficulty)

        # Check if response is an error dict
        if isinstance(ai_questions, dict) and "error" in ai_questions:
            # Delete the quiz if AI generation failed
            quiz.delete()
            return Response(ai_questions, status=500)
        
        if not ai_questions or not isinstance(ai_questions, list):
            # Delete the quiz if no questions were generated
            quiz.delete()
            return Response(
                {"error": "Failed to generate quiz questions"},
                status=500
            )

        # Create questions
        for q in ai_questions:
            try:
                Question.objects.create(
                    quiz=quiz,
                    question_text=q.get("question", ""),
                    option_a=q.get("option_a", ""),
                    option_b=q.get("option_b", ""),
                    option_c=q.get("option_c", ""),
                    option_d=q.get("option_d", ""),
                    correct_answer=q.get("correct_answer", "A")
                )
            except Exception as q_error:
                print(f"Error creating question: {q_error}")
                continue

        # Fetch the complete quiz with questions
        quiz_with_questions = Quiz.objects.prefetch_related('questions').get(id=quiz.id)
        serializer = QuizSerializer(quiz_with_questions)
        
        return Response(serializer.data, status=201)
    except Exception as e:
        import traceback
        print(f"Error in generate_quiz_api: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {"error": f"Server error: {str(e)}"},
            status=500
        )


@api_view(['POST'])
def submit_quiz(request):

    try:
        quiz_id = request.data.get("quiz_id")
        answers = request.data.get("answers")

        if not quiz_id or not answers:
            return Response(
                {"error": "quiz_id and answers required"},
                status=400
            )

        quiz = Quiz.objects.get(id=quiz_id)

        user = User.objects.get(username="default_user")

        score = 0

        attempt = Attempt.objects.create(
            user=user,
            quiz=quiz,
            score=0
        )

        for ans in answers:

            question = Question.objects.get(id=ans["question_id"])
            selected = ans["selected_answer"]

            if selected == question.correct_answer:
                score += 1

            Answer.objects.create(
                attempt=attempt,
                question=question,
                selected_answer=selected
            )

        attempt.score = score
        attempt.save()

        return Response({
            "message": "Quiz submitted successfully",
            "attempt_id": attempt.id,
            "score": score,
            "total": quiz.num_questions
        }, status=201)

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=500
        )
