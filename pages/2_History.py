import streamlit as st
import pandas as pd
from modules.ui import apply_custom_css
from modules.database import get_campaign_history, clear_campaign_history

st.set_page_config(
    page_title="Campaign History | MailForge",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

apply_custom_css()

if st.button("⬅️ Back to Dashboard", key="back_btn"):
    st.switch_page("dashboard.py")

st.title("📊 Campaign History")

col1, col2 = st.columns([1, 4])
with col1:
    if st.button("🗑 Delete History"):
        clear_campaign_history()
        st.success("Campaign history cleared!")
        st.rerun()
        
history = get_campaign_history()
if history.empty:
    st.info("No campaign history available.")
else:
    status_filter = st.selectbox("Filter by Status", ["All", "Sent", "Failed", "Skipped"])
    if status_filter != "All":
        history = history[history['status'] == status_filter]
    
    history = history.drop(columns=["id"], errors="ignore")
    st.dataframe(history, use_container_width=True)
