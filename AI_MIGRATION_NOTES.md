# AI Migration Notes: Replacing Gemini with Local AI Solution

This document details the transition of CareerPath AI from Google Gemini API to a self-contained, organization-compliant local advisor solution.

## 1. What was Removed / Modified

* **Credentials**: The active `GEMINI_API_KEY` was cleared and replaced with the placeholder `GEMINI_API_KEY_REMOVED_PER_ORG_POLICY` in the following files:
  * `backend/.env`
  * `backend/-saikrishna.env`
  * `frontend/.env`
  * `frontend/-saikrishna.env`
* **Dependencies**: Removed `@google/genai` package from `backend/package.json`.
* **Git Exclusions**: Updated root `.gitignore` to explicitly prevent committing any future backup environment files (e.g. `*.env*` and `**/*.env*`).

---

## 2. Chosen Replacement Solution

* **Option Chosen**: **Option B (Local Rule-based & Template Matching Engine)**.
* **Why**: Runs 100% locally with zero external network calls, zero token costs, no API keys, and has no third-party package dependencies.
* **How it works**:
  * The backend parses user query keywords or survey responses (like coding, medical, commerce, 10th, 12th, or study abroad).
  * It matches them against structured career profiles.
  * It returns rich Markdown roadmaps, salary estimations in INR, milestones, required course checklists, and job role outlooks.

---

## 3. Deprecated Code Locations (For future cleanup)

All original Google Gemini SDK calls have been commented out and enclosed in clear deprecation blocks:

1. **Job Trends (`/api/overview` - lines 410-463 of [server.js](file:///c:/Users/saikr/OneDrive/Desktop/main%20appliication%201/careerpath-ai-updated%20%282259%29/careerpath-ai-final/backend/server.js))**
   * Enclosed in `// === DEPRECATED: Gemini API removed per org policy ===` comments.
   * Runs the local keyword processing system on live fetched jobs instead.

2. **Personalized Roadmaps (`/api/ai/recommendation` - lines 1122-1226 of [server.js](file:///c:/Users/saikr/OneDrive/Desktop/main%20appliication%201/careerpath-ai-updated%20%282259%29/careerpath-ai-final/backend/server.js))**
   * Enclosed in deprecation comments.
   * Calls `getLocalAIRecommendation(quizType, answers)` which returns rich local roadmaps dynamically matching the user's survey interests.

3. **Workspace Chat (`/api/chat` - lines 1412-1515 of [server.js](file:///c:/Users/saikr/OneDrive/Desktop/main%20appliication%201/careerpath-ai-updated%20%282259%29/careerpath-ai-final/backend/server.js))**
   * Enclosed in deprecation comments.
   * Calls `generateLocalResponse(sanitizedMsg, history, screenContext, mode)` to return expert, context-aware advice based on user chat queries and current app location.

4. **Streaming Workspace Chat (`/api/chat/stream` - lines 1555-1605 of [server.js](file:///c:/Users/saikr/OneDrive/Desktop/main%20appliication%201/careerpath-ai-updated%20%282259%29/careerpath-ai-final/backend/server.js))**
   * Enclosed in deprecation comments.
   * Streams the rule-based local answer in typed chunks back to the client using Server-Sent Events (SSE).

---

## 4. How to Clean Up Deprecated Blocks Later

If you decide to fully delete the commented-out code blocks later:
1. Search for `DEPRECATED` comments in `backend/server.js`.
2. Delete everything inside the `/* ... */` blocks between `// === DEPRECATED: Gemini ... ===` and `// === END DEPRECATED BLOCK ===`.
3. In `frontend/src/gemini.js` (if web SPA is retired), you can delete the file and remove `@google/generative-ai` from `frontend/package.json` dependencies.
