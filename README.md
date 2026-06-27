<div align="center">

# edocAI

### Enterprise Asynchronous Document Intelligence

*Transform unstructured invoices and receipts into structured JSON using AI. Built with a focus on asynchronous processing, user isolation, and enterprise-grade cloud architecture.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python&logoColor=white)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Celery](https://img.shields.io/badge/Celery-5.3-green?logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Railway](https://img.shields.io/badge/Railway-Cloud-0B1141?logo=railway&logoColor=white)](https://railway.app/)

</div>

---

## Architecture & System Design

This project was designed to solve a specific ML Engineering problem: **API Gateway Timeouts**. If an AI model takes 10 seconds to process a document, standard web servers will drop the connection. 

edocAI solves this using the **Producer-Consumer pattern** via a message queue:

1. **FastAPI (Producer):** Receives the file, saves it to object storage, saves a `PENDING` record to the database, pushes a message to Redis, and returns `202 Accepted` to the client in ~100ms.
2. **Upstash Redis:** Acts as the message broker holding the job ticket.
3. **Celery Worker (Consumer):** Pulls the message from Redis, downloads the file, runs the AI inference pipeline, and updates the database to `COMPLETED`.

### AI Pipeline & Fallback Router
To ensure maximum reliability on a free tier, the worker uses a fallback router:
*   **Attempt 1:** Send the image to Google Gemini 1.5 Flash (Vision Model).
*   **Attempt 2 (If rate-limited):** Route to a local PyMuPDF text extractor + LLM fallback. 
*   *All extracted data is returned as strictly typed JSON.*

### Security & Multi-Tenancy
*   **Authentication:** Stateless JWTs (JSON Web Tokens) with Bearer auth.
*   **Isolation:** Strict database-level Row-Level Security. Users can only `SELECT` documents where `owner_id` matches their session token.
*   **Passwords:** Hashed using the raw Bcrypt algorithm (avoiding `passlib` OS-level bugs).

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16, Tailwind CSS | SaaS UI, Dynamic Theming, SSR |
| **Backend API** | FastAPI | RESTful endpoints, Automatic OpenAPI docs |
| **Database** | Neon (Serverless Postgres) | Managed relational data |
| **Message Queue** | Upstash Redis | Serverless Celery message broker |
| **Object Storage** | Supabase Storage | Free S3-compatible file storage |
| **AI Inference** | Google Gemini 1.5 Flash | Multimodal document extraction |
| **Background Workers**| Celery | Distributed task queue |
| **Hosting** | Railway (Backend), Vercel (Frontend) | $0.00 Cloud Deployment |

---

## Cloud Deployment

This project is configured for zero-downtime deployment on free-tier cloud services.

1.  **Database & Storage:** Provisioned on Neon and Supabase.
2.  **Backend & Worker:** Push to GitHub. Connect GitHub to Railway. Railway automatically builds the `web` (FastAPI) and `worker` (Celery) based on the `Procfile`.
3.  **Frontend:** Push to GitHub. Connect to Vercel. Update environment variables to point to the Railway API URL.
4.  **CORS:** Ensure the Railway API URL is added to the `allow_origins` list in `main.py`.

---

## Key Decisions

1.  **Why Redis/Celery instead of Threading?** 
    Python's GIL makes true multithreading difficult for CPU/AI bound tasks. Offloading to a separate Celery worker process ensures the API remains responsive and can scale horizontally.
2.  **Why raw `bcrypt` instead of `passlib`?**
    `passlib` has known incompatibilities with certain OS environments (specifically macOS DNS/Fork behaviors). Using the raw `bcrypt` library reduces dependency bloat and eliminates these edge cases.
3.  **Why Google Gemini Interactions API?**
    Standard REST vision APIs require managing base64 encoding, MIME types, and complex JSON payloads. The new Gemini Interactions API abstracts this away, resulting in significantly cleaner Python code.
4.  **Why User Isolation at the DB level?**
    Rather than filtering documents in Python memory, we use `owner_id` foreign keys in PostgreSQL. This guarantees data isolation even if a bug occurs in the Python logic.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
