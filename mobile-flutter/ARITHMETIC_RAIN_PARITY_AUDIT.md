# ARITHMETIC RAIN PARITY AUDIT

## Web Source of Truth vs. Flutter Implementation

* **Web Component:** `frontend/src/components/ArithmeticRain/ArithmeticRainGame-saikrishna.js`
* **Web Supporting Modules:** `GameEngine.js`, `ScoreStatsManager.js`, `AudioSynthManager.js`, `VibrationManager.js`
* **Flutter Component:** `mobile-flutter/lib/screens/arithmetic_rain_game.dart`
* **Flutter Supporting Module:** `mobile-flutter/lib/utils/arithmetic_rain_data.dart`

---

## 1. Feature Parity Matrix

| Feature | Web Behavior | Flutter Implementation | Status | Required Action |
| :--- | :--- | :--- | :--- | :--- |
| **Top Header & Economy** | Back button + Live Coins (🪙) and XP (✨) balance | Top bar with Back to Hub action + real-time Coins and XP counters | **PASS** | Implemented in Flutter |
| **Menu View & Mode Selection** | 5 Game Modes: Practice, Classic (3 lives), Timed (2/5/10 min), Endless, Daily Challenge | Full 5 mode cards with Timed duration buttons (2m, 5m, 10m) and Daily streak badge | **PASS** | Implemented in Flutter |
| **Menu View Tabs** | 4 Tabs: "Stats", "Badges" (8 achievements), "Settings" (BGM/SFX/Haptics/Reset), "Logs" (History) | 4 Tabs with exact statistics, achievement unlock states, toggle switches, and session logs | **PASS** | Implemented in Flutter |
| **Countdown Phase** | 3-2-1 START! animated pulse countdown | 3-2-1 START! countdown with pulse styling and audio tone | **PASS** | Implemented in Flutter |
| **Falling Equations Engine** | Dynamic falling equation bubbles with operator-specific fall speed (Div: 12, Mul: 20, Add/Sub: 24) | Continuous falling bubbles physics on vertical canvas matching Web fall rates | **PASS** | Implemented in Flutter |
| **Difficulty Scaling by Score** | Level 1 (<100 pts), Level 2 (100-249 pts), Level 3 (250-499 pts), Level 4 (500+ pts) | Exact `generateQuestion` logic with Level 1–4 number ranges and integer division | **PASS** | Implemented in Flutter |
| **Daily Seeded PRNG** | Deterministic pseudo-random number generator from `getSeedFromDate(today)` | Exact `SeededRandom` PRNG implementing `sin(seed++) * 10000` | **PASS** | Implemented in Flutter |
| **Touch Keypad & Input** | 12-key numeric pad (`1-9`, `0`, `-`, `⌫`, `Clear`, `Submit`) + live typed input check | Responsive on-screen keypad with instant match detection and manual submit | **PASS** | Implemented in Flutter |
| **Scoring & Combo Multiplier** | Base: +/-(10), *(15), /(20). Multiplier: `1.0 + floor(combo/3)*0.1` (max 3.0x) | Exact `calculatePoints` port matching Web score formula | **PASS** | Implemented in Flutter |
| **Rewards & Economy** | Coins: `score / 20` (Practice `score / 40`). XP: `score / 10`. Daily flat +50 🪙, +100 XP | Exact `getSessionRewards` calculation added to profile balances | **PASS** | Implemented in Flutter |
| **Pause & In-Game Menu** | Back button / Pause button opens modal with Resume, Restart, Settings, Quit | Full Pause modal with Resume, Restart, Sound/Music/Haptic toggles, and Quit | **PASS** | Implemented in Flutter |
| **Results Summary Screen** | Final Score, Solved, Accuracy %, Max Combo, Avg Reaction, Rewards, Play Again, Menu | Complete Results screen with metric cards, earned rewards, and retry/home buttons | **PASS** | Implemented in Flutter |
| **8 Achievements** | `novice`, `scholar`, `einstein`, `perfectionist`, `rain_master`, `endless_survivor`, `speed_demon`, `daily_commuter` | 8 achievements model with local persistence and unlock evaluations | **PASS** | Implemented in Flutter |
| **Offline Persistence** | `cp_rain_stats`, `cp_rain_settings`, `cp_rain_achievements`, `cp_rain_daily`, `cp_rain_history` | `SharedPreferences` persistence for stats, high scores, streak, logs, and settings | **PASS** | Implemented in Flutter |
