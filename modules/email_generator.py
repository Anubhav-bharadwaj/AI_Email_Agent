import os
import time
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
GEMINI_REQUEST_DELAY_SECONDS = 4

def generate_email(name, interest):

    # Read prompt template
    with open("templates/prompt.txt", "r", encoding="utf-8") as file:
        prompt = file.read()

    # Replace placeholders
    prompt = prompt.replace("{name}", name)
    prompt = prompt.replace("{interest}", interest)

    # Send to Gemini
    try:
        response = model.generate_content(prompt)
        time.sleep(GEMINI_REQUEST_DELAY_SECONDS)
        return response.text
    except ValueError:
        raise RuntimeError(
            "Gemini returned no usable content (likely blocked by safety filters)."
        )
    except Exception as e:
        raise RuntimeError(f"Gemini request failed: {e}")