import os
import re
import uuid

def save_email(name, content):

    folder = "generated_emails"

    # Create folder if it doesn't exist
    os.makedirs(folder, exist_ok=True)

    safe_name = re.sub(r"[^A-Za-z0-9_-]", "_", name)
    unique_id = uuid.uuid4().hex[:8]
    filename = os.path.join(folder, f"{safe_name}_{unique_id}.txt")
    
    with open(filename, "w", encoding="utf-8") as file:
        file.write(content)

    print(f"✅ Saved {filename}")