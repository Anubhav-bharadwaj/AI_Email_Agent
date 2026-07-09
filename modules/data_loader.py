import pandas as pd

def load_customers(file_path):
    customers = pd.read_csv(file_path)
    return customers