from modules.data_loader import load_customers
from modules.validator import validate_email
from modules.email_generator import generate_email
from modules.file_manager import save_email
from modules.logger import initialize_database
from modules.logger import log_campaign
from modules.email_sender import send_email
from modules.utils import extract_subject_and_body

# Load customer data
customers = load_customers("data/customers.csv")
initialize_database()

for index, row in customers.iterrows():

    name = row["Name"]
    email = row["Email"]
    interest = row["Interest"]

    # Validate email
    if validate_email(email):

        print("=" * 70)
        print(f"Generating email for: {name}")

        ai_email = generate_email(name, interest)

        save_email(name, ai_email)

        # Extract subject and body
        subject, body = extract_subject_and_body(ai_email)

        # Send email
        sent = send_email(
            email,
            subject,
            body
        )

        # Decide status
        if sent:
            status = "Sent"
        else:
            status = "Failed"

        # Log to database
        log_campaign(
            name,
            email,
            interest,
            status
        )

        print(ai_email)
    else:
        print(f"{email} is not a valid email address.")