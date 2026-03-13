from django.urls import path
from .views import get_quizzes

urlpatterns = [
    path("quizzes/", get_quizzes),
]