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

## 🎯 Architecture & System Design

This project was designed to solve a specific ML Engineering problem: **API Gateway Timeouts**. If an AI model takes 10 seconds to process a document, standard web servers will drop the connection. 

edocAI solves this using the **Producer-Consumer pattern** via a message queue:

1. **FastAPI (Producer):** Receives the file, saves it to object storage, saves a `PENDING` record to the database, pushes a message to Redis, and returns `202 Accepted` to the client in ~100ms.
2. **Upstash Redis:** Acts as the message broker holding the job ticket.
3. **Celery Worker (Consumer):** Pulls the message from Redis, downloads the file, runs the AI inference pipeline, and updates the database to `COMPLETED`.

### 🧠 AI Pipeline & Fallback Router
To ensure maximum reliability on a free tier, the worker uses a fallback router:
*   **Attempt 1:** Send the image to Google Gemini 1.5 Flash (Vision Model).
*   **Attempt 2 (If rate-limited):** Route to a local PyMuPDF text extractor + LLM fallback. 
*   *All extracted data is returned as strictly typed JSON.*

### 🔐 Security & Multi-Tenancy
*   **Authentication:** Stateless JWTs (JSON Web Tokens) with Bearer auth.
*   **Isolation:** Strict database-level Row-Level Security. Users can only `SELECT` documents where `owner_id` matches their session token.
*   **Passwords:** Hashed using the raw Bcrypt algorithm (avoiding `passlib` OS-level bugs).

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16, Tailwind CSS | SaaS UI, Dynamic Theming, SSR |
| **Backend API** | FastAPI | RESTful endpoints, Automatic OpenAPI docs |
| **Database** | Neon (Serverless Postgres) | Managed relational data |
| **Message Queue** | Upstash Redis | Serverless Celery message broker |
| **Object Storage** | Supabase Storage | Free S3-compatible file storage |
| **AI Inference** | Google Gemini 1.5 Flash | Multimodal document extraction |
| **Background Workers**| Celery | Distributed task queue |
| **Hosting** | Railway (Backend), Vercel (Frontend) | Cloud Deployment |
