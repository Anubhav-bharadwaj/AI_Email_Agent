def extract_subject_and_body(email_text):

    lines = email_text.split("\n")

    subject = "AI Course"

    body = email_text

    if lines and lines[0].lower().startswith("subject:"):

        subject = lines[0].replace("Subject:", "").strip()

        body = "\n".join(lines[1:]).strip()

    return subject, body