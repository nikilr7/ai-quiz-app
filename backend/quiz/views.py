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
            return Response(ai_questions, status=500)
        
        if not ai_questions or not isinstance(ai_questions, list):
            return Response(
                {"error": "Failed to generate quiz questions"},
                status=500
            )

        for q in ai_questions:
            Question.objects.create(
                quiz=quiz,
                question_text=q["question"],
                option_a=q["option_a"],
                option_b=q["option_b"],
                option_c=q["option_c"],
                option_d=q["option_d"],
                correct_answer=q["correct_answer"]
            )

        return Response({
            "message": "Quiz generated successfully",
            "quiz_id": quiz.id
        }, status=201)
    except Exception as e:
        return Response(
            {"error": str(e)},
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
