import pandas as pd
import streamlit as st

from modules.validator import validate_email
from modules.email_generator import generate_email
from modules.file_manager import save_email
from modules.email_sender import send_email
from modules.utils import extract_subject_and_body
from modules.database import (get_campaign_history,clear_campaign_history)
from modules.logger import log_campaign, initialize_database
from modules.data_loader import validate_customer_columns

initialize_database()

st.set_page_config(
    page_title="AI Email Campaign Automation",
    page_icon="📧",
    layout="wide"
)

if "generated_emails" not in st.session_state:
    st.session_state.generated_emails = {}

st.title("📧 AI Email Campaign Automation Agent")

st.write(
    "Generate and send AI-powered personalized email campaigns."
)

uploaded_file = st.file_uploader(
    "Upload Customer CSV",
    type=["csv"]
)

if uploaded_file is not None:

    try:
        customers = pd.read_csv(uploaded_file)
        customers = validate_customer_columns(customers)
    except pd.errors.EmptyDataError:
        st.error("❌ The uploaded CSV is empty. Please upload a file with data.")
        st.stop()
    except ValueError as e:
        st.error(f"❌ {e}")
        st.stop()

    customers = customers.drop_duplicates(subset="Email", keep="first")
    st.success("CSV Loaded Successfully!")
    
    col1, col2 = st.columns(2)
    col1.metric(
        "👥 Customers",
        len(customers)
    )
    col2.metric(
        "📄 Drafts",
        len(st.session_state.generated_emails)
    )
    st.dataframe(customers)

    if st.button("🤖 Generate Emails"):
        progress = st.progress(0)
        total = len(customers)
        st.session_state.generated_emails.clear()
        for index, row in customers.iterrows():
            progress.progress((index + 1) / total)
            name = row["Name"]
            email = row["Email"]
            interest = row["Interest"]

            if validate_email(email):
                try:
                    email_text = generate_email(name, interest)
                except Exception as e:
                    st.warning(f"⚠️ Failed to generate email for {name} ({email}): {e}")
                    continue
                st.session_state.generated_emails[email] = {
                    "name": name,
                    "content": email_text
                }
                save_email(name, email_text)

        st.success("Emails generated successfully!")
        st.rerun()
    st.subheader("Generated Drafts")
    if st.session_state.generated_emails:
        for email, draft in st.session_state.generated_emails.items():
            with st.expander(f"📄 {draft['name']}"):
                st.text(draft["content"])
    else:
        st.info("No drafts generated yet.")

    if st.button(
    "📧 Send Emails",
    disabled=len(st.session_state.generated_emails) == 0
    ):
        sent_count = 0
        failed_count = 0
        progress = st.progress(0)
        total = len(customers)
        for index, row in customers.iterrows():

            progress.progress((index + 1) / total)

            name = row["Name"]
            email = row["Email"]
            interest = row["Interest"]

            if validate_email(email):
                draft = st.session_state.generated_emails.get(email)
                if draft is None:
                    st.warning(f"No draft found for {name}. Please generate emails first.")
                    continue
                subject, body = extract_subject_and_body(draft["content"])

                if send_email(email, subject, body):
                    sent_count += 1
                    log_campaign(
                        name,
                        email,
                        interest,
                        "Sent"
                    )
                else:
                    failed_count += 1
                    log_campaign(
                        name,
                        email,
                        interest,
                        "Failed"
                    )

        st.success(f"✅ {sent_count} email(s) sent!")

        if failed_count > 0:
            st.error(f"❌ {failed_count} email(s) failed.")
        

    st.divider()

    if st.button("🗑 Clear History",disabled=get_campaign_history().empty):
        clear_campaign_history()
        st.success("Campaign history cleared!")
        st.rerun()

    st.header("📊 Campaign History")
    history = get_campaign_history()
    if history.empty:
        st.info("No campaign history available.")
    else:
        history = history.drop(columns=["id"], errors="ignore")
        st.dataframe(
            history,
            use_container_width=True
        )