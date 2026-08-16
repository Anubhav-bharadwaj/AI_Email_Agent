import streamlit as st

def apply_custom_css():
    st.markdown("""
        <style>
            [data-testid="collapsedControl"] { display: none; }
            [data-testid="stSidebar"] { display: none; }
            
            [data-testid="stAppViewContainer"] {
                background: linear-gradient(135deg, #F0F4F8 0%, #D9E2EC 100%);
            }
            
            h1, h2, h3, p, span, div {
                font-family: 'Inter', sans-serif;
                color: #102A43;
            }
            
            div[data-testid="stMarkdownContainer"] > h1 {
                color: #102A43 !important;
                font-weight: 800 !important;
                text-align: center;
                padding-bottom: 20px;
            }
            
            /* Primary Button Styling (Gradient Pill) */
            .stButton > button {
                background: linear-gradient(90deg, #3EBD93 0%, #0F9971 100%) !important;
                color: white !important;
                border: none !important;
                border-radius: 30px !important;
                font-weight: 600 !important;
                padding: 14px 24px !important;
                transition: all 0.3s ease !important;
                width: 100% !important;
                box-shadow: 0 4px 14px rgba(15, 153, 113, 0.4) !important;
            }
            .stButton > button:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 6px 20px rgba(15, 153, 113, 0.6) !important;
            }
            
            [data-testid="stDataFrame"] {
                background-color: #FFFFFF;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(16, 42, 67, 0.05);
            }
        </style>
    """, unsafe_allow_html=True)

def apply_card_css():
    st.markdown("""
        <style>
            /* Style the actual columns as Neumorphic Cards on the dashboard */
            div[data-testid="stHorizontalBlock"]:nth-of-type(1) > div[data-testid="column"]:nth-child(2),
            div[data-testid="stHorizontalBlock"]:nth-of-type(1) > div[data-testid="column"]:nth-child(3) {
                background-color: #FFFFFF;
                border-radius: 24px;
                padding: 35px 25px 35px 25px; 
                box-shadow: 12px 12px 24px rgba(16, 42, 67, 0.1), -12px -12px 24px rgba(255, 255, 255, 0.9);
                border: 1px solid rgba(255, 255, 255, 0.4);
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .card-icon-wrapper {
                background-color: #F8FAFC;
                width: 64px;
                height: 64px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 4px 4px 8px rgba(16, 42, 67, 0.08), inset -4px -4px 8px rgba(255, 255, 255, 0.9);
                margin: 0 auto 20px auto;
                font-size: 28px;
            }
            
            .card-title {
                color: #102A43 !important;
                margin-bottom: 12px;
                font-weight: 700;
                font-size: 1.5rem;
            }
            
            .card-desc {
                color: #627D98 !important;
                font-size: 14px;
                line-height: 1.5;
                margin-bottom: 30px;
            }
        </style>
    """, unsafe_allow_html=True)
