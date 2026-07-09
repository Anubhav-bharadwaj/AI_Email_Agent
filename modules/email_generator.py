import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_email(name, interest):

    # Read prompt template
    with open("templates/prompt.txt", "r", encoding="utf-8") as file:
        prompt = file.read()

    # Replace placeholders
    prompt = prompt.replace("{name}", name)
    prompt = prompt.replace("{interest}", interest)

    # Send to Gemini
    response = model.generate_content(prompt)

    return response.text