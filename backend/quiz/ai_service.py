import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-pro")


def generate_quiz(topic, num_questions, difficulty):

    prompt = f"""
    Generate {num_questions} multiple choice questions about {topic}.
    Difficulty: {difficulty}.
    Each question should have 4 options and correct answer.
    Return JSON format.
    """

    response = model.generate_content(prompt)

    return response.text