
# B2B Automated Outreach Pipeline
**Live Demo:** https://cold-email-outreach-7yrg.vercel.app/

This is a full-stack system that automates a B2B outreach workflow — from finding companies to generating and sending personalized emails.

The idea behind this project is to replicate how modern sales automation tools work (like Apollo, Clay, etc.), but in a simplified and transparent way where every step is visible and reviewable.

---

## What this project does

You give it a company domain, and the system takes over from there:

- Finds similar companies (lookalike businesses)
- Extracts decision makers from those companies
- Tries to enrich and verify their contact details
- Generates personalized outreach emails
- Shows you a preview of everything
- Lets you approve before sending anything

Nothing gets sent automatically — you stay in control.

---

## How the pipeline works

```

Seed Domain
↓
Find Similar Companies
↓
Get Decision Makers
↓
Enrich Contact Details
↓
Generate Emails
↓
Review Screen (Approval Step)
↓
Send Emails via Brevo

```

---

## Features

- Fully automated B2B lead discovery flow  
- Contact extraction and enrichment  
- Email generation with personalization  
- Manual approval step before sending emails  
- Retry handling for API failures and rate limits  
- Pipeline state stored for tracking runs  
- Clean separation of services for each stage  
- Optional live log support (SSE-ready)

---

## Tech Stack

**Backend**
- Node.js
- Express
- JSON file-based storage (used as fallback DB)
- REST APIs

**Frontend**
- React
- React Bootstrap
- Simple dashboard for running and reviewing pipeline

**Integrations**
- Ocean API → company discovery  
- Prospeo → decision maker data  
- Email enrichment service  
- Brevo → email sending  

---

## Why I built this

I wanted to understand how real outbound sales systems work behind the scenes — especially how tools:

- discover leads
- enrich data
- and automate outreach safely

So I built this as a full pipeline with a human approval layer instead of fully automated sending.

---

## Project structure

```

backend/
controllers/
services/
routes/
fallback/
server.js

frontend/
src/
components/
App.js

````

---

## How to run it

### Backend

```bash
cd backend
npm install
npm start
````

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Future improvements

* Real-time pipeline progress tracking
* WebSocket-based live updates
* Better retry queue system
* CRM integration
* Email performance tracking dashboard

---

## Note

This project is designed for learning and demonstration purposes. It shows how a multi-stage automation pipeline can be structured and controlled safely with human approval.
