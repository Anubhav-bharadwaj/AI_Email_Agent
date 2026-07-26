import os
import time
import smtplib
from email.message import EmailMessage
from email.utils import formataddr
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SENDER_NAME = os.getenv("SENDER_NAME") 

SMTP_SEND_DELAY_SECONDS = 2

def send_email(receiver_email, subject, body):

    try:

        msg = EmailMessage()

        if SENDER_NAME:
            msg["From"] = formataddr((SENDER_NAME, EMAIL_ADDRESS))
        else:
            msg["From"] = EMAIL_ADDRESS
        msg["To"] = receiver_email
        msg["Subject"] = subject

        msg.set_content(body)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:

            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

            smtp.send_message(msg)

        print(f"✅ Email sent to {receiver_email}")
        time.sleep(SMTP_SEND_DELAY_SECONDS)
        
        return True

    except smtplib.SMTPException as e:

        print(f"❌ SMTP error while sending to {receiver_email}: {e}")

        return False

    except OSError as e:

        print(f"❌ Network/connection error while sending to {receiver_email}: {e}")

        return False

    except Exception as e:

        print(f"❌ Unexpected error while sending to {receiver_email}: {e}")

        return False