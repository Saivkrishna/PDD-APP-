# REASONING UI PARITY AUDIT

## Web Source of Truth vs. Flutter Implementation

* **Web Component:** `frontend/src/components/ReasoningPracticePage.jsx`
* **Flutter Component:** `mobile-flutter/lib/screens/reasoning_practice_page.dart`
* **Dataset:** 200 Questions across 10 Topics (Easy: 71, Medium: 69, Hard: 60)

---

## 1. Feature Parity Matrix

| Web UI Feature | Web Behavior | Flutter Implementation | Status |
| :--- | :--- | :--- | :--- |
| **Top Navigation / Header** | Shows Reasoning Practice Title, Subtitle, and "Back to Home" action | `AppBar` with gradient purple styling, "Reasoning Practice" title, and Back navigation | **PASS** |
| **Mode Selector** | 3 tabs: "Practice Mode", "Test Mode", "Review Last Attempt" | Segmented button/tab selector with exact 3 modes and icons | **PASS** |
| **Global Mixed Test Banner** | "Start Global Test (30 Mixed Questions) 🚀" card | Featured Gradient Card with "Start Global Test" CTA and direct launch of 30 mixed questions | **PASS** |
| **Topic Grid Cards** | 10 Topic Cards with icon, title, description, question count badge | 10 Topic Cards matching 10 Web categories with icon, title, subtitle, and dynamic verified question counts | **PASS** |
| **Question Count Badge** | Displays actual topic question count (e.g., 15 Qs, 20 Qs, 30 Qs) | Exact dynamic count retrieved from `ReasoningDataRepository` (`${topic.questionCount} Questions`) | **PASS** |
| **Topic Action Buttons** | "Start Practice →", "Start Test →", or "Review Solutions" based on active mode | Dynamic action button matching current mode ("Start Practice →", "Start Timed Test →", "Review Solutions →") | **PASS** |
| **Question Display Screen** | Header with Category, Difficulty pill (Easy/Medium/Hard), Question Number/Total | Category badge, difficulty badge (color-coded green/amber/rose), Question x of y progress | **PASS** |
| **Quiz Timer** | Test mode displays countdown or elapsed timer | Test mode displays live elapsed timer (mm:ss) | **PASS** |
| **Options Selection** | 4 Options with Letter prefix (A, B, C, D) | 4 Radio-style option cards with A, B, C, D indicators and smooth touch feedback | **PASS** |
| **Instant Practice Feedback** | In Practice mode: Shows correct (green) and incorrect (red) immediately upon selection | Immediate visual feedback with green checkmark for correct and red cross for incorrect options | **PASS** |
| **Worked Explanation** | In Practice mode / Review mode: displays complete Step-by-step Solution | "💡 Step-by-Step Solution" card with full explanation text | **PASS** |
| **Shortcut / Pro Tip** | In Practice mode / Review mode: displays Pro Shortcut tip when available | "⚡ Pro Tip / Shortcut" box with amber highlight and icon | **PASS** |
| **Company Tagging** | Shows target companies (e.g., TCS, Infosys, Amazon, Cognizant) when tagged | "🏢 Seen In: {Company}" badge displayed on question header/solution | **PASS** |
| **Deferred Test Mode** | In Test mode: selects option without showing answer; allows navigating and reviewing before submit | Option selected state highlighted without revealing correct answer until test submission | **PASS** |
| **Navigation Controls** | Previous Question, Next Question, and Submit/Finish buttons | "Previous", "Next", and "Submit Test / Finish" action buttons | **PASS** |
| **Scorecard / Results Screen** | Circular score badge ({score}/{total}), Accuracy %, Time Taken, Mistakes Count | Complete Result Card with Score circle, Accuracy percentage, Time taken, Breakdown statistics | **PASS** |
| **Solutions Review Screen** | Detailed question-by-question accordion/card review showing user's choice vs correct choice | Comprehensive scrollable Review section with User Choice badge, Correct Answer badge, and Explanations | **PASS** |
| **Attempt Persistence** | Saves last test attempt to local storage for "Review Last Attempt" | Saves attempt timestamp, score, answers, and questions to `SharedPreferences` (`cp_reasoning_last_attempt_{topicId}`) | **PASS** |
| **Empty State** | Review mode without attempt shows informative empty state | "No Previous Test Attempt Found" card with "Start a Test" prompt | **PASS** |
| **Loading State** | Smooth loading indicator during async question fetching | Centered themed CircularProgressIndicator with "Loading questions..." | **PASS** |
| **Error / Fallback State** | Falls back to local bundled questions if API is unavailable | Seamless offline fallback to `ReasoningDataRepository` (200 questions bundled in APK) | **PASS** |
| **Mobile UX / Scrolling** | Full vertical scroll, SafeArea padding, no overflow on small/large screens | Wrap inside `SingleChildScrollView` + `SafeArea`, auto-wrapping text, no RenderFlex overflows | **PASS** |

---

## 2. Topic & Question Verification

| Topic ID | Topic Name | Total Questions | Easy | Medium | Hard | Parity Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `series` | Series Completion | 15 | 5 | 5 | 5 | **PASS** |
| `coding-decoding` | Coding & Decoding | 15 | 5 | 5 | 5 | **PASS** |
| `syllogism` | Syllogisms | 15 | 5 | 5 | 5 | **PASS** |
| `blood-relations` | Blood Relations | 20 | 8 | 6 | 6 | **PASS** |
| `directions` | Direction Sense | 15 | 5 | 5 | 5 | **PASS** |
| `puzzles` | Analytical Puzzles | 15 | 5 | 5 | 5 | **PASS** |
| `logical-sequence` | Logical Sequence of Words | 30 | 13 | 13 | 4 | **PASS** |
| `verbal-reasoning` | Verbal Reasoning | 30 | 10 | 10 | 10 | **PASS** |
| `non-verbal-reasoning` | Non-Verbal Reasoning | 30 | 10 | 10 | 10 | **PASS** |
| `data-interpretation` | Data Interpretation | 15 | 5 | 5 | 5 | **PASS** |
| **TOTAL** | **10 Topics** | **200** | **71** | **69** | **60** | **100% PASS** |
