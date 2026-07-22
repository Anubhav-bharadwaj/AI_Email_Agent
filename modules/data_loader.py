import pandas as pd

REQUIRED_COLUMNS = ["Name", "Email", "Interest"]


def load_customers(file_path):
    customers = pd.read_csv(file_path)
    return validate_customer_columns(customers)


def validate_customer_columns(customers):
    customers.columns = customers.columns.str.strip()

    column_map = {col.lower(): col for col in customers.columns}

    missing = [
        req for req in REQUIRED_COLUMNS
        if req.lower() not in column_map
    ]

    if missing:
        raise ValueError(
            f"CSV is missing required column(s): {', '.join(missing)}. "
            f"Required columns are: {', '.join(REQUIRED_COLUMNS)}."
        )

    rename_map = {
        column_map[req.lower()]: req
        for req in REQUIRED_COLUMNS
    }
    return customers.rename(columns=rename_map)