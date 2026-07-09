import os


def save_email(name, content):

    folder = "generated_emails"

    # Create folder if it doesn't exist
    os.makedirs(folder, exist_ok=True)

    filename = os.path.join(folder, f"{name}.txt")

    with open(filename, "w", encoding="utf-8") as file:
        file.write(content)

    print(f"✅ Saved {filename}")