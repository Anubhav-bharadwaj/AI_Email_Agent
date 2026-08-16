import streamlit as st
import pandas as pd
from modules.data_loader import validate_customer_columns
from modules.ui import apply_custom_css, apply_card_css
from modules.logger import initialize_database

initialize_database()

st.set_page_config(
    page_title="MailForge",
    page_icon="✉️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

apply_custom_css()
apply_card_css()

if "generated_emails" not in st.session_state:
    st.session_state.generated_emails = {}
if "customers" not in st.session_state:
    st.session_state.customers = None

st.title("✉️ MailForge")

# TOP: CSV UPLOAD
st.markdown("### 1. Upload Customer Data")
uploaded_file = st.file_uploader("Upload CSV File", type=["csv"], label_visibility="collapsed")

if uploaded_file is not None:
    try:
        customers = pd.read_csv(uploaded_file)
        customers = validate_customer_columns(customers)
        customers = customers.drop_duplicates(subset="Email", keep="first")
        st.session_state.customers = customers
        st.success(f"✅ Loaded {len(customers)} customers successfully!")
    except Exception as e:
        st.error(f"❌ Error loading CSV: {e}")

st.write("") # Spacer

# TAB BOXES
spacer1, col1, col2, spacer2 = st.columns([1, 3, 3, 1])

with col1:
    st.markdown("""
        <div class="card-icon-wrapper">🚀</div>
        <div class="card-title">Campaign Builder</div>
        <div class="card-desc">Generate personalized emails, preview drafts, and dispatch your campaign seamlessly.</div>
    """, unsafe_allow_html=True)
    if st.button("Open Builder", key="btn_builder", use_container_width=True):
        st.switch_page("pages/1_Campaign_Builder.py")

with col2:
    st.markdown("""
        <div class="card-icon-wrapper">📊</div>
        <div class="card-title">Campaign History</div>
        <div class="card-desc">Browse through your historical campaign logs, dispatched successes, and failed emails.</div>
    """, unsafe_allow_html=True)
    if st.button("Open History", key="btn_history", use_container_width=True):
        st.switch_page("pages/2_History.py")