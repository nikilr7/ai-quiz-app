import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
def get_api_key():
    """Get API key from environment, with fallback to .env file"""
    # Try to get from environment first
    api_key = os.getenv("GEMINI_API_KEY")
    
    # If not found, try to load from .env file
    if not api_key:
        load_dotenv(override=True)
        api_key = os.getenv("GEMINI_API_KEY")
    
    return api_key

def configure_genai():
    """Configure Gemini API with proper error handling"""
    api_key = get_api_key()
    
    if not api_key or api_key == "your_api_key_here":
        raise ValueError(
            "GEMINI_API_KEY not set. Please:\n"
            "1. Get your API key from: https://aistudio.google.com/\n"
            "2. Create backend/.env file with: GEMINI_API_KEY=your_key\n"
            "3. Restart the backend server"
        )
    
    try:
        genai.configure(api_key=api_key)
        return True
    except Exception as e:
        raise ValueError(f"Error configuring Gemini API: {e}")

# Configure on import
try:
    configure_genai()
except ValueError as e:
    print(f"WARNING: {e}")

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

    json_format = '''[
      {
        "question": "Question text",
        "option_a": "Option A text",
        "option_b": "Option B text",
        "option_c": "Option C text",
        "option_d": "Option D text",
        "correct_answer": "A"
      }
    ]'''

    prompt = f"""Generate {num_questions} multiple choice questions about {topic}.
Difficulty level: {difficulty}.

Return ONLY valid JSON in this exact format:
{json_format}

Do not include any markdown, code blocks, or explanations. Return only the JSON array."""

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