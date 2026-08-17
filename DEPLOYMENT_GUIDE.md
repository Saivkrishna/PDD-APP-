# CareerPath AI - IT Handover & Deployment Guide 🚀

This document outlines the architecture, configuration, and steps required to migrate and host CareerPath AI inside your organization's infrastructure.

---

## 1. Project Architecture

The application is structured as a decoupled web application:
* **Frontend:** A React Single Page Application (SPA).
* **Backend:** A Node.js & Express API Server featuring a **local AI recommendation engine** (utilizing `@xenova/transformers` and `onnxruntime-node`).
* **Database:** Google Firebase Firestore.

---

## 2. Setting Up the Organization's Database (Firebase Firestore)

Your organization should set up and own its own Firebase project to ensure complete control and compliance.

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project (e.g., `company-careerpath-ai`).
3. Enable **Firestore Database** in **Production Mode** and select your preferred cloud region.

### Step 2: Extract Configuration Variables
Generate a Web App config inside your Firebase console and retrieve the following credentials:
* `FIREBASE_API_KEY`
* `FIREBASE_AUTH_DOMAIN`
* `FIREBASE_PROJECT_ID`
* `FIREBASE_STORAGE_BUCKET`
* `FIREBASE_MESSAGING_SENDER_ID`
* `FIREBASE_APP_ID`

### Step 3: Run Database Migrations
To seed the new database with all the default users, path data, and curriculum structures:
1. Navigate to the `backend/` directory.
2. Create a `.env` file containing the new Firebase configuration variables (see `.env.example`).
3. Install dependencies and run the migration script:
   ```bash
   npm install
   node migrate_to_firebase.js
   ```
   *(This parses the local data snapshots and seeds them directly into your remote Firestore collection).*

---

## 3. Backend Server Deployment (Docker)

Because the backend utilizes local AI model runners (`onnxruntime-node`), it is recommended to host the backend as a **persistent container** or **dedicated virtual machine** to avoid serverless cold starts.

A production-ready [Dockerfile](file:///c:/Users/saikr/OneDrive/Desktop/main%20appliication%201/careerpath-ai-updated%20%282259%29/careerpath-ai-final/backend/Dockerfile) has been added to the `backend/` directory.

### Docker Build & Run Instructions
To build and run the backend locally or inside your cloud container runtime (AWS ECS, Google Cloud Run, Azure Container App):

```bash
# Build the Docker image
docker build -t careerpath-backend ./backend

# Run the container
docker run -d \
  -p 2259:2259 \
  -e FIREBASE_API_KEY="your_api_key" \
  -e FIREBASE_AUTH_DOMAIN="your_auth_domain" \
  -e FIREBASE_PROJECT_ID="your_project_id" \
  -e FIREBASE_STORAGE_BUCKET="your_storage_bucket" \
  -e FIREBASE_MESSAGING_SENDER_ID="your_sender_id" \
  -e FIREBASE_APP_ID="your_app_id" \
  -e PORT=2259 \
  --name careerpath-backend-service \
  careerpath-backend
```

---

## 4. Frontend Deployment

### Option A: Firebase Hosting (Recommended)
1. Install the Firebase CLI tool: `npm install -g firebase-tools`
2. Log in using the organization's account: `firebase login`
3. Initialize the hosting target: `firebase init hosting`
   * Select the project created in Section 2.
   * Set the public directory to `frontend/build`.
   * Configure as a single-page app (rewrite all URLs to `/index.html`).
4. Build and deploy:
   ```bash
   # From root directory
   npm run build-frontend
   firebase deploy --only hosting
   ```

### Option B: GitHub Pages / AWS S3 / Azure Static Web Apps
Since the frontend builds into static HTML/JS/CSS assets inside `frontend/build`, it can be served from any static asset provider.

---

## 5. Security & Privacy Compliance Note

* **Zero External AI Calls:** The backend runs AI/NLP classification completely locally on the server CPU/GPU. No user prompts, chat messages, or survey scores are sent to external services (like OpenAI or public Gemini endpoints).
* **Environment Variables:** All API keys and secrets must be configured via environment variables. Do not commit `.env` files to git repositories.
