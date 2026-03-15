import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Get available models and find one that supports generateContent
def get_available_model():
    try:
        available_models = genai.list_models()
        for m in available_models:
            if 'generateContent' in m.supported_generation_methods:
                return m.name.replace('models/', '')
    except Exception as e:
        print(f"Error listing models: {e}")
    
    # Fallback to known working model
    return "gemini-2.0-flash-exp"

model_name = get_available_model()
model = genai.GenerativeModel(model_name)


def generate_quiz(topic, num_questions, difficulty):

    prompt = f"""
    Generate {num_questions} multiple choice questions about {topic}.
    Difficulty: {difficulty}.

    Return ONLY valid JSON like this format:

    [
      {{
        "question": "Question text",
        "option_a": "Option A text",
        "option_b": "Option B text",
        "option_c": "Option C text",
        "option_d": "Option D text",
        "correct_answer": "A"
      }}
    ]
    
    Do not include any markdown or code blocks. Return only the JSON array.
    """

    try:
        response = model.generate_content(prompt)
        
        if not response.text:
            return {"error": "Empty response from AI model"}
        
        text = response.text.strip()
        
        # Try to extract JSON if it's wrapped in markdown code blocks
        if text.startswith('```'):
            text = text.split('```')[1]
            if text.startswith('json'):
                text = text[4:]
            text = text.strip()
        
        questions = json.loads(text)
        
        if not isinstance(questions, list):
            return {"error": "AI response is not a list"}
            
        return questions
    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return {"error": f"Failed to parse AI response as JSON: {str(e)}"}
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return {"error": f"Error calling AI model: {str(e)}"}