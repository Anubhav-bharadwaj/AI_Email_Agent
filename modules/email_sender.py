import os
import html
import smtplib
import mimetypes
from email.message import EmailMessage
from email.utils import formataddr, make_msgid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
SENDER_NAME = os.getenv("SENDER_NAME") 

BANNER_IMAGE_PATH = "assets/banner.png"

def send_email(receiver_email, subject, body, smtp_conn=None):

    try:

        msg = EmailMessage()

        if SENDER_NAME:
            msg["From"] = formataddr((SENDER_NAME, EMAIL_ADDRESS))
        else:
            msg["From"] = EMAIL_ADDRESS
        msg["To"] = receiver_email
        msg["Subject"] = subject

        # Plain-text fallback (unchanged content, no banner markup)
        msg.set_content(body)

        # HTML version: banner image on top, AI-generated content below
        banner_cid = make_msgid(domain="aiemailagent.local")
        escaped_body = html.escape(body)

        html_body = (
            '<img src="cid:{cid}" alt="Banner" width="100%" '
            'style="width:100%; height:auto; display:block; border:0;">'
            '<pre style="font-family:inherit; white-space:pre-wrap; '
            'word-wrap:break-word; margin:0;">{content}</pre>'
        ).format(cid=banner_cid[1:-1], content=escaped_body)

        msg.add_alternative(html_body, subtype="html")

        with open(BANNER_IMAGE_PATH, "rb") as img_file:
            img_data = img_file.read()

        mime_type, _ = mimetypes.guess_type(BANNER_IMAGE_PATH)
        maintype, subtype = (mime_type or "image/png").split("/")

        msg.get_payload()[1].add_related(
            img_data, maintype=maintype, subtype=subtype, cid=banner_cid
        )

        if smtp_conn:
            smtp_conn.send_message(msg)
        else:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
                smtp.send_message(msg)

        print(f"✅ Email sent to {receiver_email}")
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