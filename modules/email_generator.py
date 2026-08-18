import os
import time
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

GROQ_MODEL = "openai/gpt-oss-120b"
GROQ_REQUEST_DELAY_SECONDS = 4

def generate_email(name, interest):

    # Read prompt template
    with open("templates/prompt.txt", "r", encoding="utf-8") as file:
        prompt = file.read()

    # Replace placeholders
    prompt = prompt.replace("{name}", name)
    prompt = prompt.replace("{interest}", interest)

    # Send to Groq
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
        )
        text = response.choices[0].message.content
        time.sleep(GROQ_REQUEST_DELAY_SECONDS)

        if not text:
            raise ValueError("empty response")

        # Strip out <think>...</think> blocks if the model outputs reasoning tokens
        import re
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()

        return text
    except ValueError:
        raise RuntimeError(
            "Groq returned no usable content (empty or blocked response)."
        )
    except Exception as e:
        raise RuntimeError(f"Groq request failed: {e}")