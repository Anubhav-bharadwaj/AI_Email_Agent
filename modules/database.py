import os
import sqlite3
import pandas as pd


def get_campaign_history():

    os.makedirs("logs", exist_ok=True)
    
    connection = sqlite3.connect("logs/campaign.db")

    query = """
    SELECT *
    FROM campaign_logs
    ORDER BY id DESC
    """

    history = pd.read_sql_query(query, connection)

    connection.close()

    return history


def clear_campaign_history():

    os.makedirs("logs", exist_ok=True)

    connection = sqlite3.connect("logs/campaign.db")

    cursor = connection.cursor()

    cursor.execute("DELETE FROM campaign_logs")

    # Reset auto-increment IDs (optional)
    cursor.execute("DELETE FROM sqlite_sequence WHERE name='campaign_logs'")

    connection.commit()
    connection.close()

def is_already_sent(email, interest):

    os.makedirs("logs", exist_ok=True)

    connection = sqlite3.connect("logs/campaign.db")

    cursor = connection.cursor()

    cursor.execute(
        "SELECT 1 FROM campaign_logs WHERE email = ? AND interest = ? AND status = 'Sent' LIMIT 1",
        (email, interest)
    )

    result = cursor.fetchone()

    connection.close()

    return result is not None