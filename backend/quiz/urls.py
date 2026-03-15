from django.urls import path
from .views import get_quizzes, generate_quiz_api, submit_quiz

urlpatterns = [
    path("quizzes/", get_quizzes),
    path("generate-quiz/", generate_quiz_api),
    path("submit-quiz/", submit_quiz),
]