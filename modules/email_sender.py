import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def send_email(receiver_email, subject, body):

    try:

        msg = EmailMessage()

        msg["From"] = EMAIL_ADDRESS
        msg["To"] = receiver_email
        msg["Subject"] = subject

        msg.set_content(body)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:

            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

            smtp.send_message(msg)

        print(f"✅ Email sent to {receiver_email}")

        return True

    except Exception as e:

        print(f"❌ Failed to send email: {e}")

        return False