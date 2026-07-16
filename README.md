# 📧 AI Email Campaign Automation Agent

An AI-powered email campaign automation system built with Python, Streamlit, and the Google Gemini API.

The application generates personalized marketing emails based on customer interests, allows users to preview generated drafts, sends emails through Gmail SMTP, and maintains a campaign history using SQLite.

---

## ✨ Features

- 📂 Upload customer data using a CSV file
- 🤖 Generate personalized emails with Google Gemini AI
- 👀 Preview generated email drafts
- 📧 Send emails directly from the dashboard
- 🗂 Save generated drafts locally
- 📊 Track campaign history using SQLite
- ✅ Email validation before sending
- 🌐 Interactive Streamlit dashboard

---

## 🛠 Tech Stack

- Python
- Streamlit
- Google Gemini API
- Pandas
- SQLite
- SMTP (Gmail)
- dotenv

---

## 📁 Project Structure

```
AI_Email_Agent/
│
├── data/
├── generated_emails/
├── logs/
├── modules/
├── templates/
├── app.py
├── dashboard.py
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🚀 Installation

1. Clone the repository

```bash
git clone https://github.com/Anubhav-bharadwaj/AI_Email_Agent.git
cd AI_Email_Agent
```

2. Create a virtual environment

```bash
python -m venv venv
```

3. Activate it

```bash
venv\Scripts\activate
```

4. Install dependencies

```bash
pip install -r requirements.txt
```

5. Create a `.env` file using `.env.example` and add your API keys and email credentials.

---

## ▶️ Run the Dashboard

```bash
streamlit run dashboard.py
```

---

## 📄 CSV Format

```csv
Name,Email,Interest
John,john@example.com,Artificial Intelligence
Sarah,sarah@example.com,Digital Marketing
```

---

## 📌 Future Improvements

- Email scheduling
- HTML email templates
- Attachment support
- Analytics dashboard
- Bulk campaign management
- Multi-user authentication

---