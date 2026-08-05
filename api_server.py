import io
import pandas as pd
import html
import uuid
import threading
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from modules.database import get_campaign_history, clear_campaign_history
from modules.logger import initialize_database, log_campaign
from modules.data_loader import validate_customer_columns
from modules.email_generator import generate_email
from modules.utils import extract_subject_and_body
from modules.file_manager import save_email
from modules.email_sender import send_email
from modules.database import is_already_sent

app = FastAPI(title="AI Email Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

initialize_database()

generate_jobs = {}


class Customer(BaseModel):
    id: str
    name: str
    email: str
    interest: str


send_jobs = {}


class DraftItem(BaseModel):
    id: str
    customerId: str
    subject: str
    bodyPlain: str


class SendRequest(BaseModel):
    customers: List[Customer]
    drafts: List[DraftItem]
    isDryRun: bool


class GenerateRequest(BaseModel):
    customers: List[Customer]


def _run_generate_job(job_id, customers):
    drafts = []
    errors = []

    for customer in customers:
        try:
            ai_email = generate_email(customer["name"], customer["interest"])
            subject, body = extract_subject_and_body(ai_email)
            save_email(customer["name"], ai_email)

            drafts.append({
                "id": f"draft_{customer['id']}",
                "customerId": customer["id"],
                "subject": subject,
                "bodyPlain": body,
                "bodyHtml": f'<pre style="white-space:pre-wrap;font-family:inherit;">{html.escape(body)}</pre>',
            })
        except Exception as e:
            errors.append({
                "customerId": customer["id"],
                "name": customer["name"],
                "error": str(e),
            })

        generate_jobs[job_id]["completed"] += 1

    generate_jobs[job_id]["status"] = "done"
    generate_jobs[job_id]["drafts"] = drafts
    generate_jobs[job_id]["errors"] = errors

def _run_send_job(job_id, customers, drafts, is_dry_run):
    customer_map = {c["id"]: c for c in customers}
    sent = 0
    failed = 0
    skipped = 0

    for draft in drafts:
        customer = customer_map.get(draft["customerId"])
        if not customer:
            failed += 1
            send_jobs[job_id]["completed"] += 1
            continue

        email = customer["email"]
        name = customer["name"]
        interest = customer["interest"]

        if is_already_sent(email):
            skipped += 1
            send_jobs[job_id]["completed"] += 1
            continue

        if is_dry_run:
            sent += 1
        elif send_email(email, draft["subject"], draft["bodyPlain"]):
            sent += 1
            log_campaign(name, email, interest, "Sent")
        else:
            failed += 1
            log_campaign(name, email, interest, "Failed")

        send_jobs[job_id]["completed"] += 1

    send_jobs[job_id]["status"] = "done"
    send_jobs[job_id]["sent"] = sent
    send_jobs[job_id]["failed"] = failed
    send_jobs[job_id]["skipped"] = skipped

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/history")
def get_history():
    history = get_campaign_history()
    history = history.rename(columns={"customer_name": "name"})

    def to_iso_utc(ts):
        if not isinstance(ts, str) or not ts:
            return None
        return ts.replace(" ", "T") + "Z"

    history["timestamp"] = history["timestamp"].apply(to_iso_utc)

    return history.to_dict(orient="records")


@app.delete("/api/history")
def delete_history():
    clear_campaign_history()
    return {"status": "cleared"}

@app.post("/api/customers/upload")
async def upload_customers(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a valid CSV file.")

    contents = await file.read()

    try:
        customers = pd.read_csv(io.BytesIO(contents))
        customers = validate_customer_columns(customers)
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="The uploaded CSV is empty.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    customers = customers.drop_duplicates(subset="Email", keep="first")
    customers = customers.reset_index(drop=True)

    result = [
        {
            "id": str(idx),
            "name": row["Name"],
            "email": row["Email"],
            "interest": row["Interest"],
        }
        for idx, row in customers.iterrows()
    ]

    return {"customers": result}

@app.post("/api/campaigns/generate")
def start_generate(payload: GenerateRequest):
    customers = [c.dict() for c in payload.customers]

    if not customers:
        raise HTTPException(status_code=400, detail="No customers provided.")

    job_id = str(uuid.uuid4())
    generate_jobs[job_id] = {
        "status": "running",
        "completed": 0,
        "total": len(customers),
        "drafts": [],
        "errors": [],
    }

    thread = threading.Thread(target=_run_generate_job, args=(job_id, customers), daemon=True)
    thread.start()

    return {"jobId": job_id}


@app.get("/api/campaigns/generate/status/{job_id}")
def get_generate_status(job_id: str):
    job = generate_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job

@app.post("/api/campaigns/send")
def start_send(payload: SendRequest):
    customers = [c.dict() for c in payload.customers]
    drafts = [d.dict() for d in payload.drafts]

    if not drafts:
        raise HTTPException(status_code=400, detail="No drafts to send.")

    job_id = str(uuid.uuid4())
    send_jobs[job_id] = {
        "status": "running",
        "completed": 0,
        "total": len(drafts),
        "sent": 0,
        "failed": 0,
        "skipped": 0,
    }

    thread = threading.Thread(
        target=_run_send_job,
        args=(job_id, customers, drafts, payload.isDryRun),
        daemon=True,
    )
    thread.start()

    return {"jobId": job_id}


@app.get("/api/campaigns/send/status/{job_id}")
def get_send_status(job_id: str):
    job = send_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job