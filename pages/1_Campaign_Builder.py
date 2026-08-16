import streamlit as st
import pandas as pd
from modules.ui import apply_custom_css
from modules.validator import validate_email
from modules.email_generator import generate_email
from modules.file_manager import save_email
from modules.email_sender import send_email
from modules.utils import extract_subject_and_body
from modules.database import is_already_sent
from modules.logger import log_campaign

st.set_page_config(
    page_title="Campaign Builder | MailForge",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="collapsed"
)

apply_custom_css()

if st.button("⬅️ Back to Dashboard", key="back_btn"):
    st.switch_page("dashboard.py")

st.title("🚀 Campaign Builder")

if "customers" not in st.session_state or st.session_state.customers is None:
    st.info("👆 Please go back to the Dashboard and upload a CSV file first.")
else:
    customers = st.session_state.customers
    
    st.subheader("Step 1: AI Generation")
    tone = st.selectbox("Select Global Email Tone", ["Professional", "Casual", "Enthusiastic", "Persuasive"])
    
    if st.button("🤖 Generate Emails"):
        progress = st.progress(0)
        total = len(customers)
        st.session_state.generated_emails = {}
        
        for index, row in customers.iterrows():
            progress.progress((index + 1) / total)
            name = row["Name"]
            email = row["Email"]
            interest = row["Interest"]

            if validate_email(email):
                try:
                    email_text = generate_email(name, f"{interest} ({tone} tone)")
                    st.session_state.generated_emails[email] = {
                        "name": name,
                        "content": email_text
                    }
                    save_email(name, email_text)
                except Exception as e:
                    st.warning(f"⚠️ Failed for {name}: {e}")
        st.success("Drafts generated successfully!")
        st.rerun()

    st.subheader("Step 2: Review Drafts")
    if "generated_emails" in st.session_state and st.session_state.generated_emails:
        for email, draft in st.session_state.generated_emails.items():
            with st.expander(f"Draft for: {draft['name']} ({email})"):
                st.text(draft["content"])
    else:
        st.info("No drafts generated yet.")

    st.subheader("Step 3: Dispatch")
    dry_run = st.checkbox("🧪 Dry Run (preview only, skip actual sending)")
    confirm_send = dry_run or st.checkbox(f"🚀 I confirm I want to send {len(st.session_state.generated_emails)} real email(s) now.")

    if st.button("📧 Send Emails", disabled=(len(st.session_state.generated_emails) == 0 or not confirm_send)):
        sent_count = failed_count = skipped_count = 0
        progress = st.progress(0)
        total = len(customers)
        
        smtp_conn = None
        if not dry_run:
            import smtplib, os
            from dotenv import load_dotenv
            load_dotenv()
            try:
                smtp_conn = smtplib.SMTP_SSL("smtp.gmail.com", 465)
                smtp_conn.login(os.getenv("EMAIL_ADDRESS"), os.getenv("EMAIL_PASSWORD"))
            except Exception as e:
                st.error(f"Failed to connect to SMTP: {e}")
                st.stop()
        
        for index, row in customers.iterrows():
            progress.progress((index + 1) / total)
            name = row["Name"]
            email = row["Email"]
            interest = row["Interest"]

            if validate_email(email):
                if is_already_sent(email, interest):
                    st.warning(f"⏭️ Skipping {name} ({email}) — already sent.")
                    log_campaign(name, email, interest, "Skipped")
                    skipped_count += 1
                    continue
                    
                draft = st.session_state.generated_emails.get(email)
                if not draft: continue
                    
                subject, body = extract_subject_and_body(draft["content"])

                if dry_run:
                    sent_count += 1
                    st.info(f"🧪 [Dry Run] Would send to {name}")
                elif send_email(email, subject, body, smtp_conn=smtp_conn):
                    sent_count += 1
                    log_campaign(name, email, interest, "Sent")
                else:
                    failed_count += 1
                    log_campaign(name, email, interest, "Failed")

        if smtp_conn: smtp_conn.quit()
        if sent_count > 0 or dry_run: st.success(f"✅ {sent_count} email(s) sent!")
        if skipped_count > 0: st.info(f"⏭️ {skipped_count} email(s) skipped.")
        if failed_count > 0: st.error(f"❌ {failed_count} email(s) failed.")
