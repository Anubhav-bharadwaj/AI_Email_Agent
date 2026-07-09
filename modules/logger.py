import sqlite3


def initialize_database():

    connection = sqlite3.connect("logs/campaign.db")

    cursor = connection.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS campaign_logs(

        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT,
        email TEXT,
        interest TEXT,
        status TEXT

    )
    """)

    connection.commit()
    connection.close()


def log_campaign(name, email, interest, status):

    connection = sqlite3.connect("logs/campaign.db")

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO campaign_logs
        (customer_name, email, interest, status)

        VALUES (?, ?, ?, ?)
        """,
        (name, email, interest, status)
    )

    connection.commit()
    connection.close()